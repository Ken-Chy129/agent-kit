# agent-skills 入门指南

agent-skills 适用于任何接受 Markdown 指令的 AI 编码代理。本指南介绍通用方法。关于特定工具的设置，请参阅专用指南。

## 技能的工作原理

每个技能是一个 Markdown 文件（`SKILL.md`），描述了一个特定的工程工作流。当加载到代理的上下文中时，代理会遵循该工作流 -- 包括验证步骤、需要避免的反模式和退出标准。

**技能不是参考文档。** 它们是代理遵循的分步流程。

## 快速开始（任何代理）

### 1. 克隆仓库

```bash
git clone https://github.com/addyosmani/agent-skills.git
```

### 2. 选择技能

浏览 `skills/` 目录。每个子目录包含一个 `SKILL.md`，内容包括：
- **何时使用** -- 表明该技能适用的触发条件
- **流程** -- 分步工作流
- **验证** -- 如何确认工作已完成
- **常见借口** -- 代理可能用来跳过步骤的借口
- **红色警告** -- 技能被违反的迹象

### 3. 将技能加载到你的代理中

将相关 `SKILL.md` 内容复制到代理的系统提示词、规则文件或对话中。最常见的方式：

**系统提示词：** 在会话开始时粘贴技能内容。

**规则文件：** 将技能内容添加到项目的规则文件中（CLAUDE.md、.cursorrules 等）。

**对话：** 在给出指令时引用技能："按照 test-driven-development 流程处理这个变更。"

### 4. 使用元技能进行发现

先加载 `using-agent-skills` 技能。它包含一个流程图，将任务类型映射到适当的技能。

## 推荐设置

### 最小配置（从这里开始）

在规则文件中加载三个核心技能：

1. **spec-driven-development** -- 用于定义要构建什么
2. **test-driven-development** -- 用于证明它能工作
3. **code-review-and-quality** -- 用于合并前验证质量

这三个技能覆盖了 AI 辅助开发中最关键的质量缺口。

### 全生命周期

要实现全面覆盖，按阶段加载技能：

```
启动项目：      spec-driven-development -> planning-and-task-breakdown
开发过程中：    incremental-implementation + test-driven-development
合并前：        code-review-and-quality + security-and-hardening
部署前：        shipping-and-launch
```

### 上下文感知加载

不要一次加载所有技能 -- 这浪费上下文。加载与当前任务相关的技能：

- 处理 UI？加载 `frontend-ui-engineering`
- 调试？加载 `debugging-and-error-recovery`
- 设置 CI？加载 `ci-cd-and-automation`

## 技能结构

每个技能遵循相同的结构：

```
YAML frontmatter（名称、描述）
├── 概述 -- 该技能做什么
├── 何时使用 -- 触发条件
├── 核心流程 -- 分步工作流
├── 示例 -- 代码示例和模式
├── 常见借口 -- 借口和反驳
├── 红色警告 -- 技能被违反的迹象
└── 验证 -- 退出标准检查清单
```

详见 [skill-anatomy.md](skill-anatomy.md) 的完整规范。

## 使用 Agent

`agents/` 目录包含预配置的 Agent 人设：

| Agent | 用途 |
|-------|------|
| `code-reviewer.md` | 五维代码审查 |
| `test-engineer.md` | 测试策略和编写 |
| `security-auditor.md` | 漏洞检测 |

在需要专业审查时加载 Agent 定义。例如，要求你的编码代理"使用 code-reviewer Agent 人设审查这个变更"并提供 Agent 定义。

## 使用命令

`.claude/commands/` 目录包含 Claude Code 的斜杠命令：

| 命令 | 调用的技能 |
|------|-----------|
| `/spec` | spec-driven-development |
| `/plan` | planning-and-task-breakdown |
| `/build` | incremental-implementation + test-driven-development |
| `/test` | test-driven-development |
| `/review` | code-review-and-quality |
| `/ship` | shipping-and-launch |

## 使用参考资料

`references/` 目录包含补充检查清单：

| 参考资料 | 配合使用 |
|----------|---------|
| `testing-patterns.md` | test-driven-development |
| `performance-checklist.md` | performance-optimization |
| `security-checklist.md` | security-and-hardening |
| `accessibility-checklist.md` | frontend-ui-engineering |

当需要超出技能本身覆盖范围的详细模式时，加载参考资料。

## 技巧

1. **非简单工作都从 spec-driven-development 开始**
2. **编写代码时始终加载 test-driven-development**
3. **不要跳过验证步骤** -- 这才是核心价值
4. **选择性加载技能** -- 更多上下文并不总是更好
5. **使用 Agent 进行审查** -- 不同视角能发现不同问题
