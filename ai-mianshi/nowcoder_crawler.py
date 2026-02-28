from __future__ import annotations

import re
from dataclasses import dataclass
from html import unescape
from typing import Iterable
from urllib.parse import quote

import requests


@dataclass(frozen=True)
class InterviewExperience:
    title: str
    url: str
    content: str
    questions: list[str]


def _strip_html(html: str) -> str:
    html = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", html)
    html = re.sub(r"(?is)<br\s*/?>", "\n", html)
    html = re.sub(r"(?is)</p\s*>", "\n", html)
    html = re.sub(r"(?is)<[^>]+>", " ", html)
    text = unescape(html)
    text = re.sub(r"[ \t\r\f\v]+", " ", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract_questions(text: str, max_items: int = 80) -> list[str]:
    candidates: list[str] = []
    for line in re.split(r"[\n]+", text):
        s = line.strip(" -\t")
        if not s:
            continue
        if ("?" not in s) and ("？" not in s) and ("问：" not in s) and ("Q：" not in s) and ("Q:" not in s):
            continue
        s = re.sub(r"\s+", " ", s)
        if len(s) < 6 or len(s) > 140:
            continue
        candidates.append(s)

    seen: set[str] = set()
    result: list[str] = []
    for q in candidates:
        if q in seen:
            continue
        seen.add(q)
        result.append(q)
        if len(result) >= max_items:
            break
    return result


def _pick_urls_from_search_html(html: str) -> list[str]:
    hrefs = re.findall(r'href="(/discuss/[^"#?]+[^"]*)"', html)
    urls = []
    seen = set()
    for href in hrefs:
        url = "https://www.nowcoder.com" + href
        if url in seen:
            continue
        seen.add(url)
        urls.append(url)
        if len(urls) >= 50:
            break
    return urls


def _safe_get(url: str, *, timeout_seconds: int = 20) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
    }
    resp = requests.get(url, headers=headers, timeout=timeout_seconds)
    return resp.text


def crawl_interview_experiences(keyword: str, limit: int) -> list[InterviewExperience]:
    keyword = (keyword or "").strip()
    if not keyword:
        return []
    if limit <= 0:
        return []
    limit = min(limit, 30)

    search_url = f"https://www.nowcoder.com/search?type=post&query={quote(keyword)}"
    html = _safe_get(search_url)
    urls = _pick_urls_from_search_html(html)
    if not urls:
        return []

    results: list[InterviewExperience] = []
    for url in urls:
        if len(results) >= limit:
            break
        try:
            detail_html = _safe_get(url)
        except requests.RequestException:
            continue

        text = _strip_html(detail_html)
        title_match = re.search(r"(?is)<title[^>]*>(.*?)</title>", detail_html)
        title = _strip_html(title_match.group(1)) if title_match else url
        questions = _extract_questions(text)
        content = text[:8000]
        results.append(InterviewExperience(title=title, url=url, content=content, questions=questions))

    return results


def flatten_question_bank(items: Iterable[InterviewExperience], max_questions: int = 200) -> list[dict[str, str]]:
    bank: list[dict[str, str]] = []
    seen: set[str] = set()
    for it in items:
        for q in it.questions:
            key = f"{it.url}::{q}"
            if key in seen:
                continue
            seen.add(key)
            bank.append({"question": q, "source_title": it.title, "source_url": it.url})
            if len(bank) >= max_questions:
                return bank
    return bank
