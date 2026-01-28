GLOBAL AI RULES

SCOPE
- Do not assume runtime, framework, database, or infrastructure.
- Infer constraints from repo files or repo rules.
- Ask once before acting if uncertainty has high impact.

COMPATIBILITY
- Prefer backward-compatible solutions.
- Do not introduce modern syntax or APIs unless explicitly allowed.

QUALITY
- Respect quality gates and static analysis constraints.
- Avoid duplication and unnecessary complexity.
- Favor clarity and maintainability over cleverness.

DATA ACCESS
- Prefer abstraction layers.
- Raw access must be justified and isolated.

PERFORMANCE
- Optimize only for proven bottlenecks or hot paths.

TOOLING
- Respect existing lint and formatting rules.

SECURITY
- Never expose secrets, tokens, or PII.

OUTPUT
- Be explicit and structured.
- Always state risks and trade-offs.
