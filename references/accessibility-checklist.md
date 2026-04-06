# 无障碍检查清单

WCAG 2.1 AA 合规性快速参考。配合 `frontend-ui-engineering` 技能使用。

## 目录

- [基本检查](#基本检查)
- [常见 HTML 模式](#常见-html-模式)
- [测试工具](#测试工具)
- [快速参考：ARIA 实时区域](#快速参考aria-实时区域)
- [常见反模式](#常见反模式)

## 基本检查

### 键盘导航
- [ ] 所有交互元素可通过 Tab 键获得焦点
- [ ] 焦点顺序遵循视觉/逻辑顺序
- [ ] 焦点可见（获得焦点的元素有轮廓线/边框）
- [ ] 自定义组件支持键盘操作（Enter 激活，Escape 关闭）
- [ ] 没有键盘陷阱（用户始终可以通过 Tab 离开组件）
- [ ] 页面顶部有"跳转到内容"链接
- [ ] 模态框打开时捕获焦点，关闭时恢复焦点

### 屏幕阅读器
- [ ] 所有图片都有 `alt` 文本（装饰性图片使用 `alt=""`）
- [ ] 所有表单输入都有关联的标签（`<label>` 或 `aria-label`）
- [ ] 按钮和链接有描述性文本（不是"点击这里"）
- [ ] 纯图标按钮有 `aria-label`
- [ ] 页面有一个 `<h1>`，标题层级不跳级
- [ ] 动态内容变更会被播报（`aria-live` 区域）
- [ ] 表格有带 scope 的 `<th>` 表头

### 视觉
- [ ] 文本对比度 >= 4.5:1（普通文本）或 >= 3:1（大文本，18px+）
- [ ] UI 组件与背景的对比度 >= 3:1
- [ ] 颜色不是传达信息的唯一方式
- [ ] 文本可放大至 200% 而不破坏布局
- [ ] 没有每秒闪烁超过 3 次的内容

### 表单
- [ ] 每个输入都有可见的标签
- [ ] 必填字段有标识（不仅仅通过颜色）
- [ ] 错误信息具体且与对应字段关联
- [ ] 错误状态不仅通过颜色可见（有图标、文本、边框）
- [ ] 表单提交错误有汇总且可获得焦点

### 内容
- [ ] 声明了语言（`<html lang="en">`）
- [ ] 页面有描述性的 `<title>`
- [ ] 链接与周围文本有区分（不仅通过颜色）
- [ ] 移动端触摸目标 >= 44x44px
- [ ] 有意义的空状态（不是空白屏幕）

## 常见 HTML 模式

### 按钮 vs. 链接

```html
<!-- 用 <button> 表示操作 -->
<button onClick={handleDelete}>Delete Task</button>

<!-- 用 <a> 表示导航 -->
<a href="/tasks/123">View Task</a>

<!-- 永远不要用 div/span 作为按钮 -->
<div onClick={handleDelete}>Delete</div>  <!-- 错误 -->
```

### 表单标签

```html
<!-- 显式标签关联 -->
<label htmlFor="email">Email address</label>
<input id="email" type="email" required />

<!-- 隐式包裹 -->
<label>
  Email address
  <input type="email" required />
</label>

<!-- 隐藏标签（首选可见标签） -->
<input type="search" aria-label="Search tasks" />
```

### ARIA 角色

```html
<!-- 导航 -->
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer links">...</nav>

<!-- 状态消息 -->
<div role="status" aria-live="polite">Task saved</div>

<!-- 警告消息 -->
<div role="alert">Error: Title is required</div>

<!-- 模态对话框 -->
<dialog aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
  ...
</dialog>

<!-- 加载状态 -->
<div aria-busy="true" aria-label="Loading tasks">
  <Spinner />
</div>
```

### 无障碍列表

```html
<ul role="list" aria-label="Tasks">
  <li>
    <input type="checkbox" id="task-1" aria-label="Complete: Buy groceries" />
    <label htmlFor="task-1">Buy groceries</label>
  </li>
</ul>
```

## 测试工具

```bash
# 自动化审计
npx axe-core          # 程序化无障碍测试
npx pa11y             # CLI 无障碍检查工具

# 在浏览器中
# Chrome DevTools → Lighthouse → Accessibility
# Chrome DevTools → Elements → Accessibility tree

# 屏幕阅读器测试
# macOS: VoiceOver (Cmd + F5)
# Windows: NVDA (免费) 或 JAWS
# Linux: Orca
```

## 快速参考：ARIA 实时区域

| 值 | 行为 | 适用场景 |
|---|------|----------|
| `aria-live="polite"` | 在下一次停顿时播报 | 状态更新、保存确认 |
| `aria-live="assertive"` | 立即播报 | 错误、时间敏感的警告 |
| `role="status"` | 等同于 `polite` | 状态消息 |
| `role="alert"` | 等同于 `assertive` | 错误消息 |

## 常见反模式

| 反模式 | 问题 | 修复方案 |
|--------|------|----------|
| `div` 作为按钮 | 不可获焦，不支持键盘 | 使用 `<button>` |
| 缺少 `alt` 文本 | 图片对屏幕阅读器不可见 | 添加描述性 `alt` |
| 仅用颜色表示状态 | 色盲用户不可见 | 添加图标、文本或图案 |
| 自动播放媒体 | 令人困惑，无法停止 | 添加控件，不自动播放 |
| 无 ARIA 的自定义下拉框 | 键盘/屏幕阅读器无法使用 | 使用原生 `<select>` 或正确的 ARIA listbox |
| 移除焦点轮廓线 | 用户无法看到当前位置 | 美化轮廓线样式，不要移除 |
| 空链接/按钮 | 播报"链接"但没有描述 | 添加文本或 `aria-label` |
| `tabindex > 0` | 破坏自然的 Tab 顺序 | 仅使用 `tabindex="0"` 或 `-1` |
