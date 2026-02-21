---
name: lint-and-format
description: Runs linting and formatting tools to ensure code quality and consistency.
---

# Linting and Formatting Skill

This skill helps maintain code quality and consistency by running linting and formatting tools.

## When to use this skill

- Before committing code
- When setting up a new development environment
- When onboarding new team members
- When updating dependencies
- When addressing code quality issues

## How to use it

1. Run the appropriate linting command based on the project type
2. Address all errors and warnings
3. Run formatting tools to ensure consistent code style
4. Verify all checks pass before proceeding

## Available Commands

### For Bun-based projects:
- `bun lint` - Run oxlint for TypeScript/JavaScript files
- `bun lint:fix` - Run oxlint with auto-fix enabled
- `bun format` - Run oxfmt for formatting (if available)
- `bun typecheck` - Run TypeScript type checking

### For Nuxt projects:
- `bun lint` - Run linting with oxlint and other configured tools
- `bun lint:fix` - Run linting with auto-fix enabled
- `npx nuxi prepare` - Prepare the project for development
- `npx nuxi typecheck` - Run type checking

## Common Issues and Solutions

### Linting Errors
- Always fix errors before warnings
- Pay attention to security-related rules
- Address complexity issues by refactoring
- Follow the specific rules defined in oxlint-shared-config

### Formatting Issues
- Ensure consistent indentation (typically 2 spaces)
- Proper spacing around operators
- Consistent quote usage
- Trailing commas where appropriate

## Best Practices

- Run linting regularly during development
- Configure your IDE to highlight linting issues
- Use pre-commit hooks to prevent bad commits
- Address issues incrementally rather than all at once
- Review linting configuration periodically for updates