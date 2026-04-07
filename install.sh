#!/usr/bin/env bash
#
# install.sh — 将 skills/ 目录下的技能安装到 Claude Code 和/或 OpenClaw
#
# 用法:
#   ./install.sh                  # 安装到所有可用目标
#   ./install.sh claude           # 仅安装到 Claude Code
#   ./install.sh openclaw         # 仅安装到 OpenClaw
#   ./install.sh onepager         # 仅安装指定技能到所有目标
#   ./install.sh claude onepager  # 仅安装指定技能到 Claude Code
#
# 选项:
#   --copy    使用复制而非符号链接（默认使用符号链接）
#   --remove  卸载已安装的技能

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"

CLAUDE_DIR="$HOME/.claude/skills"
OPENCLAW_DIR="$HOME/.openclaw/skills"

# --- 解析参数 ---

MODE="symlink"
ACTION="install"
TARGETS=()
SKILL_FILTER=()

for arg in "$@"; do
    case "$arg" in
        --copy)   MODE="copy" ;;
        --remove) ACTION="remove" ;;
        claude)   TARGETS+=("claude") ;;
        openclaw) TARGETS+=("openclaw") ;;
        *)        SKILL_FILTER+=("$arg") ;;
    esac
done

# 默认安装到所有目标
if [[ ${#TARGETS[@]} -eq 0 ]]; then
    TARGETS=("claude" "openclaw")
fi

# --- 工具函数 ---

get_target_dir() {
    case "$1" in
        claude) echo "$CLAUDE_DIR" ;;
        openclaw)   echo "$OPENCLAW_DIR" ;;
    esac
}

install_skill() {
    local skill_name="$1"
    local target_dir="$2"
    local src="$SKILLS_SRC/$skill_name"
    local dst="$target_dir/$skill_name"

    mkdir -p "$target_dir"

    # 已存在则先清理
    if [[ -e "$dst" || -L "$dst" ]]; then
        rm -rf "$dst"
    fi

    if [[ "$MODE" == "symlink" ]]; then
        ln -s "$src" "$dst"
        echo "  ✓ $skill_name → $dst (symlink)"
    else
        cp -r "$src" "$dst"
        echo "  ✓ $skill_name → $dst (copy)"
    fi
}

remove_skill() {
    local skill_name="$1"
    local target_dir="$2"
    local dst="$target_dir/$skill_name"

    if [[ -e "$dst" || -L "$dst" ]]; then
        rm -rf "$dst"
        echo "  ✓ removed $skill_name from $target_dir"
    else
        echo "  - $skill_name not found in $target_dir, skipping"
    fi
}

# --- 收集要处理的技能 ---

if [[ ! -d "$SKILLS_SRC" ]]; then
    echo "错误: skills/ 目录不存在: $SKILLS_SRC" >&2
    exit 1
fi

SKILLS=()
if [[ ${#SKILL_FILTER[@]} -gt 0 ]]; then
    for name in "${SKILL_FILTER[@]}"; do
        if [[ -d "$SKILLS_SRC/$name" ]]; then
            SKILLS+=("$name")
        else
            echo "警告: 技能 '$name' 不存在于 skills/ 目录中, 跳过" >&2
        fi
    done
else
    for dir in "$SKILLS_SRC"/*/; do
        [[ -d "$dir" ]] && SKILLS+=("$(basename "$dir")")
    done
fi

if [[ ${#SKILLS[@]} -eq 0 ]]; then
    echo "没有找到可处理的技能"
    exit 0
fi

# --- 执行 ---

echo ""
if [[ "$ACTION" == "install" ]]; then
    echo "安装技能 (${MODE}):"
else
    echo "卸载技能:"
fi
echo ""

for target in "${TARGETS[@]}"; do
    target_dir="$(get_target_dir "$target")"
    echo "[$target] → $target_dir"
    for skill in "${SKILLS[@]}"; do
        if [[ "$ACTION" == "install" ]]; then
            install_skill "$skill" "$target_dir"
        else
            remove_skill "$skill" "$target_dir"
        fi
    done
    echo ""
done

echo "完成!"
