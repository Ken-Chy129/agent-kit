# simplify-ignore 钩子

为 `/code-simplify` 提供代码块级别的保护。标记永远不应被简化的代码 -- 模型将看不到它。

## 设置

1. 标注你想要保护的代码块：

```js
/* simplify-ignore-start: perf-critical */
// 手动展开的 XOR -- 比循环快 3 倍
result[0] = buf[0] ^ key[0];
result[1] = buf[1] ^ key[1];
result[2] = buf[2] ^ key[2];
result[3] = buf[3] ^ key[3];
/* simplify-ignore-end */
```

2. 在 `.claude/settings.json` 中添加钩子：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "hooks": [{ "type": "command", "command": "bash ${CLAUDE_PROJECT_DIR}/hooks/simplify-ignore.sh" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "bash ${CLAUDE_PROJECT_DIR}/hooks/simplify-ignore.sh" }]
      }
    ],
    "Stop": [
      {
        "hooks": [{ "type": "command", "command": "bash ${CLAUDE_PROJECT_DIR}/hooks/simplify-ignore.sh" }]
      }
    ]
  }
}
```

3. 运行 `/code-simplify` -- 受保护的代码块会变成 `/* BLOCK_de115a1d: perf-critical */` 占位符。模型在推理周围代码时不会看到受保护的实现。

> **注意：** 钩子将临时备份存储在 `.claude/.simplify-ignore-cache/` 中。请确保此路径已添加到 `.gitignore` 中。

## 工作原理

一个脚本，三个钩子事件：

| 事件 | 操作 |
|---|---|
| `PreToolUse Read` | 备份文件，将代码块原地替换为 `BLOCK_<hash>` 占位符 |
| `PostToolUse Edit\|Write` | 将占位符展开回真实代码，保存模型的修改，重新过滤 |
| `Stop` | 会话结束时从备份恢复所有文件 |

每个代码块通过内容哈希（通过 `shasum`/`sha1sum` 生成 8 位十六进制字符）标识，因此即使模型复制或重新排列占位符，往返转换也是无歧义的。缓存按项目隔离，防止跨会话干扰。

## 标注语法

```js
/* simplify-ignore-start */           // 基本用法 -- 隐藏代码块
/* simplify-ignore-start: reason */   // 带原因说明 -- 出现在占位符中
/* simplify-ignore-end */
```

任何注释风格均可使用（`//`、`/*`、`#`、`<!--`）。支持单个文件中的多个代码块和单行代码块。占位符保留原始注释语法（例如 Python 中的 `# BLOCK_xxx`，HTML 中的 `<!-- BLOCK_xxx -->`）。

## 崩溃恢复

如果 Claude Code 在未触发 Stop 钩子的情况下崩溃，磁盘上的文件可能仍包含 `BLOCK_<hash>` 占位符。手动恢复方法：

```bash
echo '{}' | bash hooks/simplify-ignore.sh
```

备份存储在项目目录下的 `.claude/.simplify-ignore-cache/` 中。

## 已知限制

- **单行代码块会隐藏整行。** 如果 `simplify-ignore-start` 和 `simplify-ignore-end` 与其他代码出现在同一行，整行都会对模型隐藏，而不仅仅是标注的部分。请为标注使用独立的行。
- **注释后缀检测仅覆盖 `*/` 和 `-->`。** 使用非标准注释结束符的模板引擎（ERB `%>`、Blade `--}}`）可能产生不平衡的占位符。请改用 `#` 或 `//` 风格的注释。
- **后备展开是渐进式的，非精确匹配。** 如果模型修改了占位符的格式（例如更改了 reason 文本），钩子会尝试逐步简化的匹配：完整占位符 -> 前缀+哈希+后缀 -> 仅哈希。仅哈希的后备方案可能留下外观残留（例如多余的 `:` 或 reason 文本）。发生这种情况时会在 stderr 打印警告。
- **文件重命名会保留占位符。** 如果模型通过 shell 命令重命名或移动文件，新文件将保留 `BLOCK_<hash>` 占位符。会话停止时原始代码会保存为 `<旧文件名>.recovered`。你需要手动将恢复的代码还原到新文件中。

## 依赖要求

- `jq`、`shasum` 或 `sha1sum`（自动检测）、Bash 3.2+
