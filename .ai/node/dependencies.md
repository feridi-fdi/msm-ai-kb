DEPENDENCY

- Never import external libs directly
- Wrap in app/utils/*.util.js or lib/*.js
- Import from @/utils or @/lib
- Required: validation, logging, HTTP, cache, queue, date/time, DB
- Exceptions: framework core, testing, @types

