# 在 GitHub Copilot 中使用 agent-skills

## 设置

### Copilot 指令

GitHub Copilot 通过 `.github/copilot-instructions.md` 支持项目级指令：

```bash
mkdir -p .github

# 使用核心技能创建指令文件
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .github/copilot-instructions.md
echo "\n---\n" >> .github/copilot-instructions.md
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> .github/copilot-instructions.md
```

### Agent 人设（agents.md）

Copilot 支持专业化的 Agent 人设。使用 agent-skills 的 Agent：

```bash
# 复制 Agent 定义
cp /path/to/agent-skills/agents/code-reviewer.md .github/agents/code-reviewer.md
cp /path/to/agent-skills/agents/test-engineer.md .github/agents/test-engineer.md
cp /path/to/agent-skills/agents/security-auditor.md .github/agents/security-auditor.md
```

在 Copilot Chat 中调用 Agent：
- `@code-reviewer Review this PR`
- `@test-engineer Analyze test coverage for this module`
- `@security-auditor Check this endpoint for vulnerabilities`

### 自定义指令（用户级别）

对于希望在所有仓库中使用的技能：

1. 打开 VS Code -> Settings -> GitHub Copilot -> Custom Instructions
2. 添加你最常用的技能摘要

## 推荐配置

### .github/copilot-instructions.md

```markdown
# 项目编码规范

## 测试
- 先写测试再写代码（TDD）
- 修复 bug 时：先写一个失败的测试，再修复（Prove-It 模式）
- 测试层级：单元测试 > 集成测试 > 端到端测试（使用能捕获行为的最低层级）
- 每次修改后运行 `npm test`

## 代码质量
- 从五个维度审查：正确性、可读性、架构、安全性、性能
- 每个 PR 必须通过：lint、类型检查、测试、构建
- 代码或版本控制中不得包含密钥

## 实现
- 以小的、可验证的增量方式构建
- 每个增量：实现 -> 测试 -> 验证 -> 提交
- 禁止将格式变更与行为变更混在一起

## 边界
- 必须做：提交前运行测试、验证用户输入
- 需先确认：数据库 schema 变更、新增依赖
- 绝不能做：提交密钥、删除失败的测试、跳过验证
```

### 专业化 Agent

在 Copilot Chat 中使用 Agent 进行针对性的审查工作流。

## 使用技巧

1. **保持指令简洁** -- Copilot 指令在聚焦时效果最好。总结关键规则，而非包含完整的技能文件。
2. **使用 Agent 进行审查** -- code-reviewer、test-engineer 和 security-auditor Agent 是为 Copilot 的 Agent 模型设计的。
3. **在对话中引用** -- 在处理特定阶段时，将相关技能内容粘贴到 Copilot Chat 中提供上下文。
4. **与 PR 审查结合** -- 设置 Copilot 使用 code-reviewer Agent 人设来审查 PR。
