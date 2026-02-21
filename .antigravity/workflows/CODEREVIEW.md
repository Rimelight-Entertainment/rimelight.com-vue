---
name: code-review
description: Performs a comprehensive code review following rimelight standards
---

# Code Review Workflow

This workflow performs a comprehensive code review following rimelight standards.

## Steps

1. **Check Code Quality**
   - Run `bun lint` to check for style issues
   - Verify all oxlint rules pass
   - Check for any warnings or errors

2. **Verify Type Safety**
   - Run `bun typecheck` to ensure TypeScript compilation
   - Verify all interfaces and types are properly defined
   - Check for any `any` types that could be more specific

3. **Review Component Structure**
   - Verify components follow the standard prop interface pattern
   - Check that all props are properly typed with interfaces
   - Ensure emits are properly defined with interfaces
   - Verify slots are properly documented

4. **Test Coverage**
   - Ensure new functionality has appropriate tests
   - Run `bun test` to verify all tests pass
   - Check test coverage meets project standards

5. **Performance Check**
   - Look for potential performance bottlenecks
   - Verify proper use of computed properties
   - Check for unnecessary re-renders

6. **Security Review**
   - Verify proper input sanitization
   - Check for potential XSS vulnerabilities
   - Ensure sensitive data is not exposed
