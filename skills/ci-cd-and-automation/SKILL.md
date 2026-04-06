---
name: ci-cd-and-automation
description: 自动化 CI/CD 流水线设置。在设置或修改构建和部署流水线时使用。当需要自动化质量门禁、在 CI 中配置测试运行器或建立部署策略时使用。
---

# CI/CD 与自动化

## 概述

自动化质量门禁，确保没有任何变更在未通过测试、lint、类型检查和构建的情况下进入生产环境。CI/CD 是所有其他技能的执行机制——它能一致地在每一次变更中捕获人类和 Agent 遗漏的问题。

**左移（Shift Left）：** 尽可能在流水线的早期发现问题。在 lint 阶段发现的 bug 花费几分钟；同样的 bug 在生产环境发现要花费数小时。将检查上移——静态分析在测试之前，测试在预发布之前，预发布在生产之前。

**更快即更安全：** 更小的批次和更频繁的发布会降低风险，而非增加风险。包含 3 个变更的部署比包含 30 个变更的更容易调试。频繁发布能增强对发布流程本身的信心。

## 何时使用

- 为新项目设置 CI 流水线
- 添加或修改自动化检查
- 配置部署流水线
- 当变更需要触发自动化验证时
- 调试 CI 失败

## 质量门禁流水线

每个变更在合并之前都要通过这些门禁：

```
Pull Request 打开
    │
    ▼
┌─────────────────┐
│   LINT 检查      │  eslint, prettier
│   ↓ 通过         │
│   类型检查        │  tsc --noEmit
│   ↓ 通过         │
│   单元测试        │  jest/vitest
│   ↓ 通过         │
│   构建           │  npm run build
│   ↓ 通过         │
│   集成测试        │  API/数据库测试
│   ↓ 通过         │
│   E2E（可选）     │  Playwright/Cypress
│   ↓ 通过         │
│   安全审计        │  npm audit
│   ↓ 通过         │
│   包体积检查      │  bundlesize check
└─────────────────┘
    │
    ▼
  准备好接受审查
```

**任何门禁都不能跳过。** 如果 lint 失败，修复 lint——不要禁用规则。如果测试失败，修复代码——不要跳过测试。

## GitHub Actions 配置

### 基本 CI 流水线

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build

      - name: Security audit
        run: npm audit --audit-level=high
```

### 包含数据库集成测试

```yaml
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: ci_user
          POSTGRES_PASSWORD: ${{ secrets.CI_DB_PASSWORD }}
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
```

> **注意：** 即使是仅用于 CI 的测试数据库，也应使用 GitHub Secrets 管理凭据而非硬编码。这能养成良好习惯并防止测试凭据在其他场景中被意外复用。

### E2E 测试

```yaml
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Build
        run: npm run build
      - name: Run E2E tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 将 CI 失败反馈给 Agent

CI 与 AI Agent 结合的强大之处在于反馈循环。当 CI 失败时：

```
CI 失败
    │
    ▼
复制失败输出
    │
    ▼
反馈给 Agent：
"CI 流水线因以下错误而失败：
[粘贴具体错误]
修复问题并在再次推送之前进行本地验证。"
    │
    ▼
Agent 修复 → 推送 → CI 再次运行
```

**关键模式：**

```
Lint 失败 → Agent 运行 `npm run lint --fix` 并提交
类型错误  → Agent 读取错误位置并修复类型
测试失败  → Agent 遵循 debugging-and-error-recovery 技能
构建错误  → Agent 检查配置和依赖
```

## 部署策略

### 预览部署

每个 PR 都获得一个预览部署用于手动测试：

```yaml
# 在 PR 上部署预览（Vercel/Netlify 等）
deploy-preview:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  steps:
    - uses: actions/checkout@v4
    - name: Deploy preview
      run: npx vercel --token=${{ secrets.VERCEL_TOKEN }}
```

### 功能开关（Feature Flags）

功能开关将部署与发布解耦。将未完成或有风险的功能放在开关后面部署，这样你可以：

- **部署代码而不启用它。** 尽早合并到 main，准备好时再启用。
- **无需重新部署即可回滚。** 禁用开关而非回退代码。
- **灰度发布新功能。** 先给 1% 的用户启用，然后 10%，最后 100%。
- **进行 A/B 测试。** 比较启用和未启用功能时的行为。

```typescript
// 简单的功能开关模式
if (featureFlags.isEnabled('new-checkout-flow', { userId })) {
  return renderNewCheckout();
}
return renderLegacyCheckout();
```

**开关生命周期：** 创建 → 启用测试 → 灰度发布 → 全量发布 → 移除开关和死代码。永远存在的开关会成为技术债务——创建时就设定清理日期。

### 分阶段发布

```
PR 合并到 main
    │
    ▼
  预发布环境部署（自动）
    │ 人工验证
    ▼
  生产环境部署（手动触发或预发布通过后自动）
    │
    ▼
  监控错误（15 分钟窗口）
    │
    ├── 检测到错误 → 回滚
    └── 正常 → 完成
```

### 回滚计划

每次部署都应该是可逆的：

```yaml
# 手动回滚工作流
name: Rollback
on:
  workflow_dispatch:
    inputs:
      version:
        description: '要回滚到的版本'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback deployment
        run: |
          # 部署指定的之前版本
          npx vercel rollback ${{ inputs.version }}
```

## 环境管理

```
.env.example       → 已提交（开发者模板）
.env                → 未提交（本地开发）
.env.test           → 已提交（测试环境，无真实密钥）
CI secrets          → 存储在 GitHub Secrets / 密钥管理服务中
Production secrets  → 存储在部署平台 / 密钥管理服务中
```

CI 永远不应持有生产环境密钥。使用独立的密钥进行 CI 测试。

## CI 之外的自动化

### Dependabot / Renovate

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
```

### 构建值班（Build Cop）角色

指定专人负责保持 CI 绿色。当构建中断时，构建值班的职责是修复或回退——而不是由导致中断的人来做。这防止了在每个人都以为其他人会修复的情况下，构建中断持续累积。

### PR 检查

- **必需审查：** 合并前至少 1 个批准
- **必需状态检查：** 合并前 CI 必须通过
- **分支保护：** 禁止对 main 强制推送
- **自动合并：** 如果所有检查通过且已批准，自动合并

## CI 优化

当流水线超过 10 分钟时，按影响程度依次应用这些策略：

```
CI 流水线太慢？
├── 缓存依赖
│   └── 使用 actions/cache 或 setup-node 的缓存选项缓存 node_modules
├── 并行运行任务
│   └── 将 lint、类型检查、测试、构建拆分为独立的并行任务
├── 仅运行有变更的部分
│   └── 使用路径过滤器跳过不相关的任务（如仅文档变更时跳过 e2e）
├── 使用矩阵构建
│   └── 将测试套件分片到多个运行器
├── 优化测试套件
│   └── 将慢速测试从关键路径中移除，改为定时运行
└── 使用更大的运行器
    └── GitHub 托管的更大运行器或自托管运行器用于 CPU 密集型构建
```

**示例：缓存和并行**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --coverage
```

## 常见的自我合理化

| 合理化借口 | 现实 |
|---|---|
| "CI 太慢了" | 优化流水线（见上方 CI 优化），不要跳过它。5 分钟的流水线能防止数小时的调试。 |
| "这个变更很小，跳过 CI" | 小变更也会破坏构建。CI 对小变更本来就很快。 |
| "测试不稳定，重新跑一下就好" | 不稳定的测试掩盖真实 bug 并浪费所有人的时间。修复不稳定性。 |
| "以后再加 CI" | 没有 CI 的项目会累积破损状态。第一天就设置它。 |
| "手动测试就够了" | 手动测试无法扩展且不可重复。尽可能自动化。 |

## 危险信号

- 项目中没有 CI 流水线
- CI 失败被忽略或静默
- 为了让流水线通过而在 CI 中禁用测试
- 未经预发布验证就部署到生产环境
- 没有回滚机制
- 密钥存储在代码或 CI 配置文件中（而非密钥管理器）
- CI 运行时间长且未进行优化

## 验证清单

设置或修改 CI 之后：

- [ ] 所有质量门禁就位（lint、类型检查、测试、构建、审计）
- [ ] 流水线在每个 PR 和推送到 main 时运行
- [ ] 失败阻止合并（已配置分支保护）
- [ ] CI 结果反馈到开发循环中
- [ ] 密钥存储在密钥管理器中，而非代码中
- [ ] 部署有回滚机制
- [ ] 测试套件的流水线在 10 分钟内完成
