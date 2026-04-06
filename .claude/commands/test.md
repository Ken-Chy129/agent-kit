---
description: 运行 TDD 工作流——编写失败的测试、实现代码、验证。修复 Bug 时使用"证明它"模式。
---

调用 agent-skills:test-driven-development 技能。

对于新功能：
1. 编写描述预期行为的测试（测试应当失败）
2. 实现代码使测试通过
3. 在保持测试通过的前提下进行重构

对于 Bug 修复（"证明它"模式）：
1. 编写一个能复现 Bug 的测试（必须失败）
2. 确认测试确实失败
3. 实现修复
4. 确认测试通过
5. 运行完整测试套件检查回归

对于浏览器相关的问题，还需调用 agent-skills:browser-testing-with-devtools 通过 Chrome DevTools MCP 进行验证。
