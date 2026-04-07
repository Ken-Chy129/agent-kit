---
name: code-simplification
description: 简化代码以提升清晰度。在不改变行为的前提下重构代码以提升清晰度时使用。当代码能运行但比应有的更难阅读、维护或扩展时使用。当审查积累了不必要复杂度的代码时使用。
---

# 代码简化

> 灵感来自 [Claude Code Simplifier 插件](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/code-simplifier/agents/code-simplifier.md)。在此改编为适用于任何 AI 编码 Agent 的模型无关、流程驱动的技能。

## 概述

通过降低复杂度同时保持行为完全一致来简化代码。目标不是更少的行数——而是更容易阅读、理解、修改和调试的代码。每次简化都必须通过一个简单的测试："新团队成员理解简化后的版本是否比原来更快？"

## 何时使用

- 功能已可用且测试通过，但实现感觉比必要的更重
- 代码审查中标记了可读性或复杂度问题时
- 遇到深层嵌套逻辑、长函数或不清晰的命名时
- 重构在时间压力下编写的代码时
- 整合分散在多个文件中的相关逻辑时
- 合并引入了重复或不一致的变更之后

**何时不使用：**

- 代码已经清晰可读——不要为了简化而简化
- 你还不理解代码做了什么——先理解再简化
- 代码是性能关键的，"更简单"的版本会可测量地更慢
- 你即将完全重写该模块——简化要被丢弃的代码是浪费精力

## 五项原则

### 1. 严格保持行为不变

不要改变代码做什么——只改变它如何表达。所有输入、输出、副作用、错误行为和边界情况都必须保持一致。如果你不确定某个简化是否保持了行为，就不要做。

```
每次修改前问自己：
→ 对每个输入是否产生相同的输出？
→ 是否保持相同的错误行为？
→ 是否保留相同的副作用和顺序？
→ 所有现有测试是否无需修改即可通过？
```

### 2. 遵循项目约定

简化意味着让代码更符合代码库的一致性，而非强加外部偏好。简化之前：

```
1. 阅读 CLAUDE.md / 项目约定
2. 研究相邻代码如何处理类似模式
3. 匹配项目的风格：
   - import 排序和模块系统
   - 函数声明风格
   - 命名约定
   - 错误处理模式
   - 类型注解深度
```

破坏项目一致性的简化不是简化——是白做工。

### 3. 清晰优于巧妙

当紧凑版本需要心理暂停才能解析时，显式代码优于紧凑代码。

```typescript
// 不清晰：密集的三元链
const label = isNew ? 'New' : isUpdated ? 'Updated' : isArchived ? 'Archived' : 'Active';

// 清晰：可读的映射
function getStatusLabel(item: Item): string {
  if (item.isNew) return 'New';
  if (item.isUpdated) return 'Updated';
  if (item.isArchived) return 'Archived';
  return 'Active';
}
```

```typescript
// 不清晰：链式 reduce 加内联逻辑
const result = items.reduce((acc, item) => ({
  ...acc,
  [item.id]: { ...acc[item.id], count: (acc[item.id]?.count ?? 0) + 1 }
}), {});

// 清晰：命名中间步骤
const countById = new Map<string, number>();
for (const item of items) {
  countById.set(item.id, (countById.get(item.id) ?? 0) + 1);
}
```

### 4. 保持平衡

简化有一种失败模式：过度简化。警惕以下陷阱：

- **过度内联** —— 移除一个给概念命名的辅助函数会让调用处更难读
- **合并不相关的逻辑** —— 两个简单函数合并成一个复杂函数并不更简单
- **移除"不必要"的抽象** —— 有些抽象是为了可扩展性或可测试性而存在的，而非增加复杂度
- **为行数优化** —— 更少的行数不是目标；更容易理解才是

### 5. 限定在变更范围内

默认只简化最近修改的代码。避免对不相关代码的顺手重构，除非被明确要求扩大范围。无范围限制的简化会在 diff 中产生噪音，并有在未预期的代码中引入回归的风险。

## 简化流程

### 第一步：动手前先理解（切斯特顿之篱）

在修改或移除任何东西之前，先理解它为什么存在。这就是切斯特顿之篱（Chesterton's Fence）：如果你看到一道横在路上的篱笆但不理解它为什么在那里，不要拆掉它。先理解原因，再决定原因是否仍然成立。

```
简化之前，回答以下问题：
- 这段代码的职责是什么？
- 什么调用它？它调用什么？
- 边界情况和错误路径是什么？
- 是否有定义预期行为的测试？
- 为什么可能这样写？（性能？平台限制？历史原因？）
- 检查 git blame：这段代码的原始上下文是什么？
```

如果你无法回答这些，你还没准备好简化。先阅读更多上下文。

### 第二步：识别简化机会

扫描以下模式——每一个都是具体的信号，而非模糊的代码异味：

**结构复杂度：**

| 模式 | 信号 | 简化方式 |
|------|------|----------|
| 深层嵌套（3+ 层） | 难以跟踪控制流 | 提取条件为 guard clause 或辅助函数 |
| 长函数（50+ 行） | 多重职责 | 拆分为带描述性名称的专注函数 |
| 嵌套三元运算 | 需要心理堆栈来解析 | 替换为 if/else 链、switch 或查找对象 |
| 布尔参数标志 | `doThing(true, false, true)` | 替换为选项对象或独立函数 |
| 重复条件判断 | 同一 `if` 检查出现在多处 | 提取为命名良好的谓词函数 |

**命名和可读性：**

| 模式 | 信号 | 简化方式 |
|------|------|----------|
| 泛化命名 | `data`、`result`、`temp`、`val`、`item` | 重命名以描述内容：`userProfile`、`validationErrors` |
| 缩写命名 | `usr`、`cfg`、`btn`、`evt` | 使用完整单词，除非缩写是通用的（`id`、`url`、`api`） |
| 误导性命名 | 名为 `get` 的函数实际上还在修改状态 | 重命名以反映实际行为 |
| 解释"做了什么"的注释 | `// increment counter` 在 `count++` 上方 | 删除注释——代码本身已足够清晰 |
| 解释"为什么"的注释 | `// Retry because the API is flaky under load` | 保留——它们承载了代码无法表达的意图 |

**冗余：**

| 模式 | 信号 | 简化方式 |
|------|------|----------|
| 重复逻辑 | 同样的 5+ 行出现在多处 | 提取为共享函数 |
| 死代码 | 不可达分支、未使用变量、注释掉的代码块 | 移除（确认确实是死代码后） |
| 不必要的抽象 | 不增加任何价值的包装器 | 内联包装器，直接调用底层函数 |
| 过度工程化的模式 | 工厂的工厂、只有一种策略的策略模式 | 替换为简单的直接方式 |
| 冗余类型断言 | 转换为已推断出的类型 | 移除断言 |

### 第三步：增量应用变更

一次做一个简化。每次变更后运行测试。**将重构变更与功能或 bug 修复变更分开提交。** 既重构又添加功能的 PR 是两个 PR——拆分它们。

```
对每个简化：
1. 进行修改
2. 运行测试套件
3. 测试通过 → 提交（或继续下一个简化）
4. 测试失败 → 回退并重新考虑
```

避免将多个简化批量合并为一个未经测试的变更。如果出了问题，你需要知道是哪个简化导致的。

**500 行规则：** 如果重构将涉及超过 500 行，投入自动化（codemod、sed 脚本、AST 转换）而非手动修改。这种规模的手动编辑容易出错且审查起来令人疲惫。

### 第四步：验证结果

所有简化完成后，退一步评估整体：

```
对比修改前后：
- 简化后的版本是否确实更容易理解？
- 是否引入了与代码库不一致的新模式？
- diff 是否干净且可审查？
- 队友会批准这个变更吗？
```

如果"简化后"的版本更难理解或审查，回退它。不是每次简化尝试都会成功。

## 语言特定指导

### TypeScript / JavaScript

```typescript
// 简化：不必要的 async 包装
// 修改前
async function getUser(id: string): Promise<User> {
  return await userService.findById(id);
}
// 修改后
function getUser(id: string): Promise<User> {
  return userService.findById(id);
}

// 简化：冗长的条件赋值
// 修改前
let displayName: string;
if (user.nickname) {
  displayName = user.nickname;
} else {
  displayName = user.fullName;
}
// 修改后
const displayName = user.nickname || user.fullName;

// 简化：手动构建数组
// 修改前
const activeUsers: User[] = [];
for (const user of users) {
  if (user.isActive) {
    activeUsers.push(user);
  }
}
// 修改后
const activeUsers = users.filter((user) => user.isActive);

// 简化：冗余的布尔返回
// 修改前
function isValid(input: string): boolean {
  if (input.length > 0 && input.length < 100) {
    return true;
  }
  return false;
}
// 修改后
function isValid(input: string): boolean {
  return input.length > 0 && input.length < 100;
}
```

### Python

```python
# 简化：冗长的字典构建
# 修改前
result = {}
for item in items:
    result[item.id] = item.name
# 修改后
result = {item.id: item.name for item in items}

# 简化：嵌套条件改为 early return
# 修改前
def process(data):
    if data is not None:
        if data.is_valid():
            if data.has_permission():
                return do_work(data)
            else:
                raise PermissionError("No permission")
        else:
            raise ValueError("Invalid data")
    else:
        raise TypeError("Data is None")
# 修改后
def process(data):
    if data is None:
        raise TypeError("Data is None")
    if not data.is_valid():
        raise ValueError("Invalid data")
    if not data.has_permission():
        raise PermissionError("No permission")
    return do_work(data)
```

### React / JSX

```tsx
// 简化：冗长的条件渲染
// 修改前
function UserBadge({ user }: Props) {
  if (user.isAdmin) {
    return <Badge variant="admin">Admin</Badge>;
  } else {
    return <Badge variant="default">User</Badge>;
  }
}
// 修改后
function UserBadge({ user }: Props) {
  const variant = user.isAdmin ? 'admin' : 'default';
  const label = user.isAdmin ? 'Admin' : 'User';
  return <Badge variant={variant}>{label}</Badge>;
}

// 简化：通过中间组件的 prop 透传
// 修改前 — 考虑 context 或组合是否能更好地解决。
// 这需要判断 — 标记它，不要自动重构。
```

## 常见的自我合理化

| 合理化借口 | 现实 |
|---|---|
| "能用就行，没必要动它" | 难读的可用代码在出 bug 时也会难以修复。现在简化能为每次未来的修改节省时间。 |
| "更少的行数总是更简单" | 一行嵌套的三元运算并不比五行的 if/else 更简单。简单是关于理解速度，不是行数。 |
| "顺便简化一下这段不相关的代码" | 无范围限制的简化产生嘈杂的 diff，并有在未预期修改的代码中引入回归的风险。保持专注。 |
| "类型让它自文档化了" | 类型记录结构，而非意图。命名良好的函数比类型签名更能解释"为什么"。 |
| "这个抽象以后可能有用" | 不要保留推测性的抽象。如果现在没用，它就是没有价值的复杂度。移除它，需要时再加回来。 |
| "原作者肯定有他的理由" | 也许。检查 git blame——应用切斯特顿之篱。但积累的复杂度通常没有理由；它只是在压力下迭代的残留物。 |
| "我在加功能的同时顺便重构" | 将重构与功能开发分开。混合的变更更难审查、回退和在历史中理解。 |

## 危险信号

- 简化需要修改测试才能通过（你可能改变了行为）
- "简化后"的代码比原来更长且更难理解
- 按你的偏好而非项目约定重命名
- 因为"让代码更干净"而移除错误处理
- 简化你不完全理解的代码
- 将多个简化批量合并为一个大的、难以审查的提交
- 在未被要求的情况下重构当前任务范围之外的代码

## 验证清单

完成一轮简化后：

- [ ] 所有现有测试无需修改即可通过
- [ ] 构建成功且无新警告
- [ ] Linter/格式化工具通过（无风格回归）
- [ ] 每个简化都是可审查的、增量的变更
- [ ] diff 干净——没有混入不相关的变更
- [ ] 简化后的代码遵循项目约定（已对照 CLAUDE.md 或等效文件检查）
- [ ] 没有错误处理被移除或削弱
- [ ] 没有留下死代码（未使用的 import、不可达的分支）
- [ ] 队友或审查 Agent 会批准该变更为净改进
