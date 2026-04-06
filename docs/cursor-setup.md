# 在 Cursor 中使用 agent-skills

## 设置

### 方案 1：Rules 目录（推荐）

Cursor 支持使用 `.cursor/rules/` 目录来存放项目级规则：

```bash
# 创建 rules 目录
mkdir -p .cursor/rules

# 将需要的技能复制为规则
cp /path/to/agent-skills/skills/test-driven-development/SKILL.md .cursor/rules/test-driven-development.md
cp /path/to/agent-skills/skills/code-review-and-quality/SKILL.md .cursor/rules/code-review-and-quality.md
cp /path/to/agent-skills/skills/incremental-implementation/SKILL.md .cursor/rules/incremental-implementation.md
```

该目录中的规则会自动加载到 Cursor 的上下文中。

### 方案 2：.cursorrules 文件

在项目根目录创建 `.cursorrules` 文件，内联核心技能：

```bash
# 生成合并的规则文件
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .cursorrules
echo "\n---\n" >> .cursorrules
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> .cursorrules
```

### 方案 3：Notepads（记事本）

Cursor 的 Notepads 功能可以存储可重用的上下文。为常用技能创建记事本：

1. 打开 Cursor -> Settings -> Notepads
2. 创建名为 "swe: Test-Driven Development" 的记事本
3. 粘贴 `skills/test-driven-development/SKILL.md` 的内容
4. 在对话中通过 `@notepad swe: Test-Driven Development` 引用

## 推荐配置

### 核心技能（始终加载）

添加到 `.cursor/rules/`：

1. `test-driven-development.md` -- TDD 工作流和 Prove-It 模式
2. `code-review-and-quality.md` -- 五维审查
3. `incremental-implementation.md` -- 小步可验证的增量构建

### 阶段特定技能（作为 Notepads 加载）

为按需使用的技能创建记事本：

- "swe: Spec Development" -> `spec-driven-development/SKILL.md`
- "swe: Frontend UI" -> `frontend-ui-engineering/SKILL.md`
- "swe: Security" -> `security-and-hardening/SKILL.md`
- "swe: Performance" -> `performance-optimization/SKILL.md`

在处理相关任务时通过 `@notepad` 引用。

## 使用技巧

1. **不要一次加载所有技能** -- Cursor 有上下文限制。将 2-3 个技能作为 rules 加载，其余作为 notepads。
2. **显式引用技能** -- 告诉 Cursor "按照 test-driven-development 规则处理这个变更"，确保它读取已加载的规则。
3. **使用 Agent 进行审查** -- 复制 `agents/code-reviewer.md` 的内容，告诉 Cursor "使用此代码审查框架审查这个 diff"。
4. **按需加载参考资料** -- 处理性能问题时，引用 `@notepad performance-checklist` 或粘贴检查清单内容。
