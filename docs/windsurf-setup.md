# 在 Windsurf 中使用 agent-skills

## 设置

### 项目规则

Windsurf 使用 `.windsurfrules` 来存放项目级代理指令：

```bash
# 从最重要的技能创建合并的规则文件
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .windsurfrules
echo "\n---\n" >> .windsurfrules
cat /path/to/agent-skills/skills/incremental-implementation/SKILL.md >> .windsurfrules
echo "\n---\n" >> .windsurfrules
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> .windsurfrules
```

### 全局规则

对于希望在所有项目中使用的技能，将它们添加到 Windsurf 的全局规则中：

1. 打开 Windsurf -> Settings -> AI -> Global Rules
2. 粘贴你最常用的技能内容

## 推荐配置

将 `.windsurfrules` 聚焦在 2-3 个核心技能，以保持在上下文限制之内：

```
# .windsurfrules
# 本项目的核心 agent-skills

[粘贴 test-driven-development SKILL.md]

---

[粘贴 incremental-implementation SKILL.md]

---

[粘贴 code-review-and-quality SKILL.md]
```

## 使用技巧

1. **精选技能** -- Windsurf 的上下文有限。选择能解决最大质量缺口的技能。
2. **在对话中引用** -- 在处理特定阶段时，将额外的技能内容粘贴到对话中（例如构建鉴权时粘贴 `security-and-hardening`）。
3. **将参考资料用作检查清单** -- 粘贴 `references/security-checklist.md` 并让 Windsurf 逐项验证。
