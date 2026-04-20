# agent-kit

AI Agent 工具包——一个 Claude Code marketplace，包含多个面向 AI 编码智能体的插件。

## 项目结构

```
.claude-plugin/       → marketplace 配置
plugins/              → 各插件目录（通过 marketplace 分发）
  spec-kit/           → 工程技能包（从规格到发布的完整工作流）
    commands/         → 斜杠命令（/spec、/plan、/build、/test、/review、/code-simplify、/ship）
    skills/           → 核心技能（每个目录一个 SKILL.md）
    agents/           → 可复用的智能体角色
    references/       → 补充检查清单
    hooks/            → 会话生命周期钩子
    docs/             → 各工具的配置指南
skills/               → 独立技能目录（不走插件体系，直接维护）
  onepager/           → 文字内容转 OnePage 信息图
  copy-as-image/      → Claude 回复转精美截图并复制到剪贴板
  defuddle/           → 网页内容提取为干净 Markdown（来自 kepano/obsidian-skills，中文翻译）
  json-canvas/        → JSON Canvas 画布文件创建与编辑
  obsidian-bases/     → Obsidian Bases 数据库视图
  obsidian-cli/       → Obsidian CLI 命令行交互
  obsidian-markdown/  → Obsidian 风格 Markdown 语法
install.sh            → 技能安装脚本，将 skills/ 同步到 ~/.claude/skills/ 和 ~/.openclaw/skills/
```

## 安装技能

使用根目录的 `install.sh` 将 `skills/` 下的技能通过符号链接安装到 Claude Code 和 OpenClaw：

```bash
./install.sh                          # 安装所有技能到所有目标
./install.sh claude                   # 仅安装到 Claude Code
./install.sh openclaw                 # 仅安装到 OpenClaw
./install.sh defuddle json-canvas     # 仅安装指定技能
./install.sh --remove                 # 卸载所有技能
./install.sh --copy                   # 用复制代替符号链接
```

新增技能后需重新运行此脚本。

## 规范

- 每个插件位于 `plugins/<name>/`，必须包含 `.claude-plugin/plugin.json`
- 新插件需在 `.claude-plugin/marketplace.json` 中注册
- 技能文件位于 `skills/<name>/SKILL.md`，包含 YAML frontmatter
- 禁止添加模糊建议而非可操作流程的技能
- 禁止在技能之间重复内容——改为引用其他技能
