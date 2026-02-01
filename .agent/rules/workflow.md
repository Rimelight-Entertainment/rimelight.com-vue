# Development Workflow

## Solution Strategy

- Provide a high-level overview before generating code
- Justify approaches and outline trade-offs
- Ask clarifying questions about purpose or edge cases if requirements are ambiguous

## Code Delivery

- Deliver complete, runnable, copy-pasteable segments
- **No omissions or placeholders**
- No "// rest of the code stays the same" comments

## No Emojis

- Do not use emojis anywhere
- Not in code, comments, console logs, documentation, or AI responses

## Final Verification

After concluding any task:

1. Run a typecheck using `bun run typecheck` or `bun run check`
2. Fix any newly introduced errors before considering the task complete
3. Ensure all linting and formatting passes

**Standard Command:**

```bash
bun run check
```

This verifies:

- TypeScript types
- Linting (oxlint)
- Formatting (oxfmt)

## Strict Adherence

- All tasks must conclude with a clean check
- If errors arise, resolve them immediately
- Do not mark tasks as complete with failing checks
