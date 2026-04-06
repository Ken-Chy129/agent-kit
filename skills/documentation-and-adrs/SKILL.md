---
name: documentation-and-adrs
description: 记录决策和文档。适用于做架构决策、变更公共 API、交付功能，或需要记录未来工程师和 Agent 理解代码库所需的上下文时使用。
---

# 文档与 ADR

## 概述

记录决策，而不仅仅是代码。最有价值的文档记录的是*为什么*——导致某个决策的上下文、约束和权衡。代码展示了*构建了什么*；文档解释了*为什么这样构建*以及*考虑了哪些替代方案*。这些上下文对于未来在代码库中工作的人类和 Agent 至关重要。

## 适用场景

- 做出重要的架构决策
- 在竞争方案之间做选择
- 添加或变更公共 API
- 交付改变用户行为的功能
- 让新团队成员（或 Agent）熟悉项目
- 发现自己在重复解释同样的事情

**不适用场景：** 不要为显而易见的代码写文档。不要添加重复代码含义的注释。不要为一次性原型写文档。

## 架构决策记录（ADR）

ADR（Architecture Decision Record）记录重要技术决策背后的推理。它们是你能写的最高价值文档。

### 何时编写 ADR

- 选择框架、库或重要依赖
- 设计数据模型或数据库 Schema
- 选择认证策略
- 决定 API 架构（REST vs. GraphQL vs. tRPC）
- 选择构建工具、托管平台或基础设施
- 任何逆转成本高昂的决策

### ADR 模板

将 ADR 存储在 `docs/decisions/` 目录下，按顺序编号：

```markdown
# ADR-001: Use PostgreSQL for primary database

## Status
Accepted | Superseded by ADR-XXX | Deprecated

## Date
2025-01-15

## Context
We need a primary database for the task management application. Key requirements:
- Relational data model (users, tasks, teams with relationships)
- ACID transactions for task state changes
- Support for full-text search on task content
- Managed hosting available (for small team, limited ops capacity)

## Decision
Use PostgreSQL with Prisma ORM.

## Alternatives Considered

### MongoDB
- Pros: Flexible schema, easy to start with
- Cons: Our data is inherently relational; would need to manage relationships manually
- Rejected: Relational data in a document store leads to complex joins or data duplication

### SQLite
- Pros: Zero configuration, embedded, fast for reads
- Cons: Limited concurrent write support, no managed hosting for production
- Rejected: Not suitable for multi-user web application in production

### MySQL
- Pros: Mature, widely supported
- Cons: PostgreSQL has better JSON support, full-text search, and ecosystem tooling
- Rejected: PostgreSQL is the better fit for our feature requirements

## Consequences
- Prisma provides type-safe database access and migration management
- We can use PostgreSQL's full-text search instead of adding Elasticsearch
- Team needs PostgreSQL knowledge (standard skill, low risk)
- Hosting on managed service (Supabase, Neon, or RDS)
```

### ADR 生命周期

```
PROPOSED → ACCEPTED → (SUPERSEDED or DEPRECATED)
```

- **不要删除旧的 ADR。** 它们记录了历史上下文。
- 当决策发生变化时，编写一个新的 ADR 来引用并取代旧的。

## 行内文档

### 何时添加注释

注释*为什么*，而不是*是什么*：

```typescript
// BAD: Restates the code
// Increment counter by 1
counter += 1;

// GOOD: Explains non-obvious intent
// Rate limit uses a sliding window — reset counter at window boundary,
// not on a fixed schedule, to prevent burst attacks at window edges
if (now - windowStart > WINDOW_SIZE_MS) {
  counter = 0;
  windowStart = now;
}
```

### 何时不添加注释

```typescript
// Don't comment self-explanatory code
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Don't leave TODO comments for things you should just do now
// TODO: add error handling  ← Just add it

// Don't leave commented-out code
// const oldImplementation = () => { ... }  ← Delete it, git has history
```

### 记录已知陷阱

```typescript
/**
 * IMPORTANT: This function must be called before the first render.
 * If called after hydration, it causes a flash of unstyled content
 * because the theme context isn't available during SSR.
 *
 * See ADR-003 for the full design rationale.
 */
export function initializeTheme(theme: Theme): void {
  // ...
}
```

## API 文档

对于公共 API（REST、GraphQL、库接口）：

### 基于类型的行内文档（TypeScript 首选方式）

```typescript
/**
 * Creates a new task.
 *
 * @param input - Task creation data (title required, description optional)
 * @returns The created task with server-generated ID and timestamps
 * @throws {ValidationError} If title is empty or exceeds 200 characters
 * @throws {AuthenticationError} If the user is not authenticated
 *
 * @example
 * const task = await createTask({ title: 'Buy groceries' });
 * console.log(task.id); // "task_abc123"
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  // ...
}
```

### REST API 的 OpenAPI / Swagger

```yaml
paths:
  /api/tasks:
    post:
      summary: Create a task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskInput'
      responses:
        '201':
          description: Task created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '422':
          description: Validation error
```

## README 结构

每个项目都应该有一个涵盖以下内容的 README：

```markdown
# Project Name

One-paragraph description of what this project does.

## Quick Start
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env`
4. Run the dev server: `npm run dev`

## Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Production build |
| `npm run lint` | Run linter |

## Architecture
Brief overview of the project structure and key design decisions.
Link to ADRs for details.

## Contributing
How to contribute, coding standards, PR process.
```

## 变更日志维护

对于已交付的功能：

```markdown
# Changelog

## [1.2.0] - 2025-01-20
### Added
- Task sharing: users can share tasks with team members (#123)
- Email notifications for task assignments (#124)

### Fixed
- Duplicate tasks appearing when rapidly clicking create button (#125)

### Changed
- Task list now loads 50 items per page (was 20) for better UX (#126)
```

## 面向 Agent 的文档

AI Agent 上下文的特殊考量：

- **CLAUDE.md / 规则文件** — 记录项目规范以便 Agent 遵循
- **规格说明文件** — 保持规格说明更新以便 Agent 构建正确的东西
- **ADR** — 帮助 Agent 理解过去为什么做了那些决策（防止重复决策）
- **行内陷阱注释** — 防止 Agent 掉入已知的坑

## 常见的自我合理化

| 合理化借口 | 现实 |
|---|---|
| "代码本身就是文档" | 代码展示了是什么。它不展示为什么、哪些替代方案被否决了，或者有哪些约束条件。 |
| "等 API 稳定后再写文档" | 先写文档反而能让 API 更快稳定。文档是设计的第一次测试。 |
| "没人看文档" | Agent 会看。未来的工程师会看。3 个月后的你自己也会看。 |
| "ADR 是额外负担" | 10 分钟的 ADR 可以避免 6 个月后关于同一决策的 2 小时争论。 |
| "注释会过时" | 关于*为什么*的注释是稳定的。关于*是什么*的注释才会过时——所以你只写前者。 |

## 危险信号

- 架构决策没有书面理由
- 公共 API 没有文档或类型定义
- README 没有解释如何运行项目
- 注释掉的代码而不是删除
- 存在了几周的 TODO 注释
- 有重大架构选择的项目中没有 ADR
- 文档重述代码而不是解释意图

## 验证清单

完成文档编写后：

- [ ] 所有重要架构决策都有对应的 ADR
- [ ] README 涵盖快速开始、命令和架构概述
- [ ] API 函数有参数和返回类型的文档
- [ ] 已知陷阱在相关位置有行内文档
- [ ] 没有残留注释掉的代码
- [ ] 规则文件（CLAUDE.md 等）是最新且准确的
