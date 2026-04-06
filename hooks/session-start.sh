#!/bin/bash
# agent-skills 会话启动钩子
# 在每个新会话中注入 using-agent-skills 元技能

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$(dirname "$SCRIPT_DIR")/skills"
META_SKILL="$SKILLS_DIR/using-agent-skills/SKILL.md"

if [ -f "$META_SKILL" ]; then
  CONTENT=$(cat "$META_SKILL")
  # 以 JSON 格式输出供 Claude Code 钩子消费
  cat <<EOF
{
  "priority": "IMPORTANT",
  "message": "agent-skills loaded. Use the skill discovery flowchart to find the right skill for your task.\n\n$CONTENT"
}
EOF
else
  echo '{"priority": "INFO", "message": "agent-skills: using-agent-skills meta-skill not found. Skills may still be available individually."}'
fi
