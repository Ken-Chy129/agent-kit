# Agent Kit

**AI Agent 工具包——技能、钩子、插件的集合。**

一个 Claude Code marketplace，包含面向 AI 编码智能体的生产级工程插件。

## 安装

```bash
# 添加 marketplace
/plugin marketplace add Ken-Chy129/agent-kit

# 安装插件
/plugin install spec-kit@agent-kit
```

---

## 插件列表

### spec-kit

从规格到发布的完整工程技能包。将资深工程师的工作流、质量关卡和最佳实践编码封装，使 AI 智能体在开发的每个阶段都能一致地遵循。

```
  定义            规划           构建           验证           评审           发布
 ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐
 │ 构思 │ ───▶ │ 需求 │ ───▶ │ 编码 │ ───▶ │ 测试 │ ───▶ │ 质量 │ ───▶ │ 上线 │
 │ 精炼 │      │ 文档 │      │ 实现 │      │ 调试 │      │ 关卡 │      │ 部署 │
 └──────┘      └──────┘      └──────┘      └──────┘      └──────┘      └──────┘
  /spec          /plan          /build        /test         /review       /ship
```

**7 个命令：**

| 命令 | 功能 |
|------|------|
| `/spec` | 先有规格，后写代码 |
| `/plan` | 分解为小的可验证任务 |
| `/build` | 增量实现，一次一个切片 |
| `/test` | TDD 工作流，测试即证据 |
| `/review` | 五维度代码审查 |
| `/code-simplify` | 简化代码，清晰优于巧妙 |
| `/ship` | 发布前检查清单 |

**20 个技能 · 3 个 Agent 人格 · 4 个参考清单**

详见 [plugins/spec-kit/](plugins/spec-kit/)

---

## 项目结构

```
agent-kit/
├── .claude-plugin/
│   └── marketplace.json         ← marketplace 索引
├── plugins/
│   └── spec-kit/                ← 工程技能包
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/            ← 7 个斜杠命令
│       ├── skills/              ← 20 个工程技能
│       ├── agents/              ← 3 个 Agent 人格
│       ├── references/          ← 4 个参考清单
│       ├── hooks/               ← 会话生命周期钩子
│       └── docs/                ← 工具配置指南
├── README.md
├── CLAUDE.md
└── LICENSE
```

未来可在 `plugins/` 下添加更多插件。

---

## 许可证

MIT
