#!/usr/bin/env bash
set -e

# ================================
# RESOLVE PATHS (ROBUST)
# ================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
GLOBAL_AI_DIR="$SCRIPT_DIR"

COPILOT_FILE=".github/copilot-instructions.md"

echo "📁 Project root: $PROJECT_ROOT"
echo "📁 Global AI dir: $GLOBAL_AI_DIR"
echo ""

# ================================
# FIND REPOS (AUTO)
# ================================
find "$PROJECT_ROOT" -maxdepth 1 -mindepth 1 -type d | while read -r repo; do
  repo_name="$(basename "$repo")"

  # Skip .ai folder itself
  if [ "$repo_name" = ".ai" ]; then
    continue
  fi

  # Only sync git repositories
  if [ ! -d "$repo/.git" ]; then
    continue
  fi

  echo "🔄 Syncing AI rules to $repo_name"

  # ================================
  # SYNC .ai RULES
  # ================================
  mkdir -p "$repo/.ai"

  rsync -av --delete \
    --exclude "globals.explained.md" \
    --exclude "sync-ai-rules.sh" \
    "$GLOBAL_AI_DIR/" \
    "$repo/.ai/"

  # ================================
  # COPILOT INSTRUCTIONS
  # ================================
  mkdir -p "$repo/.github"

  cat > "$repo/$COPILOT_FILE" <<'EOF'
Follow project AI rules.

Source of truth:
- .ai/entrypoint.md

Core constraints:
- Target Node.js LTS 24 unless repo rules say otherwise
- Respect Sonar quality gates (no issues, no duplication, >=90% coverage)
- Prefer ORM for DB access; raw SQL only for justified exceptions
- Follow existing lint configuration
- Avoid assumptions; prefer backward compatibility
EOF

  echo "✅ Done: $repo_name"
  echo ""
done

echo "🎉 AI rules sync complete"
