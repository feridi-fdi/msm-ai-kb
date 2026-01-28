POSTGRES RULES

- ORM usage is mandatory.
- Raw SQL is disallowed by default.

RAW SQL EXCEPTIONS
- Allowed only for dblink or unsupported ORM features.

REQUIREMENTS
- Isolated module.
- Documented justification.
- Parameterized queries.
- Covered by tests.

Do not mix ORM and raw SQL in one flow.
