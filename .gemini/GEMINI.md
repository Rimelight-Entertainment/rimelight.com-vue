# Global Rules for Rimelight Development (Gemini Version)

## Code Style & Architecture

- Always follow the existing code patterns in the project
- Maintain consistency with the established architecture
- Prefer composition over inheritance where possible
- Follow the DRY (Don't Repeat Yourself) principle

## Naming Conventions

- Use camelCase for variable and function names
- Use PascalCase for component and class names
- Use UPPER_SNAKE_CASE for constants
- Use kebab-case for file names

## TypeScript Best Practices

- Always provide type annotations for function parameters and return types
- Use interfaces over types for object shapes
- Prefer readonly arrays and objects when mutation is not intended
- Use strict null checks and handle nullable types appropriately

## Vue/Nuxt Specific Guidelines

- Follow Vue Style Guide recommendations
- Use Composition API with `<script setup>` syntax
- Organize component props in interfaces
- Use descriptive names for slots and emits
- Follow the SFC (Single File Component) structure with proper ordering

## Testing

- Write unit tests for business logic
- Use meaningful test descriptions
- Follow AAA (Arrange, Act, Assert) pattern
- Mock external dependencies appropriately

## Performance

- Optimize for minimal re-renders
- Use computed properties for derived state
- Implement proper caching strategies
- Lazy-load components when appropriate

## Security

- Sanitize user inputs
- Validate data at boundaries
- Follow OWASP security guidelines
- Never expose sensitive information in client-side code
