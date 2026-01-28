# AI Rules Knowledge Base

A centralized repository of AI coding guidelines and rules for GitHub Copilot and AI assistants. This project helps maintain consistent code quality, standards, and best practices across all your projects.

## 📋 Overview

This repository contains:
- **Global AI Rules**: Universal coding standards applicable to all projects
- **Domain-specific Rules**: Specialized guidelines for Node.js, databases, etc.
- **Automated Sync**: Script to distribute rules across multiple projects
- **GitHub Copilot Integration**: Automatic instruction loading for AI assistants

## 🗂️ Project Structure

```
.ai/
├── entrypoint.md           # Rule loading sequence definition
├── globals.runtime.md      # Global AI coding rules
├── node/                   # Node.js-specific rules
│   ├── runtime.md          # Node.js runtime constraints
│   ├── sonar.md            # SonarQube quality gates
│   ├── lint.md             # Linting rules
│   └── dependencies.md     # Dependency abstraction rules
├── db/                     # Database rules
│   └── postgres.md         # PostgreSQL best practices
└── sync-ai-rules.sh        # Sync script for multi-repo setup

.github/
└── copilot-instructions.md # GitHub Copilot configuration
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-rules-kb.git
cd ai-rules-kb
```

### 2. Understanding the Rule System

Rules are loaded in a specific order (defined in [.ai/entrypoint.md](.ai/entrypoint.md)):

1. **Global Rules** (`globals.runtime.md`) - Universal standards
2. **Domain Rules** (e.g., `node/`, `db/`) - Technology-specific guidelines
3. **Repository Rules** (`.ai/repo.md`) - Project-specific overrides

## 📦 Initialize in Your Projects

### Option A: Automated Sync (Multiple Projects)

If you have multiple projects in a parent directory:

```bash
# Structure:
# /workspace/
#   ├── ai-rules-kb/        # This repository
#   ├── project-1/
#   ├── project-2/
#   └── project-3/

cd ai-rules-kb/.ai
chmod +x sync-ai-rules.sh
./sync-ai-rules.sh
```

This script will:
- Sync `.ai/` rules to all sibling git repositories
- Create `.github/copilot-instructions.md` in each project
- Automatically skip non-git directories

### Option B: Manual Setup (Single Project)

1. **Copy the `.ai` folder** to your project root:

```bash
# From your project root
cp -r /path/to/ai-rules-kb/.ai ./
```

2. **Create GitHub Copilot instructions**:

```bash
mkdir -p .github
cat > .github/copilot-instructions.md <<'EOF'
Follow project AI rules.

Source of truth:
- .ai/entrypoint.md

Core constraints:
- Target Node.js LTS 24 unless repo rules say otherwise
- Respect Sonar quality gates
- Prefer ORM; raw SQL only for justified exceptions
- Follow existing lint rules
- Avoid assumptions; prefer backward compatibility
EOF
```

3. **Add project-specific rules** (optional):

```bash
cat > .ai/repo.md <<'EOF'
# Repository-Specific Rules

[Add your project-specific constraints here]
EOF
```

## 🎯 Core Rules Summary

### Global Standards
- Don't assume runtime, framework, or infrastructure
- Prefer backward-compatible solutions
- Respect quality gates and static analysis
- Never expose secrets or PII
- Optimize only proven bottlenecks

### Node.js Projects
- **Runtime**: Node.js LTS 24 (unless overridden)
- **Quality**: Zero Sonar issues, ≥90% test coverage
- **Database**: ORM mandatory; raw SQL only for justified exceptions
- **Dependencies**: External libraries must be wrapped in abstraction layer

### Database Access
- Use ORM by default (e.g., TypeORM)
- Raw SQL allowed only for:
  - `dblink` operations
  - Unsupported ORM features

### Dependency Management
- **Never import external libraries directly** in business logic
- Create abstraction layer in `app/utils/` folder (e.g., `validator.util.js`)
- Business modules import from abstraction, not from `node_modules`
- Benefits: Easy library replacement, no duplication, single point of change

**Example:**
```javascript
// ❌ BAD - Direct import everywhere
import Joi from 'joi';

// ✅ GOOD - Import from abstraction
import { validator } from '@/utils';
```
- Must be: isolated, documented, parameterized, tested

## 🔧 Customization

### Project-Specific Overrides

In any project, create `.ai/repo.md`:

```markdown
# Project: My API

RUNTIME
- Node.js 20 (legacy constraint)

EXCEPTIONS
- Sonar: Cognitive complexity 20 (justified for legacy migration)
- Reference: ISSUE-123
```

## 🤖 How AI Assistants Use These Rules

### GitHub Copilot
1. **GitHub Copilot** reads `.github/copilot-instructions.md`
2. Instructions point to `.ai/entrypoint.md`
3. Rules are loaded in order: globals → domain → repo
4. AI assistant applies constraints during code generation

### Codex CLI
Use with codex CLI tool:

```bash
codex -- "$(cat .ai/entrypoint.md)"
```

This loads all rules directly into codex context.

## 🔄 Keeping Rules Updated

### Manual Update

```bash
# In your project
cd /path/to/ai-rules-kb
git pull origin main

# Re-run sync
cd .ai
./sync-ai-rules.sh
```

## 📚 Rule Categories

| Category | Files | Purpose |
|----------|-------|---------|
| **Global** | `globals.runtime.md` | Universal coding standards |
| **Node.js** | `node/*.md` | Runtime, quality, linting rules |
| **Database** | `db/*.md` | Data access patterns |
| **Orchestration** | `entrypoint.md` | Rule loading order |

## 🛠️ Troubleshooting

### AI Not Following Rules

1. Verify `.github/copilot-instructions.md` exists
2. Check `.ai/entrypoint.md` is present
3. Ensure rules are readable (not binary/corrupted)
4. Restart VS Code or IDE

### Sync Script Not Working

```bash
# Check script permissions
chmod +x .ai/sync-ai-rules.sh

# Run with verbose output
bash -x .ai/sync-ai-rules.sh

# Verify rsync is installed
which rsync
```

## 📖 Best Practices

1. **Version Control**: Always commit `.ai/` folder
2. **Documentation**: Keep rules concise and clear
3. **Exceptions**: Document all rule exceptions with justification
4. **Review**: Regularly review and update rules
5. **Team Alignment**: Ensure team understands and agrees with rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-rule`
3. Add/modify rules in `.ai/`
4. Test with `sync-ai-rules.sh`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Related Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [SonarQube Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

## 📧 Support

For questions or issues:
- Open an issue in this repository
- Review existing rules in `.ai/` folder
- Check project documentation

---

**Made with 🤖 for better AI-assisted coding**
