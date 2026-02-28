from __future__ import annotations

from typing import BinaryIO


class ResumeParseError(RuntimeError):
    pass


def extract_pdf_text(file_obj: BinaryIO) -> str:
    try:
        from pypdf import PdfReader
    except Exception as exc:
        raise ResumeParseError("缺少依赖：pypdf") from exc

    try:
        reader = PdfReader(file_obj)
        texts: list[str] = []
        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                texts.append(text)
        return "\n".join(texts).strip()
    except Exception as exc:
        raise ResumeParseError(f"解析 PDF 失败：{exc}") from exc
