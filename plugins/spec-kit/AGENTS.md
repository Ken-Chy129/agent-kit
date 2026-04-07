# AGENTS.md

本文件为 AI 编码智能体（Claude Code、Cursor、Copilot、Antigravity 等）在本仓库中工作时提供指导。

## 仓库概述

面向 Claude.ai 和 Claude Code 的技能集合，为资深软件工程师设计。技能是打包好的指令和脚本，用于扩展 Claude 和你的编码智能体的能力。

## 创建新技能

### 目录结构

```
skills/
  {skill-name}/           # kebab-case 目录名
    SKILL.md              # 必需：技能定义
    scripts/              # 必需：可执行脚本
      {script-name}.sh    # Bash 脚本（推荐）
  {skill-name}.zip        # 必需：打包用于分发
```

### 命名规范

- **技能目录**：`kebab-case`（例如 `web-quality`）
- **SKILL.md**：始终大写，始终使用这个确切的文件名
- **脚本**：`kebab-case.sh`（例如 `deploy.sh`、`fetch-logs.sh`）
- **Zip 文件**：必须与目录名完全匹配：`{skill-name}.zip`

### SKILL.md 格式

```markdown
---
name: {skill-name}
description: {一句话描述何时使用该技能。包含触发短语如"Deploy my app"、"Check logs"等。}
---

# {技能标题}

{简要描述该技能做什么。}

## How It Works

{编号列表说明技能的工作流}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - 描述（默认值为 X）

**Examples:**
{展示 2-3 个常见用法}

## Output

{展示用户将看到的示例输出}

## Present Results to User

{Claude 向用户展示结果时的格式模板}

## Troubleshooting

{常见问题和解决方案，特别是网络/权限错误}
```

### 上下文效率最佳实践

技能是按需加载的——启动时只加载技能名称和描述。完整的 `SKILL.md` 仅在智能体判断该技能相关时才加载到上下文中。为最小化上下文使用：

- **保持 SKILL.md 在 500 行以内** — 将详细的参考材料放在单独的文件中
- **编写具体的描述** — 帮助智能体准确判断何时激活该技能
- **使用渐进式展开** — 引用仅在需要时才读取的辅助文件
- **优先使用脚本而非内联代码** — 脚本执行不消耗上下文（只有输出才会）
- **文件引用仅支持一层深度** — 从 SKILL.md 直接链接到辅助文件

### 脚本要求

- 使用 `#!/bin/bash` shebang
- 使用 `set -e` 实现快速失败行为
- 将状态消息写入 stderr：`echo "Message" >&2`
- 将机器可读输出（JSON）写入 stdout
- 包含临时文件的清理 trap
- 将脚本路径引用为 `/mnt/skills/user/{skill-name}/scripts/{script}.sh`

### 创建 Zip 包

创建或更新技能后：

```bash
cd skills
zip -r {skill-name}.zip {skill-name}/
```

### 终端用户安装

为用户记录以下两种安装方式：

**Claude Code：**
```bash
cp -r skills/{skill-name} ~/.claude/skills/
```

**claude.ai：**
将技能添加到项目知识库，或将 SKILL.md 内容粘贴到对话中。

如果技能需要网络访问，请指导用户在 `claude.ai/settings/capabilities` 添加所需域名。
