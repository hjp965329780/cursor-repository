# 牛客 AI 面试教练

参考：https://blog.csdn.net/lwcwam/article/details/153743973
基于 `rule.mdc` 实现的面试辅助工具，支持：

- 使用 GLM-4.6 生成分析报告
- 根据牛客搜索词抓取面经内容
- 解析 PDF 简历
- 按模块输出面试建议
- 在右侧侧边栏展示原始问题题库

## 功能说明

### 用户输入

- GLM-4.6 API Key
- 牛客网搜索词（公司 + 岗位）
- PDF 简历（可选）
- 分析模块（3 选 1）
- 最大抓取面经数量（1~30）

### 分析模块

- `experience`：面经总结与考点分析
- `predict`：模拟面试题目预测
- `resume`：简历优化建议

## 项目结构

```text
ai-mianshi/
├── app.py                 # Flask 后端入口
├── ai_service.py          # GLM-4.6 调用封装
├── nowcoder_crawler.py    # 牛客面经抓取与题目提取
├── pdf_resume.py          # PDF 简历解析
├── templates/
│   └── index.html         # 前端页面
└── rule.mdc               # 需求说明
```

## 本地运行

### 1) 安装依赖

```bash
python3 -m pip install flask requests pypdf
```

### 2) 启动服务

```bash
python3 app.py
```

默认监听：`http://127.0.0.1:5000`

## 页面交互流程

1. 左侧填写 API Key、牛客搜索词、选择模块、上传简历（可选）
2. 点击“生成分析报告”
3. 中间显示 AI 生成的分析报告
4. 右侧显示抓取结果中抽取的原始问题题库

## 接口说明

### `POST /analyze`

`multipart/form-data` 字段：

- `api_key`：GLM-4.6 API Key（必填）
- `keyword`：牛客搜索词（必填）
- `module`：`experience | predict | resume`
- `max_count`：最大抓取数量
- `resume_file`：PDF 文件（可选）

返回 JSON：

- `report_markdown`：分析报告（Markdown 文本）
- `question_bank`：题库数组（问题 + 来源）
- `warnings`：警告信息数组
- `error`：失败时返回

## 注意事项

- 当前抓取依赖网页结构，可能受反爬策略影响
- 若抓取失败，系统会给出警告，并尽量基于关键词和简历继续生成报告
- API Key 会直接作为 `Authorization` 请求头传给 GLM 接口，请确保有效
