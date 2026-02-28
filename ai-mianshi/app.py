import os
from typing import Any

from flask import Flask, jsonify, render_template, request

from ai_service import GlmError, chat_completion
from nowcoder_crawler import crawl_interview_experiences, flatten_question_bank
from pdf_resume import ResumeParseError, extract_pdf_text


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
)


def _truncate(text: str, max_chars: int) -> str:
    text = (text or "").strip()
    if len(text) <= max_chars:
        return text
    return text[: max(0, max_chars - 10)] + "\n...(已截断)"


def _module_instructions(module_key: str) -> tuple[str, str]:
    module_key = (module_key or "").strip()
    if module_key == "experience":
        return (
            "面经总结与考点分析",
            "\n".join(
                [
                    "输出要求（Markdown）：",
                    "1) 面经要点总结（按主题归类）",
                    "2) 高频考点清单（按优先级排序）",
                    "3) 可能追问与深入点（每项给追问示例）",
                    "4) 复习路线（1-3 天冲刺版）",
                ]
            ),
        )
    if module_key == "predict":
        return (
            "模拟面试题目预测",
            "\n".join(
                [
                    "输出要求（Markdown）：",
                    "1) 预测题目清单（按模块：项目/八股/算法/系统设计/行为）",
                    "2) 每题给出高分作答要点（要点式）",
                    "3) 结合简历的定制追问（至少 8 条）",
                    "4) 最后一页给“自测打分表”",
                ]
            ),
        )
    return (
        "简历优化建议",
        "\n".join(
            [
                "输出要求（Markdown）：",
                "1) 关键问题清单（按影响程度排序）",
                "2) 可直接替换的优化文案（项目经历至少 2 段示例）",
                "3) 针对目标岗位的能力映射表（能力->证据->如何补强）",
                "4) 面试讲述建议（STAR/结构化讲述）",
            ]
        ),
    )


def _build_messages(
    *,
    keyword: str,
    module_key: str,
    resume_text: str,
    experiences: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    module_name, module_requirement = _module_instructions(module_key)

    exp_blocks: list[str] = []
    for idx, it in enumerate(experiences, start=1):
        title = it.get("title") or f"面经 {idx}"
        url = it.get("url") or ""
        content = it.get("content") or ""
        exp_blocks.append(
            "\n".join(
                [
                    f"【面经 {idx}】{title}",
                    f"链接：{url}",
                    "内容：",
                    _truncate(content, 4000),
                ]
            )
        )

    user_content = "\n\n".join(
        [
            "你是一名资深技术面试教练。",
            f"目标关键词（公司+岗位）：{keyword}",
            f"分析模块：{module_name}",
            "",
            "简历内容：",
            _truncate(resume_text, 6000) if resume_text else "(未提供简历或解析为空)",
            "",
            "抓取到的牛客面经：",
            "\n\n".join(exp_blocks) if exp_blocks else "(未抓取到有效面经，基于关键词与简历进行推断)",
            "",
            module_requirement,
            "",
            "额外约束：",
            "1) 内容要具体可执行，避免空话。",
            "2) 如果信息不足，先列出假设，再给建议。",
            "3) 不要输出与任务无关的内容。",
        ]
    ).strip()

    return [
        {"role": "system", "content": "请用中文输出，使用 Markdown 排版。"},
        {"role": "user", "content": user_content},
    ]


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/analyze")
def analyze():
    api_key = (request.form.get("api_key") or "").strip()
    keyword = (request.form.get("keyword") or "").strip()
    module_key = (request.form.get("module") or "").strip()
    max_count_raw = (request.form.get("max_count") or "").strip()

    if not api_key:
        return jsonify({"error": "缺少 GLM-4.6 API Key"}), 400
    if not keyword:
        return jsonify({"error": "缺少牛客网搜索词（公司+岗位）"}), 400

    try:
        max_count = int(max_count_raw) if max_count_raw else 8
    except ValueError:
        max_count = 8
    max_count = max(1, min(max_count, 30))

    warnings: list[str] = []

    resume_text = ""
    resume_file = request.files.get("resume_file")
    if resume_file and getattr(resume_file, "filename", ""):
        try:
            resume_text = extract_pdf_text(resume_file.stream)
        except ResumeParseError as exc:
            warnings.append(str(exc))

    experiences_raw: list[dict[str, Any]] = []
    question_bank: list[dict[str, str]] = []
    try:
        experiences = crawl_interview_experiences(keyword, max_count)
        experiences_raw = [
            {"title": it.title, "url": it.url, "content": it.content, "questions": it.questions}
            for it in experiences
        ]
        question_bank = flatten_question_bank(experiences)
    except Exception:
        experiences_raw = []
        question_bank = []
        warnings.append("牛客抓取失败或被反爬拦截，可稍后重试或降低抓取数量。")

    messages = _build_messages(
        keyword=keyword,
        module_key=module_key,
        resume_text=resume_text,
        experiences=experiences_raw,
    )

    try:
        resp = chat_completion(
            api_key=api_key,
            messages=messages,
            model="glm-4.6",
            temperature=1.0,
            max_tokens=65536,
            thinking_enabled=True,
        )
    except GlmError as exc:
        return jsonify({"error": str(exc), "warnings": warnings, "question_bank": question_bank}), 502

    return jsonify(
        {
            "report_markdown": resp.content,
            "warnings": warnings,
            "question_bank": question_bank,
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
