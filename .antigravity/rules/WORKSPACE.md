# Workspace Rules for Rimelight Projects

## Project-Specific Guidelines

- Follow the rimelight-utilities shared configuration
- Adhere to the established component architecture
- Use the provided composables and utilities
- Maintain consistency with existing patterns

## Component Development

- All components must follow the standardized prop interface pattern
- Use the `useRC` composable for responsive classes
- Implement proper slot interfaces as specified
- Follow the SFC structure with proper region comments

## Internationalization (i18n)

- Always use the `t()` function for translatable strings
- Provide fallback values for translations
- Use proper translation keys following the established convention
- Support RTL languages where applicable

## Accessibility (a11y)

- Implement proper semantic HTML structure
- Use ARIA attributes where necessary
- Ensure keyboard navigation support
- Follow WCAG 2.1 AA guidelines

## Git Workflow

- Follow conventional commits specification
- Write meaningful commit messages
- Keep commits atomic and focused
- Use feature branches for new functionality

## Documentation

- Document public APIs with proper JSDoc
- Update README files when adding new features
- Comment complex logic appropriately
- Follow the existing documentation style
