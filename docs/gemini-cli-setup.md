# 在 Gemini CLI 中使用 agent-skills

## 设置

### 方案 1：作为 Skills 安装（推荐）

Gemini CLI 有原生的 skills 系统，会自动发现 `.gemini/skills/` 或 `.agents/skills/` 目录中的 `SKILL.md` 文件。每个技能在匹配你的任务时按需激活。

**从仓库安装：**

```bash
gemini skills install https://github.com/addyosmani/agent-skills.git
```

**或从本地克隆安装：**

```bash
git clone https://github.com/addyosmani/agent-skills.git
gemini skills install /path/to/agent-skills
```

**仅为特定工作区安装：**

```bash
gemini skills install /path/to/agent-skills --scope workspace
```

以工作区范围安装的技能会放入 `.gemini/skills/`（或 `.agents/skills/`）。用户级技能放入 `~/.gemini/skills/`。

安装后，通过以下命令验证：

```
/skills list
```

Gemini CLI 会自动将技能名称和描述注入提示词。当识别到匹配的任务时，会在加载完整指令前请求许可激活该技能。

### 方案 2：GEMINI.md（持久上下文）

对于希望始终作为持久项目上下文加载（而非按需激活）的技能，将它们添加到项目的 `GEMINI.md` 中：

```bash
# 创建包含核心技能的 GEMINI.md 作为持久上下文
cat /path/to/agent-skills/skills/incremental-implementation/SKILL.md > GEMINI.md
echo -e "\n---\n" >> GEMINI.md
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> GEMINI.md
```

你也可以通过导入独立文件来模块化管理：

```markdown
# 项目指令

@skills/test-driven-development/SKILL.md
@skills/incremental-implementation/SKILL.md
```

使用 `/memory show` 验证已加载的上下文，使用 `/memory reload` 在修改后刷新。

> **Skills 与 GEMINI.md 的区别：** Skills 是按需激活的专业知识，仅在相关时启用，保持上下文窗口清洁。GEMINI.md 提供持久上下文，每次提示时都会加载。对阶段性工作流使用 skills，对始终需要的项目规范使用 GEMINI.md。

## 推荐配置

### 常驻加载（GEMINI.md）

将以下技能作为每个会话的持久上下文：

- `incremental-implementation` -- 小步可验证的增量构建
- `code-review-and-quality` -- 五维审查

### 按需加载（Skills）

将以下技能作为 skills 安装，仅在相关时激活：

- `test-driven-development` -- 在实现逻辑或修复 bug 时激活
- `spec-driven-development` -- 在启动新项目或功能时激活
- `frontend-ui-engineering` -- 在构建 UI 时激活
- `security-and-hardening` -- 在安全审查时激活
- `performance-optimization` -- 在性能优化时激活

## 使用技巧

1. **优先使用 skills 而非 GEMINI.md** -- Skills 按需激活，保持上下文窗口聚焦。只有希望始终加载的技能才放入 GEMINI.md。
2. **技能描述很重要** -- 每个 SKILL.md 的 frontmatter 中有一个 `description` 字段，告诉 Gemini 何时激活。本仓库中的描述已针对自动激活进行了优化。
3. **使用 Agent 进行审查** -- 在请求结构化代码审查时，复制 `agents/code-reviewer.md` 的内容。
4. **与参考资料结合使用** -- 在处理特定质量领域（如测试或性能）时，引用 `references/` 中的检查清单。
