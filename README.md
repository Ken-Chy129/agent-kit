# Agent Skills

**面向 AI 编码智能体的生产级工程技能。**

技能（Skills）将资深工程师在构建软件时所运用的工作流、质量关卡和最佳实践进行了编码封装，使 AI 智能体在开发的每个阶段都能一致地遵循这些实践。

```
  定义            规划           构建           验证           评审           发布
 ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐
 │ 构思 │ ───▶ │ 需求 │ ───▶ │ 编码 │ ───▶ │ 测试 │ ───▶ │ 质量 │ ───▶ │ 上线 │
 │ 精炼 │      │ 文档 │      │ 实现 │      │ 调试 │      │ 关卡 │      │ 部署 │
 └──────┘      └──────┘      └──────┘      └──────┘      └──────┘      └──────┘
  /spec          /plan          /build        /test         /review       /ship
```

---

## 命令

7 个斜杠命令对应开发生命周期的各个阶段，每个命令会自动激活相应的技能。

| 你正在做什么 | 命令 | 核心原则 |
|-------------|------|---------|
| 明确要构建什么 | `/spec` | 先有规格，后写代码 |
| 规划如何构建 | `/plan` | 小而原子的任务 |
| 增量式构建 | `/build` | 一次一个切片 |
| 证明它能工作 | `/test` | 测试即证据 |
| 合并前评审 | `/review` | 提升代码健康度 |
| 简化代码 | `/code-simplify` | 清晰优于巧妙 |
| 发布到生产环境 | `/ship` | 越快越安全 |

技能也会根据你正在做的事情自动激活——设计 API 时触发 `api-and-interface-design`，构建 UI 时触发 `frontend-ui-engineering`，以此类推。

---

## 快速开始

<details>
<summary><b>Claude Code（推荐）</b></summary>

**应用市场安装：**

```
/plugin marketplace add Ken-Chy129/agent-kit
/plugin install agent-kit@addy-agent-skills
```

**本地 / 开发模式：**

```bash
git clone https://github.com/Ken-Chy129/agent-kit.git
claude --plugin-dir /path/to/agent-kit
```

</details>

<details>
<summary><b>Cursor</b></summary>

将任意 `SKILL.md` 复制到 `.cursor/rules/` 目录，或引用完整的 `skills/` 目录。参见 [docs/cursor-setup.md](docs/cursor-setup.md)。

</details>

<details>
<summary><b>Gemini CLI</b></summary>

作为原生技能安装以实现自动发现，或添加到 `GEMINI.md` 以获取持久化上下文。参见 [docs/gemini-cli-setup.md](docs/gemini-cli-setup.md)。

```bash
gemini skills install https://github.com/Ken-Chy129/agent-kit.git
```

</details>

<details>
<summary><b>Windsurf</b></summary>

将技能内容添加到 Windsurf 规则配置中。参见 [docs/windsurf-setup.md](docs/windsurf-setup.md)。

</details>

<details>
<summary><b>GitHub Copilot</b></summary>

使用 `agents/` 中的智能体定义作为 Copilot 角色，将技能内容放入 `.github/copilot-instructions.md`。参见 [docs/copilot-setup.md](docs/copilot-setup.md)。

</details>

<details>
<summary><b>Codex / 其他智能体</b></summary>

技能就是纯 Markdown 文件——适用于任何支持系统提示或指令文件的智能体。参见 [docs/getting-started.md](docs/getting-started.md)。

</details>

---

## 全部 19 个技能

上面的命令是入口。在底层，它们会激活这 19 个技能——每个技能都是一个结构化的工作流，包含步骤、验证关卡和反合理化表格。你也可以直接引用任意技能。

### 定义 - 明确要构建什么

| 技能 | 功能说明 | 使用时机 |
|------|---------|---------|
| [idea-refine](skills/idea-refine/SKILL.md) | 通过结构化的发散/收敛思维，将模糊的想法转化为具体的方案 | 你有一个粗略的概念需要探索时 |
| [spec-driven-development](skills/spec-driven-development/SKILL.md) | 在编写任何代码之前，撰写涵盖目标、命令、结构、代码风格、测试和边界的 PRD（产品需求文档） | 启动新项目、新功能或重大变更时 |

### 规划 - 拆解任务

| 技能 | 功能说明 | 使用时机 |
|------|---------|---------|
| [planning-and-task-breakdown](skills/planning-and-task-breakdown/SKILL.md) | 将需求分解为小的、可验证的任务，附带验收标准和依赖排序 | 你有了需求文档，需要可实施的工作单元时 |

### 构建 - 编写代码

| 技能 | 功能说明 | 使用时机 |
|------|---------|---------|
| [incremental-implementation](skills/incremental-implementation/SKILL.md) | 薄垂直切片——实现、测试、验证、提交。功能开关、安全默认值、支持回滚的变更 | 任何涉及多个文件的变更 |
| [test-driven-development](skills/test-driven-development/SKILL.md) | 红-绿-重构，测试金字塔（80/15/5），测试规模，DAMP 优于 DRY，Beyonce 规则，浏览器测试 | 实现逻辑、修复 bug 或更改行为时 |
| [context-engineering](skills/context-engineering/SKILL.md) | 在正确的时间向智能体提供正确的信息——规则文件、上下文打包、MCP（模型上下文协议）集成 | 开始新会话、切换任务或输出质量下降时 |
| [frontend-ui-engineering](skills/frontend-ui-engineering/SKILL.md) | 组件架构、设计系统、状态管理、响应式设计、WCAG 2.1 AA 无障碍访问 | 构建或修改面向用户的界面时 |
| [api-and-interface-design](skills/api-and-interface-design/SKILL.md) | 契约优先设计、Hyrum 定律、唯一版本规则、错误语义、边界验证 | 设计 API、模块边界或公共接口时 |

### 验证 - 证明它能工作

| 技能 | 功能说明 | 使用时机 |
|------|---------|---------|
| [browser-testing-with-devtools](skills/browser-testing-with-devtools/SKILL.md) | 通过 Chrome DevTools MCP 获取实时运行时数据——DOM 检查、控制台日志、网络追踪、性能分析 | 构建或调试任何在浏览器中运行的内容时 |
| [debugging-and-error-recovery](skills/debugging-and-error-recovery/SKILL.md) | 五步分诊法：复现、定位、缩小范围、修复、防护。停线规则、安全降级 | 测试失败、构建中断或行为异常时 |

### 评审 - 合并前的质量关卡

| 技能 | 功能说明 | 使用时机 |
|------|---------|---------|
| [code-review-and-quality](skills/code-review-and-quality/SKILL.md) | 五轴评审、变更规模控制（约 100 行）、严重级别标签（Nit/Optional/FYI）、评审速度规范、拆分策略 | 合并任何变更之前 |
| [code-simplification](skills/code-simplification/SKILL.md) | Chesterton 围栏原则、500 行规则，在保持行为完全一致的前提下降低复杂度 | 代码能运行但比应有的更难阅读或维护时 |
| [security-and-hardening](skills/security-and-hardening/SKILL.md) | OWASP Top 10 防护、认证模式、密钥管理、依赖审计、三层边界系统 | 处理用户输入、认证、数据存储或外部集成时 |
| [performance-optimization](skills/performance-optimization/SKILL.md) | 度量优先方法——Core Web Vitals 目标、性能分析工作流、包体积分析、反模式检测 | 存在性能要求或怀疑存在性能退化时 |

### 发布 - 自信地部署

| 技能 | 功能说明 | 使用时机 |
|------|---------|---------|
| [git-workflow-and-versioning](skills/git-workflow-and-versioning/SKILL.md) | 基于主干的开发、原子提交、变更规模控制（约 100 行）、提交即保存点模式 | 进行任何代码变更时（始终适用） |
| [ci-cd-and-automation](skills/ci-cd-and-automation/SKILL.md) | 左移原则、越快越安全、功能开关、质量关卡流水线、故障反馈循环 | 设置或修改构建和部署流水线时 |
| [deprecation-and-migration](skills/deprecation-and-migration/SKILL.md) | 代码即负债理念、强制 vs 建议式废弃、迁移模式、僵尸代码清理 | 移除旧系统、迁移用户或下线功能时 |
| [documentation-and-adrs](skills/documentation-and-adrs/SKILL.md) | 架构决策记录（ADR）、API 文档、内联文档标准——记录"为什么" | 做架构决策、变更 API 或发布功能时 |
| [shipping-and-launch](skills/shipping-and-launch/SKILL.md) | 上线前检查清单、功能开关生命周期、分阶段发布、回滚流程、监控配置 | 准备部署到生产环境时 |

---

## 智能体角色

预配置的专家角色，用于有针对性的评审：

| 智能体 | 角色 | 视角 |
|--------|------|------|
| [code-reviewer](agents/code-reviewer.md) | 高级 Staff 工程师 | 五轴代码评审，以"Staff 工程师是否会批准"为标准 |
| [test-engineer](agents/test-engineer.md) | QA 专家 | 测试策略、覆盖率分析、证明模式（Prove-It） |
| [security-auditor](agents/security-auditor.md) | 安全工程师 | 漏洞检测、威胁建模、OWASP 评估 |

---

## 参考检查清单

技能在需要时会引用的快速参考材料：

| 参考文档 | 涵盖内容 |
|---------|---------|
| [testing-patterns.md](references/testing-patterns.md) | 测试结构、命名、Mock、React/API/E2E 示例、反模式 |
| [security-checklist.md](references/security-checklist.md) | 提交前检查、认证、输入验证、请求头、CORS、OWASP Top 10 |
| [performance-checklist.md](references/performance-checklist.md) | Core Web Vitals 目标、前端/后端检查清单、度量命令 |
| [accessibility-checklist.md](references/accessibility-checklist.md) | 键盘导航、屏幕阅读器、视觉设计、ARIA、测试工具 |

---

## 技能工作原理

每个技能遵循一致的结构：

```
┌─────────────────────────────────────────────┐
│  SKILL.md                                   │
│                                             │
│  ┌─ Frontmatter ─────────────────────────┐  │
│  │ name: lowercase-hyphen-name           │  │
│  │ description: Use when [trigger]       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Overview         → 这个技能做什么          │
│  When to Use      → 触发条件               │
│  Process          → 分步工作流             │
│  Rationalizations → 借口 + 反驳            │
│  Red Flags        → 出问题的信号           │
│  Verification     → 证据要求               │
└─────────────────────────────────────────────┘
```

**关键设计选择：**

- **流程，而非散文。** 技能是智能体要遵循的工作流，而不是供阅读的参考文档。每个技能都有步骤、检查点和退出标准。
- **反合理化。** 每个技能都包含一张常见借口表格——智能体可能用来跳过步骤的借口（例如"我以后再加测试"），并附有记录在案的反驳。
- **验证不可妥协。** 每个技能都以证据要求结尾——测试通过、构建输出、运行时数据。"看起来对了"永远不够。
- **渐进式展开。** `SKILL.md` 是入口。支持性参考材料仅在需要时加载，保持 Token 消耗最小化。

---

## 项目结构

```
agent-kit/
├── skills/                            # 19 个核心技能（每个目录一个 SKILL.md）
│   ├── idea-refine/                   #   定义
│   ├── spec-driven-development/       #   定义
│   ├── planning-and-task-breakdown/   #   规划
│   ├── incremental-implementation/    #   构建
│   ├── context-engineering/           #   构建
│   ├── frontend-ui-engineering/       #   构建
│   ├── test-driven-development/       #   构建
│   ├── api-and-interface-design/      #   构建
│   ├── browser-testing-with-devtools/ #   验证
│   ├── debugging-and-error-recovery/  #   验证
│   ├── code-review-and-quality/       #   评审
│   ├── code-simplification/          #   评审
│   ├── security-and-hardening/        #   评审
│   ├── performance-optimization/      #   评审
│   ├── git-workflow-and-versioning/   #   发布
│   ├── ci-cd-and-automation/          #   发布
│   ├── deprecation-and-migration/     #   发布
│   ├── documentation-and-adrs/        #   发布
│   ├── shipping-and-launch/           #   发布
│   └── using-agent-skills/            #   元技能：如何使用本技能包
├── agents/                            # 3 个专家角色
├── references/                        # 4 个补充检查清单
├── hooks/                             # 会话生命周期钩子
├── .claude/commands/                  # 7 个斜杠命令
└── docs/                              # 各工具的配置指南
```

---

## 为什么需要 Agent Skills？

AI 编码智能体默认走最短路径——这往往意味着跳过需求文档、测试、安全评审，以及那些让软件可靠运行的实践。Agent Skills 为智能体提供结构化的工作流，强制执行资深工程师在生产代码中所坚持的同等纪律。

每个技能都编码了来之不易的工程判断力：*何时*写需求文档，*测试什么*，*如何*评审，*何时*发布。这些不是通用的提示词——而是那种将生产级质量与原型级质量区分开来的、有主见的、流程驱动的工作流。

技能融合了 Google 工程文化中的最佳实践——包括 [Software Engineering at Google](https://abseil.io/resources/swe-book) 和 Google [工程实践指南](https://google.github.io/eng-practices/)中的理念。你会在 API 设计中发现 Hyrum 定律，在测试中发现 Beyonce 规则和测试金字塔，在代码评审中发现变更规模控制和评审速度规范，在代码简化中发现 Chesterton 围栏原则，在 Git 工作流中发现基于主干的开发，在 CI/CD 中发现左移原则和功能开关，还有专门的废弃技能将代码视为负债。这些不是抽象的原则——它们被直接嵌入到智能体遵循的分步工作流中。

---

## 贡献

技能应当是**具体的**（可操作的步骤，而非模糊的建议）、**可验证的**（清晰的退出标准和证据要求）、**经过实战检验的**（基于真实工作流）、**精简的**（仅包含引导智能体所需的内容）。

参见 [docs/skill-anatomy.md](docs/skill-anatomy.md) 了解格式规范，参见 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献指南。

---

## 许可证

MIT——你可以在你的项目、团队和工具中自由使用这些技能。
