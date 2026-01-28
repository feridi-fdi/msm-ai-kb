Follow project AI rules.

Source of truth:
- .ai/entrypoint.md

Core constraints:
- Target Node.js LTS 24 unless repo rules say otherwise
- Respect Sonar quality gates (no issues, no duplication, >=90% coverage)
- Prefer ORM for DB access; raw SQL only for justified exceptions
- Follow existing lint configuration
- Avoid assumptions; prefer backward compatibility
