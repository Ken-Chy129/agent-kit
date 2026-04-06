# agent-kit

这是 agent-kit 项目——AI Agent 工具包——技能、钩子、插件的集合。

## 项目结构

```
skills/       → 核心技能（每个目录一个 SKILL.md）
agents/       → 可复用的智能体角色（code-reviewer、test-engineer、security-auditor）
hooks/        → 会话生命周期钩子
.claude/commands/ → 斜杠命令（/spec、/plan、/build、/test、/review、/code-simplify、/ship）
references/   → 补充检查清单（测试、性能、安全、无障碍访问）
docs/         → 各工具的配置指南
```

## 按阶段分类的技能

**定义：** spec-driven-development
**规划：** planning-and-task-breakdown
**构建：** incremental-implementation、test-driven-development、context-engineering、frontend-ui-engineering、api-and-interface-design
**验证：** browser-testing-with-devtools、debugging-and-error-recovery
**评审：** code-review-and-quality、code-simplification、security-and-hardening、performance-optimization
**发布：** git-workflow-and-versioning、ci-cd-and-automation、deprecation-and-migration、documentation-and-adrs、shipping-and-launch

## 规范

- 每个技能位于 `skills/<name>/SKILL.md`
- 包含带有 `name` 和 `description` 字段的 YAML frontmatter
- 描述以技能功能开头（第三人称），后接触发条件（"Use when..."）
- 每个技能都包含：Overview、When to Use、Process、Common Rationalizations、Red Flags、Verification
- 参考材料放在 `references/` 目录，而非技能目录内
- 仅当内容超过 100 行时才创建辅助文件

## 命令

- `npm test` — 不适用（这是一个文档项目）
- 验证：检查所有 SKILL.md 文件是否具有包含 name 和 description 的有效 YAML frontmatter

## 边界

- 始终：为新技能遵循 skill-anatomy.md 格式
- 禁止：添加模糊建议而非可操作流程的技能
- 禁止：在技能之间重复内容——改为引用其他技能
