---
name: performance-optimization
description: 优化应用性能。在存在性能要求、怀疑性能回退、或 Core Web Vitals（核心网页指标）和加载时间需要改善时使用。在性能分析发现需要修复的瓶颈时使用。
---

# 性能优化

## 概述

先测量再优化。没有测量的性能工作就是猜测——而猜测会导致过早优化，增加复杂性却不改善真正重要的东西。先做性能分析，找到实际瓶颈，修复它，再次测量。只优化测量结果证明重要的部分。

## 何时使用

- 规范中存在性能要求（加载时间预算、响应时间 SLA）
- 用户或监控报告了缓慢的行为
- Core Web Vitals 分数低于阈值
- 怀疑某个变更引入了性能回退
- 构建处理大数据集或高流量的功能

**何时不使用：** 在没有问题证据之前不要优化。过早优化增加的复杂性成本比它带来的性能收益更大。

## Core Web Vitals 目标

| 指标 | 良好 | 需改进 | 差 |
|--------|------|-------------------|------|
| **LCP**（Largest Contentful Paint，最大内容绘制） | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP**（Interaction to Next Paint，交互到下一次绘制） | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS**（Cumulative Layout Shift，累积布局偏移） | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## 优化工作流

```
1. 测量    → 用真实数据建立基线
2. 定位    → 找到实际的瓶颈（而非假设的）
3. 修复    → 解决具体的瓶颈
4. 验证    → 再次测量，确认改善
5. 守护    → 添加监控或测试以防止回退
```

### 步骤 1：测量

**前端：**
```bash
# Lighthouse in Chrome DevTools (or CI)
# Chrome DevTools → Performance tab → Record
# Chrome DevTools MCP → Performance trace

# Web Vitals library in code
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

**后端：**
```bash
# Response time logging
# Application Performance Monitoring (APM)
# Database query logging with timing

# Simple timing
console.time('db-query');
const result = await db.query(...);
console.timeEnd('db-query');
```

### 从哪里开始测量

根据症状决定先测量什么：

```
什么慢了？
├── 首次页面加载
│   ├── 包体过大？ --> 测量包体大小，检查代码分割
│   ├── 服务器响应慢？ --> 测量 TTFB，检查 API/数据库
│   └── 阻塞渲染的资源？ --> 检查网络瀑布图中 CSS/JS 的阻塞情况
├── 交互感觉迟钝
│   ├── 点击时 UI 卡住？ --> 分析主线程，查找长任务 (>50ms)
│   ├── 表单输入延迟？ --> 检查重渲染、受控组件开销
│   └── 动画卡顿？ --> 检查布局抖动、强制回流
├── 导航后的页面
│   ├── 数据加载？ --> 测量 API 响应时间，检查请求瀑布
│   └── 客户端渲染？ --> 分析组件渲染时间，检查 N+1 请求
└── 后端 / API
    ├── 单个端点慢？ --> 分析数据库查询，检查索引
    ├── 所有端点都慢？ --> 检查连接池、内存、CPU
    └── 间歇性慢？ --> 检查锁竞争、GC（垃圾回收）暂停、外部依赖
```

### 步骤 2：定位瓶颈

按类别划分的常见瓶颈：

**前端：**

| 症状 | 可能原因 | 排查方式 |
|---------|-------------|---------------|
| LCP 慢 | 大图片、阻塞渲染的资源、服务器慢 | 检查网络瀑布图、图片大小 |
| CLS 高 | 没有尺寸的图片、延迟加载的内容、字体偏移 | 检查布局偏移归因 |
| INP 差 | 主线程上的重 JavaScript、大规模 DOM 更新 | 检查 Performance Trace 中的长任务 |
| 首次加载慢 | 包体过大、网络请求过多 | 检查包体大小、代码分割 |

**后端：**

| 症状 | 可能原因 | 排查方式 |
|---------|-------------|---------------|
| API 响应慢 | N+1 查询、缺失索引、未优化的查询 | 检查数据库查询日志 |
| 内存增长 | 泄漏的引用、无限增长的缓存、大负载 | 堆快照分析 |
| CPU 飙高 | 同步的重计算、正则回溯 | CPU 性能分析 |
| 高延迟 | 缺失缓存、冗余计算、网络跳转 | 追踪请求的全链路 |

### 步骤 3：修复常见反模式

#### N+1 查询（后端）

```typescript
// BAD: N+1 — one query per task for the owner
const tasks = await db.tasks.findMany();
for (const task of tasks) {
  task.owner = await db.users.findUnique({ where: { id: task.ownerId } });
}

// GOOD: Single query with join/include
const tasks = await db.tasks.findMany({
  include: { owner: true },
});
```

#### 无边界的数据获取

```typescript
// BAD: Fetching all records
const allTasks = await db.tasks.findMany();

// GOOD: Paginated with limits
const tasks = await db.tasks.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

#### 缺失图片优化（前端）

```html
<!-- BAD: No dimensions, no lazy loading, no responsive sizes -->
<img src="/hero.jpg" />

<!-- GOOD: Responsive, lazy-loaded, properly sized -->
<img
  src="/hero.jpg"
  srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="1200"
  height="600"
  loading="lazy"
  alt="Hero image description"
/>
```

#### 不必要的重渲染（React）

```tsx
// BAD: Creates new object on every render, causing children to re-render
function TaskList() {
  return <TaskFilters options={{ sortBy: 'date', order: 'desc' }} />;
}

// GOOD: Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const;
function TaskList() {
  return <TaskFilters options={DEFAULT_OPTIONS} />;
}

// Use React.memo for expensive components
const TaskItem = React.memo(function TaskItem({ task }: Props) {
  return <div>{/* expensive render */}</div>;
});

// Use useMemo for expensive computations
function TaskStats({ tasks }: Props) {
  const stats = useMemo(() => calculateStats(tasks), [tasks]);
  return <div>{stats.completed} / {stats.total}</div>;
}
```

#### 包体过大

```typescript
// BAD: Importing entire library
import { format } from 'date-fns';

// GOOD: Tree-shakable import (if the library supports it)
import { format } from 'date-fns/format';

// GOOD: Dynamic import for heavy, rarely-used features
const ChartLibrary = lazy(() => import('./ChartLibrary'));
```

#### 缺失缓存（后端）

```typescript
// Cache frequently-read, rarely-changed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cachedConfig: AppConfig | null = null;
let cacheExpiry = 0;

async function getAppConfig(): Promise<AppConfig> {
  if (cachedConfig && Date.now() < cacheExpiry) {
    return cachedConfig;
  }
  cachedConfig = await db.config.findFirst();
  cacheExpiry = Date.now() + CACHE_TTL;
  return cachedConfig;
}

// HTTP caching headers for static assets
app.use('/static', express.static('public', {
  maxAge: '1y',           // Cache for 1 year
  immutable: true,        // Never revalidate (use content hashing in filenames)
}));

// Cache-Control for API responses
res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
```

## 性能预算

设定预算并强制执行：

```
JavaScript 包体: < 200KB gzipped (首次加载)
CSS: < 50KB gzipped
图片: < 200KB 每张 (首屏)
字体: < 100KB 总计
API 响应时间: < 200ms (p95)
可交互时间 (Time to Interactive): < 3.5s (4G 网络)
Lighthouse 性能评分: ≥ 90
```

**在 CI 中强制执行：**
```bash
# Bundle size check
npx bundlesize --config bundlesize.config.json

# Lighthouse CI
npx lhci autorun
```

## 常见合理化借口

| 合理化借口 | 现实 |
|---|---|
| "之后再优化" | 性能债务会叠加。现在修复明显的反模式，推迟微优化。 |
| "在我的机器上很快" | 你的机器不是用户的。在有代表性的硬件和网络上做性能分析。 |
| "这个优化很明显" | 如果你没测量，你就不知道。先做性能分析。 |
| "用户不会注意到 100ms" | 研究表明 100ms 的延迟会影响转化率。用户比你想象的更敏感。 |
| "框架会处理性能" | 框架能预防一些问题，但无法修复 N+1 查询或过大的包体。 |

## 危险信号

- 没有性能分析数据支持的优化
- 数据获取中的 N+1 查询模式
- 没有分页的列表端点
- 没有尺寸、懒加载或响应式大小的图片
- 包体大小在无审查的情况下增长
- 生产环境没有性能监控
- 到处都是 `React.memo` 和 `useMemo`（过度使用和不使用一样糟糕）

## 验证

在任何性能相关的变更后：

- [ ] 存在前后对比的测量数据（具体数字）
- [ ] 具体的瓶颈已被定位和解决
- [ ] Core Web Vitals 在"良好"阈值内
- [ ] 包体大小没有显著增加
- [ ] 新的数据获取代码中没有 N+1 查询
- [ ] 性能预算在 CI 中通过（如已配置）
- [ ] 现有测试仍然通过（优化没有破坏行为）
