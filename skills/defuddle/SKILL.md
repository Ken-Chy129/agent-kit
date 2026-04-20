---
name: defuddle
description: 使用 Defuddle CLI 从网页中提取干净的 Markdown 内容，去除杂乱元素和导航栏以节省 token。当用户提供 URL 需要阅读或分析时，优先使用此工具代替 WebFetch，适用于在线文档、文章、博客文章或任何标准网页。不要用于以 .md 结尾的 URL——它们已经是 Markdown，直接使用 WebFetch。
---

# Defuddle

使用 Defuddle CLI 从网页中提取干净可读的内容。对于标准网页，优先使用此工具代替 WebFetch——它会去除导航栏、广告和杂乱元素，减少 token 消耗。

如未安装：`npm install -g defuddle`

## 用法

始终使用 `--md` 获取 Markdown 输出：

```bash
defuddle parse <url> --md
```

保存到文件：

```bash
defuddle parse <url> --md -o content.md
```

提取特定元数据：

```bash
defuddle parse <url> -p title
defuddle parse <url> -p description
defuddle parse <url> -p domain
```

## 输出格式

| 标志 | 格式 |
|------|------|
| `--md` | Markdown（默认选择） |
| `--json` | 同时包含 HTML 和 Markdown 的 JSON |
| （无） | HTML |
| `-p <name>` | 特定元数据属性 |
