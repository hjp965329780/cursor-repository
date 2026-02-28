import json
from dataclasses import dataclass
from typing import Any

import requests


@dataclass(frozen=True)
class GlmResponse:
    content: str
    raw: dict[str, Any]


class GlmError(RuntimeError):
    pass


def chat_completion(
    *,
    api_key: str,
    messages: list[dict[str, Any]],
    model: str = "glm-4.6",
    temperature: float = 1.0,
    max_tokens: int = 65536,
    thinking_enabled: bool = True,
    timeout_seconds: int = 120,
) -> GlmResponse:
    url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": api_key.strip(),
    }
    payload: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
    }
    if thinking_enabled:
        payload["thinking"] = {"type": "enabled"}

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=timeout_seconds)
    except requests.RequestException as exc:
        raise GlmError(f"GLM 请求失败：{exc}") from exc

    if resp.status_code < 200 or resp.status_code >= 300:
        text = resp.text
        raise GlmError(f"GLM 返回错误：HTTP {resp.status_code}，响应：{text[:2000]}")

    try:
        data = resp.json()
    except json.JSONDecodeError:
        raise GlmError(f"GLM 返回非 JSON：{resp.text[:2000]}")

    try:
        content = data["choices"][0]["message"]["content"]
    except Exception as exc:
        raise GlmError(f"GLM 响应结构异常：{json.dumps(data, ensure_ascii=False)[:2000]}") from exc

    return GlmResponse(content=content, raw=data)
