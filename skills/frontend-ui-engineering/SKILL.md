---
name: frontend-ui-engineering
description: 构建生产级 UI。适用于构建或修改面向用户的界面时使用。适用于创建组件、实现布局、管理状态，或当输出需要看起来和感觉上是生产级质量而非 AI 生成时使用。
---

# 前端 UI 工程

## 概述

构建可访问、高性能且视觉精致的生产级用户界面。目标是让 UI 看起来像是由一家顶级公司中具有设计意识的工程师构建的——而不是由 AI 生成的。这意味着真正遵循设计系统、正确实现无障碍访问、精心设计的交互模式，以及没有通用的"AI 审美"。

## 适用场景

- 构建新的 UI 组件或页面
- 修改现有的用户界面
- 实现响应式布局
- 添加交互性或状态管理
- 修复视觉或 UX 问题

## 组件架构

### 文件结构

将组件相关的所有文件放在一起：

```
src/components/
  TaskList/
    TaskList.tsx          # Component implementation
    TaskList.test.tsx     # Tests
    TaskList.stories.tsx  # Storybook stories (if using)
    use-task-list.ts      # Custom hook (if complex state)
    types.ts              # Component-specific types (if needed)
```

### 组件模式

**优先使用组合而非配置：**

```tsx
// Good: Composable
<Card>
  <CardHeader>
    <CardTitle>Tasks</CardTitle>
  </CardHeader>
  <CardBody>
    <TaskList tasks={tasks} />
  </CardBody>
</Card>

// Avoid: Over-configured
<Card
  title="Tasks"
  headerVariant="large"
  bodyPadding="md"
  content={<TaskList tasks={tasks} />}
/>
```

**保持组件职责单一：**

```tsx
// Good: Does one thing
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 p-3">
      <Checkbox checked={task.done} onChange={() => onToggle(task.id)} />
      <span className={task.done ? 'line-through text-muted' : ''}>{task.title}</span>
      <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
        <TrashIcon />
      </Button>
    </li>
  );
}
```

**将数据获取与展示分离：**

```tsx
// Container: handles data
export function TaskListContainer() {
  const { tasks, isLoading, error } = useTasks();

  if (isLoading) return <TaskListSkeleton />;
  if (error) return <ErrorState message="Failed to load tasks" retry={refetch} />;
  if (tasks.length === 0) return <EmptyState message="No tasks yet" />;

  return <TaskList tasks={tasks} />;
}

// Presentation: handles rendering
export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul role="list" className="divide-y">
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </ul>
  );
}
```

## 状态管理

**选择最简单的可行方案：**

```
Local state (useState)           → 组件内部的 UI 状态
Lifted state                     → 2-3 个兄弟组件之间共享
Context                          → 主题、认证、语言环境（读多写少）
URL state (searchParams)         → 过滤器、分页、可分享的 UI 状态
Server state (React Query, SWR)  → 带缓存的远程数据
Global store (Zustand, Redux)    → 全局共享的复杂客户端状态
```

**避免超过 3 层的 Props 透传（Prop Drilling）。** 如果你在通过不使用这些 props 的组件传递它们，考虑引入 Context 或重构组件树。

## 设计系统遵循

### 避免 AI 审美

AI 生成的 UI 有可辨识的模式。全部要避免：

| AI 默认行为 | 为什么有问题 | 生产级标准 |
|---|---|---|
| 到处使用紫色/靛蓝色 | 模型默认选择视觉上"安全"的配色，导致每个应用看起来都一样 | 使用项目实际的调色板 |
| 过度使用渐变 | 渐变增加视觉噪音，与大多数设计系统冲突 | 扁平化或与设计系统一致的微妙渐变 |
| 到处使用大圆角 (rounded-2xl) | 最大圆角表示"友好"但忽略了真实设计中圆角半径的层次 | 设计系统中一致的 border-radius |
| 通用的 Hero 区块 | 模板驱动的布局，与实际内容或用户需求无关 | 内容优先的布局 |
| 类似 Lorem ipsum 的文案 | 占位文本掩盖了真实内容才会暴露的布局问题（长度、换行、溢出） | 贴近真实的占位内容 |
| 到处使用大间距 | 均匀的慷慨间距会破坏视觉层次并浪费屏幕空间 | 一致的间距比例 |
| 千篇一律的卡片网格 | 统一网格是布局的捷径，忽略了信息优先级和浏览模式 | 目的驱动的布局 |
| 大量使用阴影 | 层叠的阴影增加了与内容竞争的深度，并在低端设备上拖慢渲染 | 微妙或不使用阴影，除非设计系统规定 |

### 间距和布局

使用一致的间距比例。不要自创数值：

```css
/* Use the scale: 0.25rem increments (or whatever the project uses) */
/* Good */  padding: 1rem;      /* 16px */
/* Good */  gap: 0.75rem;       /* 12px */
/* Bad */   padding: 13px;      /* Not on any scale */
/* Bad */   margin-top: 2.3rem; /* Not on any scale */
```

### 排版

遵守字体层级：

```
h1 → 页面标题（每页一个）
h2 → 章节标题
h3 → 子章节标题
body → 默认正文
small → 次要/辅助文本
```

不要跳过标题级别。不要对非标题内容使用标题样式。

### 颜色

- 使用语义化的颜色 Token：`text-primary`、`bg-surface`、`border-default`——而非原始十六进制值
- 确保足够的对比度（普通文本 4.5:1，大文本 3:1）
- 不要仅依赖颜色传达信息（同时使用图标、文字或图案）

## 无障碍访问（WCAG 2.1 AA）

每个组件都必须满足以下标准：

### 键盘导航

```tsx
// Every interactive element must be keyboard accessible
<button onClick={handleClick}>Click me</button>        // ✓ Focusable by default
<div onClick={handleClick}>Click me</div>               // ✗ Not focusable
<div role="button" tabIndex={0} onClick={handleClick}    // ✓ But prefer <button>
     onKeyDown={e => e.key === 'Enter' && handleClick()}>
  Click me
</div>
```

### ARIA 标签

```tsx
// Label interactive elements that lack visible text
<button aria-label="Close dialog"><XIcon /></button>

// Label form inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Or use aria-label when no visible label exists
<input aria-label="Search tasks" type="search" />
```

### 焦点管理

```tsx
// Move focus when content changes
function Dialog({ isOpen, onClose }: DialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  // Trap focus inside dialog when open
  return (
    <dialog open={isOpen}>
      <button ref={closeRef} onClick={onClose}>Close</button>
      {/* dialog content */}
    </dialog>
  );
}
```

### 有意义的空状态和错误状态

```tsx
// Don't show blank screens
function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div role="status" className="text-center py-12">
        <TasksEmptyIcon className="mx-auto h-12 w-12 text-muted" />
        <h3 className="mt-2 text-sm font-medium">No tasks</h3>
        <p className="mt-1 text-sm text-muted">Get started by creating a new task.</p>
        <Button className="mt-4" onClick={onCreateTask}>Create Task</Button>
      </div>
    );
  }

  return <ul role="list">...</ul>;
}
```

## 响应式设计

移动端优先设计，然后扩展：

```tsx
// Tailwind: mobile-first responsive
<div className="
  grid grid-cols-1      /* Mobile: single column */
  sm:grid-cols-2        /* Small: 2 columns */
  lg:grid-cols-3        /* Large: 3 columns */
  gap-4
">
```

在以下断点测试：320px、768px、1024px、1440px。

## 加载和过渡

```tsx
// Skeleton loading (not spinners for content)
function TaskListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted animate-pulse rounded" />
      ))}
    </div>
  );
}

// Optimistic updates for perceived speed
function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
      );

      return { previous };
    },
    onError: (_err, _taskId, context) => {
      queryClient.setQueryData(['tasks'], context?.previous);
    },
  });
}
```

## 常见的自我合理化

| 合理化借口 | 现实 |
|---|---|
| "无障碍访问是锦上添花" | 在许多司法管辖区它是法律要求，也是工程质量标准。 |
| "以后再做响应式" | 事后改造响应式设计比从一开始就构建要难 3 倍。 |
| "设计还没定稿，先不管样式" | 使用设计系统的默认值。没有样式的 UI 会给评审者留下"坏了"的第一印象。 |
| "这只是个原型" | 原型会变成生产代码。从一开始就打好基础。 |
| "AI 审美暂时够用了" | 它传递出低质量的信号。从一开始就使用项目实际的设计系统。 |

## 危险信号

- 超过 200 行的组件（拆分它们）
- 内联样式或任意像素值
- 缺少错误状态、加载状态或空状态
- 没有进行键盘导航测试
- 仅用颜色表示状态（红/绿而没有文字或图标）
- 通用的"AI 外观"（紫色渐变、超大卡片、模板化布局）

## 验证清单

UI 构建完成后：

- [ ] 组件渲染无控制台错误
- [ ] 所有交互元素支持键盘访问（Tab 遍历整个页面）
- [ ] 屏幕阅读器能传达页面的内容和结构
- [ ] 响应式：在 320px、768px、1024px、1440px 下正常工作
- [ ] 加载、错误和空状态均已处理
- [ ] 遵循项目的设计系统（间距、颜色、排版）
- [ ] 开发工具或 axe-core 中无无障碍访问警告
