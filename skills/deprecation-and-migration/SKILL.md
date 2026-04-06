---
name: deprecation-and-migration
description: 管理废弃与迁移。适用于移除旧系统、API 或功能时使用。适用于将用户从一种实现迁移到另一种实现时使用。适用于决定是维护还是下线现有代码时使用。
---

# 废弃与迁移

## 概述

代码是负债，而不是资产。每一行代码都有持续的维护成本——需要修复 Bug、更新依赖、应用安全补丁、培训新工程师。废弃是移除不再值得维护的代码的纪律，而迁移是将用户从旧系统安全转移到新系统的过程。

大多数工程组织擅长构建东西，但很少有组织擅长移除东西。这个技能弥补了这一差距。

## 适用场景

- 用新系统、API 或库替换旧的
- 下线不再需要的功能
- 合并重复的实现
- 移除无人维护但所有人都依赖的死代码
- 规划新系统的生命周期（废弃规划在设计阶段就开始）
- 决定是维护遗留系统还是投资迁移

## 核心原则

### 代码是负债

每一行代码都有持续成本：需要测试、文档、安全补丁、依赖更新，以及对任何在附近工作的人的认知负担。代码的价值在于它提供的功能，而不是代码本身。当同样的功能可以用更少的代码、更低的复杂度或更好的抽象来提供时——旧代码就应该被移除。

### 海勒姆定律使移除变得困难

Hyrum's Law（海勒姆定律）指出：当用户足够多时，每一个可观察的行为都会被依赖——包括 Bug、时序特性和未文档化的副作用。这就是为什么废弃需要主动迁移，而不仅仅是发布公告。当用户依赖的行为在替代方案中无法复制时，他们不能"直接切换"。

### 废弃规划在设计阶段就开始

在构建新东西时，问自己："3 年后我们如何移除它？"设计时采用清晰接口、Feature Flag（功能开关）和最小暴露面的系统比到处泄露实现细节的系统更容易废弃。

## 废弃决策

在废弃任何东西之前，回答以下问题：

```
1. Does this system still provide unique value?
   → If yes, maintain it. If no, proceed.

2. How many users/consumers depend on it?
   → Quantify the migration scope.

3. Does a replacement exist?
   → If no, build the replacement first. Don't deprecate without an alternative.

4. What's the migration cost for each consumer?
   → If trivially automated, do it. If manual and high-effort, weigh against maintenance cost.

5. What's the ongoing maintenance cost of NOT deprecating?
   → Security risk, engineer time, opportunity cost of complexity.
```

## 强制废弃 vs 建议废弃

| 类型 | 适用场景 | 机制 |
|------|---------|------|
| **建议性** | 迁移是可选的，旧系统稳定 | 警告、文档、引导。用户按自己的节奏迁移。 |
| **强制性** | 旧系统有安全问题、阻碍进展，或维护成本不可持续 | 硬性截止日期。旧系统将在日期 X 被移除。提供迁移工具。 |

**默认采用建议性废弃。** 仅当维护成本或风险足以证明强制迁移的合理性时才使用强制性废弃。强制性废弃要求提供迁移工具、文档和支持——你不能只是宣布一个截止日期。

## 迁移流程

### 第一步：构建替代方案

不要在没有可用替代方案的情况下废弃。替代方案必须：

- 覆盖旧系统的所有关键用例
- 有文档和迁移指南
- 在生产环境中经过验证（而不仅仅是"理论上更好"）

### 第二步：公告与文档化

```markdown
## Deprecation Notice: OldService

**Status:** Deprecated as of 2025-03-01
**Replacement:** NewService (see migration guide below)
**Removal date:** Advisory — no hard deadline yet
**Reason:** OldService requires manual scaling and lacks observability.
            NewService handles both automatically.

### Migration Guide
1. Replace `import { client } from 'old-service'` with `import { client } from 'new-service'`
2. Update configuration (see examples below)
3. Run the migration verification script: `npx migrate-check`
```

### 第三步：增量迁移

逐个迁移消费者，而不是一次性全部迁移。对每个消费者：

```
1. Identify all touchpoints with the deprecated system
2. Update to use the replacement
3. Verify behavior matches (tests, integration checks)
4. Remove references to the old system
5. Confirm no regressions
```

**变更规则（Churn Rule）：** 如果你拥有被废弃的基础设施，你有责任帮用户迁移——或者提供无需迁移的向后兼容更新。不要宣布废弃然后让用户自己想办法。

### 第四步：移除旧系统

仅在所有消费者都已迁移之后：

```
1. Verify zero active usage (metrics, logs, dependency analysis)
2. Remove the code
3. Remove associated tests, documentation, and configuration
4. Remove the deprecation notices
5. Celebrate — removing code is an achievement
```

## 迁移模式

### 绞杀者模式（Strangler Pattern）

新旧系统并行运行。将流量从旧系统逐步切换到新系统。当旧系统处理 0% 的流量时，移除它。

```
Phase 1: New system handles 0%, old handles 100%
Phase 2: New system handles 10% (canary)
Phase 3: New system handles 50%
Phase 4: New system handles 100%, old system idle
Phase 5: Remove old system
```

### 适配器模式（Adapter Pattern）

创建一个适配器，将旧接口的调用转换为新实现。消费者继续使用旧接口，而你迁移后端。

```typescript
// Adapter: old interface, new implementation
class LegacyTaskService implements OldTaskAPI {
  constructor(private newService: NewTaskService) {}

  // Old method signature, delegates to new implementation
  getTask(id: number): OldTask {
    const task = this.newService.findById(String(id));
    return this.toOldFormat(task);
  }
}
```

### Feature Flag 迁移

使用 Feature Flag（功能开关）逐个将消费者从旧系统切换到新系统：

```typescript
function getTaskService(userId: string): TaskService {
  if (featureFlags.isEnabled('new-task-service', { userId })) {
    return new NewTaskService();
  }
  return new LegacyTaskService();
}
```

## 僵尸代码

僵尸代码是无人拥有但所有人都依赖的代码。它没有被积极维护，没有明确的负责人，并且不断积累安全漏洞和兼容性问题。特征：

- 超过 6 个月没有提交但仍有活跃的消费者
- 没有指定的维护者或团队
- 失败的测试无人修复
- 依赖中存在已知漏洞无人更新
- 文档引用了已不存在的系统

**应对方式：** 要么指定负责人并正式维护，要么制定具体的迁移计划进行废弃。僵尸代码不能继续处于模糊状态——它要么获得投入，要么被移除。

## 常见的自我合理化

| 合理化借口 | 现实 |
|---|---|
| "它还能用，为什么要移除？" | 无人维护的可用代码会积累安全债务和复杂度。维护成本在悄然增长。 |
| "以后可能会用到" | 如果以后需要，可以重建。"以防万一"而保留未使用的代码比重建成本更高。 |
| "迁移成本太高了" | 将迁移成本与未来 2-3 年的持续维护成本对比。长期来看迁移通常更划算。 |
| "等新系统完成后再废弃" | 废弃规划在设计阶段就开始。等新系统完成时，你已经有了新的优先事项。现在就规划。 |
| "用户会自己迁移的" | 不会的。提供工具、文档和激励——或者自己做迁移（变更规则）。 |
| "我们可以无限期维护两个系统" | 做同样事情的两个系统意味着双倍的维护、测试、文档和培训成本。 |

## 危险信号

- 废弃的系统没有可用的替代方案
- 废弃公告没有迁移工具或文档
- "软"废弃已经建议了好几年但没有进展
- 有活跃消费者但无人负责的僵尸代码
- 向已废弃的系统添加新功能（应该投资于替代方案）
- 废弃时没有衡量当前使用量
- 移除代码前没有验证零活跃消费者

## 验证清单

完成废弃后：

- [ ] 替代方案已在生产环境验证且覆盖所有关键用例
- [ ] 存在具体步骤和示例的迁移指南
- [ ] 所有活跃消费者已迁移（通过指标/日志验证）
- [ ] 旧代码、测试、文档和配置已完全移除
- [ ] 代码库中不再有对已废弃系统的引用
- [ ] 废弃通知已移除（它们已完成使命）
