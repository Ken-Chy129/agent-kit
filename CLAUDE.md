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
```

## 规范

- 每个插件位于 `plugins/<name>/`，必须包含 `.claude-plugin/plugin.json`
- 新插件需在 `.claude-plugin/marketplace.json` 中注册
- 技能文件位于 `skills/<name>/SKILL.md`，包含 YAML frontmatter
- 禁止添加模糊建议而非可操作流程的技能
- 禁止在技能之间重复内容——改为引用其他技能
