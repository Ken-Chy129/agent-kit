---
name: git-workflow-and-versioning
description: 规范 Git 工作流实践。在进行任何代码变更时使用。在提交、创建分支、解决冲突或需要组织多个并行工作流时使用。
---

# Git 工作流与版本管理

## 概述

Git 是你的安全网。将提交视为存档点，将分支视为沙箱，将历史记录视为文档。在 AI Agent 高速生成代码的背景下，严格的版本控制是确保变更可管理、可审查、可回滚的核心机制。

## 何时使用

始终使用。每一次代码变更都要经过 Git。

## 核心原则

### 基于主干的开发（Trunk-Based Development，推荐）

保持 `main` 分支始终可部署。在短生命周期的功能分支上工作，1-3 天内合并回主干。长期存在的开发分支是隐性成本——它们会发散、产生合并冲突、延迟集成。DORA 研究一致表明，基于主干的开发与高效能工程团队密切相关。

```
main ──●──●──●──●──●──●──●──●──●──  (始终可部署)
        ╲      ╱  ╲    ╱
         ●──●─╱    ●──╱    ← 短生命周期功能分支 (1-3 天)
```

这是推荐的默认方式。使用 gitflow 或长期分支的团队可以在各自的分支模型中应用这些原则（原子提交、小变更、描述性消息）——提交纪律比具体的分支策略更重要。

- **开发分支是成本。** 分支每多存在一天，就多积累一份合并风险。
- **发布分支是可接受的。** 当你需要在主干继续前进的同时稳定一个发布版本。
- **特性开关 > 长期分支。** 与其在分支上保留数周的未完成工作，不如用特性开关（Feature Flag）部署不完整的功能。

### 1. 尽早提交，频繁提交

每个成功的增量都应有自己的提交。不要积累大量未提交的变更。

```
工作模式:
  实现切片 → 测试 → 验证 → 提交 → 下一个切片

不要这样:
  实现所有功能 → 祈祷能跑通 → 一个巨大的提交
```

提交是存档点。如果下一个变更破坏了什么，你可以立即回滚到上一个已知正常的状态。

### 2. 原子提交

每个提交只做一件逻辑上的事情：

```
# 好：每个提交都是自包含的
git log --oneline
a1b2c3d Add task creation endpoint with validation
d4e5f6g Add task creation form component
h7i8j9k Connect form to API and add loading state
m1n2o3p Add task creation tests (unit + integration)

# 差：所有东西混在一起
git log --oneline
x1y2z3a Add task feature, fix sidebar, update deps, refactor utils
```

### 3. 描述性消息

提交消息要解释 *为什么*，而不仅仅是 *做了什么*：

```
# 好：解释意图
feat: add email validation to registration endpoint

Prevents invalid email formats from reaching the database.
Uses Zod schema validation at the route handler level,
consistent with existing validation patterns in auth.ts.

# 差：描述从 diff 中显而易见的内容
update auth.ts
```

**格式：**
```
<type>: <简短描述>

<可选正文，解释为什么而非做了什么>
```

**类型：**
- `feat` — 新功能
- `fix` — Bug 修复
- `refactor` — 既不修复 Bug 也不添加功能的代码变更
- `test` — 添加或更新测试
- `docs` — 仅文档变更
- `chore` — 工具、依赖、配置

### 4. 关注点分离

不要将格式化变更与行为变更混在一起。不要将重构与功能混在一起。每种类型的变更都应是独立的提交——理想情况下也应是独立的 PR：

```
# 好：关注点分离
git commit -m "refactor: extract validation logic to shared utility"
git commit -m "feat: add phone number validation to registration"

# 差：关注点混合
git commit -m "refactor validation and add phone number field"
```

**将重构与功能开发分开。** 重构变更和功能变更是两种不同的变更——分开提交。这让每个变更更容易审查、回滚和理解。小的清理（重命名变量）可以在审查者允许的情况下包含在功能提交中。

### 5. 控制变更规模

目标是每个提交/PR 约 100 行。超过约 1000 行的变更应该拆分。关于如何拆分大型变更，参见 `code-review-and-quality` 中的拆分策略。

```
~100 行   → 容易审查，容易回滚
~300 行   → 单个逻辑变更可接受
~1000 行  → 拆分为更小的变更
```

## 分支策略

### 功能分支

```
main (始终可部署)
  │
  ├── feature/task-creation    ← 一个功能一个分支
  ├── feature/user-settings    ← 并行工作
  └── fix/duplicate-tasks      ← Bug 修复
```

- 从 `main`（或团队的默认分支）创建分支
- 保持分支短生命周期（1-3 天内合并）——长期分支是隐性成本
- 合并后删除分支
- 对于未完成的功能，优先使用特性开关而非长期分支

### 分支命名

```
feature/<简短描述>   → feature/task-creation
fix/<简短描述>       → fix/duplicate-tasks
chore/<简短描述>     → chore/update-deps
refactor/<简短描述>  → refactor/auth-module
```

## 使用 Worktree（工作树）

对于并行的 AI Agent 工作，使用 Git Worktree 同时运行多个分支：

```bash
# Create a worktree for a feature branch
git worktree add ../project-feature-a feature/task-creation
git worktree add ../project-feature-b feature/user-settings

# Each worktree is a separate directory with its own branch
# Agents can work in parallel without interfering
ls ../
  project/              ← main branch
  project-feature-a/    ← task-creation branch
  project-feature-b/    ← user-settings branch

# When done, merge and clean up
git worktree remove ../project-feature-a
```

优势：
- 多个 Agent 可以同时在不同功能上工作
- 无需切换分支（每个目录有自己的分支）
- 如果某个实验失败，删除 Worktree 即可——不会丢失任何东西
- 变更在显式合并前保持隔离

## 存档点模式

```
Agent 开始工作
    │
    ├── 做了一个变更
    │   ├── 测试通过？ → 提交 → 继续
    │   └── 测试失败？ → 回滚到上次提交 → 排查
    │
    ├── 做了另一个变更
    │   ├── 测试通过？ → 提交 → 继续
    │   └── 测试失败？ → 回滚到上次提交 → 排查
    │
    └── 功能完成 → 所有提交形成清晰的历史记录
```

这个模式意味着你永远不会丢失超过一个增量的工作。如果 Agent 偏离了方向，`git reset --hard HEAD` 就能回到上一个成功的状态。

## 变更摘要

在任何修改后，提供结构化的摘要。这让审查更容易，记录了范围纪律，并暴露出意外的变更：

```
所做的变更:
- src/routes/tasks.ts: Added validation middleware to POST endpoint
- src/lib/validation.ts: Added TaskCreateSchema using Zod

刻意未触及的部分:
- src/routes/auth.ts: Has similar validation gap but out of scope
- src/middleware/error.ts: Error format could be improved (separate task)

潜在关注点:
- The Zod schema is strict — rejects extra fields. Confirm this is desired.
- Added zod as a dependency (72KB gzipped) — already in package.json
```

这个模式能尽早发现错误假设，并为审查者提供变更的清晰地图。"刻意未触及"部分尤其重要——它表明你遵守了范围纪律，没有进行不必要的"翻新"。

## 提交前检查

每次提交前：

```bash
# 1. Check what you're about to commit
git diff --staged

# 2. Ensure no secrets
git diff --staged | grep -i "password\|secret\|api_key\|token"

# 3. Run tests
npm test

# 4. Run linting
npm run lint

# 5. Run type checking
npx tsc --noEmit
```

使用 Git Hook 自动化：

```json
// package.json (using lint-staged + husky)
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## 处理生成的文件

- **提交生成的文件** 仅当项目需要时（如 `package-lock.json`、Prisma 迁移文件）
- **不要提交** 构建产物（`dist/`、`.next/`）、环境文件（`.env`）或 IDE 配置（`.vscode/settings.json`，除非是共享的）
- **确保有 `.gitignore`** 覆盖：`node_modules/`、`dist/`、`.env`、`.env.local`、`*.pem`

## 使用 Git 调试

```bash
# Find which commit introduced a bug
git bisect start
git bisect bad HEAD
git bisect good <known-good-commit>
# Git checkouts midpoints; run your test at each to narrow down

# View what changed recently
git log --oneline -20
git diff HEAD~5..HEAD -- src/

# Find who last changed a specific line
git blame src/services/task.ts

# Search commit messages for a keyword
git log --grep="validation" --oneline
```

## 常见合理化借口

| 合理化借口 | 现实 |
|---|---|
| "等功能做完再提交" | 一个巨大的提交无法审查、调试或回滚。每个切片都要提交。 |
| "消息不重要" | 消息就是文档。未来的你（和未来的 Agent）需要理解发生了什么变更以及为什么。 |
| "之后再全部 squash" | Squash 会破坏开发叙事。从一开始就保持干净的增量提交。 |
| "分支增加了开销" | 短生命周期分支几乎没有成本，且能防止冲突的工作碰撞。长期分支才是问题——在 1-3 天内合并。 |
| "之后再拆分这个变更" | 大型变更更难审查、部署风险更高、更难回滚。在提交前拆分，不要在提交后。 |
| "我不需要 .gitignore" | 直到包含生产密钥的 `.env` 被提交。立即设置。 |

## 危险信号

- 大量未提交的变更在积累
- 提交消息类似 "fix"、"update"、"misc"
- 格式化变更与行为变更混在一起
- 项目中没有 `.gitignore`
- 提交了 `node_modules/`、`.env` 或构建产物
- 长期分支与 main 分支严重分歧
- 对共享分支进行 Force Push

## 验证

对每个提交：

- [ ] 提交只做一件逻辑上的事情
- [ ] 消息解释了原因，遵循类型约定
- [ ] 提交前测试通过
- [ ] diff 中没有密钥
- [ ] 没有将仅格式化的变更与行为变更混合
- [ ] `.gitignore` 覆盖了标准排除项
