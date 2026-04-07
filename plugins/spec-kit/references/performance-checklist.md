# 性能检查清单

Web 应用程序性能快速参考检查清单。配合 `performance-optimization` 技能使用。

## 目录

- [Core Web Vitals 目标](#core-web-vitals-目标)
- [前端检查清单](#前端检查清单)
- [后端检查清单](#后端检查清单)
- [测量命令](#测量命令)
- [常见反模式](#常见反模式)

## Core Web Vitals 目标

| 指标 | 良好 | 需改进 | 差 |
|------|------|--------|---|
| LCP（Largest Contentful Paint，最大内容绘制） | <= 2.5s | <= 4.0s | > 4.0s |
| INP（Interaction to Next Paint，交互到下一次绘制） | <= 200ms | <= 500ms | > 500ms |
| CLS（Cumulative Layout Shift，累积布局偏移） | <= 0.1 | <= 0.25 | > 0.25 |

## 前端检查清单

### 图片
- [ ] 图片使用现代格式（WebP、AVIF）
- [ ] 图片响应式尺寸（`srcset` 和 `sizes`）
- [ ] 图片有明确的 `width` 和 `height` 属性（防止 CLS）
- [ ] 首屏以下的图片使用 `loading="lazy"`
- [ ] 首屏/LCP 图片使用 `fetchpriority="high"` 且不延迟加载

### JavaScript
- [ ] 初始加载的包体积小于 200KB（gzip 后）
- [ ] 使用动态 `import()` 对路由和重型功能进行代码分割
- [ ] 启用 Tree Shaking（生产包中无死代码）
- [ ] `<head>` 中没有阻塞渲染的 JavaScript（使用 `defer` 或 `async`）
- [ ] 重型计算卸载到 Web Workers（如适用）
- [ ] 对使用相同 props 重复渲染的昂贵组件使用 `React.memo()`
- [ ] 仅在性能分析显示有收益时使用 `useMemo()` / `useCallback()`

### CSS
- [ ] 关键 CSS 内联或预加载
- [ ] 非关键样式无阻塞渲染的 CSS
- [ ] 生产环境中无 CSS-in-JS 运行时开销（使用提取方式）
- [ ] 设置了字体显示策略（`font-display: swap` 或 `optional`）
- [ ] 在使用自定义字体前考虑系统字体栈

### 网络
- [ ] 静态资源使用长 `max-age` + 内容哈希进行缓存
- [ ] API 响应在适当时进行缓存（`Cache-Control`）
- [ ] 启用 HTTP/2 或 HTTP/3
- [ ] 对已知来源预连接（`<link rel="preconnect">`）
- [ ] 没有不必要的重定向

### 渲染
- [ ] 没有布局抖动（强制同步布局）
- [ ] 动画使用 `transform` 和 `opacity`（GPU 加速）
- [ ] 长列表使用虚拟化（如 `react-window`）
- [ ] 没有不必要的全页重新渲染

## 后端检查清单

### 数据库
- [ ] 没有 N+1 查询模式（使用预加载 / join）
- [ ] 查询有适当的索引
- [ ] 列表接口有分页（绝不 `SELECT * FROM table`）
- [ ] 配置了连接池
- [ ] 启用了慢查询日志

### API
- [ ] 响应时间 < 200ms（p95）
- [ ] 请求处理器中没有同步的重型计算
- [ ] 使用批量操作替代单个调用的循环
- [ ] 响应压缩（gzip/brotli）
- [ ] 适当的缓存（内存、Redis、CDN）

### 基础设施
- [ ] 静态资源使用 CDN
- [ ] 服务器靠近用户（或边缘部署）
- [ ] 配置了水平扩展（如需要）
- [ ] 负载均衡器的健康检查端点

## 测量命令

```bash
# Lighthouse CLI
npx lighthouse https://localhost:3000 --output json --output-path ./report.json

# 包分析
npx webpack-bundle-analyzer stats.json
# 或者对于 Vite：
npx vite-bundle-visualizer

# 检查包大小
npx bundlesize

# 在代码中使用 Web Vitals
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

## 常见反模式

| 反模式 | 影响 | 修复方案 |
|--------|------|----------|
| N+1 查询 | 数据库负载线性增长 | 使用 join、include 或批量加载 |
| 无限制查询 | 内存耗尽、超时 | 始终分页，添加 LIMIT |
| 缺少索引 | 数据增长后读取变慢 | 为过滤/排序的列添加索引 |
| 布局抖动 | 卡顿、丢帧 | 批量读取 DOM，然后批量写入 |
| 未优化的图片 | LCP 慢、浪费带宽 | 使用 WebP、响应式尺寸、延迟加载 |
| 大型包 | 可交互时间慢 | 代码分割、Tree Shaking、审计依赖 |
| 阻塞主线程 | INP 差、UI 无响应 | 使用 Web Workers、延迟执行 |
| 内存泄漏 | 内存持续增长、最终崩溃 | 清理监听器、定时器、引用 |
