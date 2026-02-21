---
name: gemini-agent-setup
description: Configures the Gemini agent with project-specific settings and rules.
---

# Gemini Agent Setup Skill

This skill helps configure the Gemini agent with project-specific settings and rules.

## When to use this skill

- When initializing a new project with Gemini agent
- When onboarding new team members to use Gemini
- When updating project-specific rules and configurations
- When setting up automated workflows with Gemini

## How to use it

1. Ensure the .gemini directory structure is properly set up
2. Configure global rules in GEMINI.md
3. Set up workspace-specific rules in .gemini/rules/
4. Define project-specific workflows in .gemini/workflows/
5. Add reusable skills in .gemini/skills/

## Configuration Steps

### 1. Global Rules

- Place global rules in `~/.gemini/GEMINI.md`
- These apply across all workspaces
- Include general coding standards and practices

### 2. Workspace Rules

- Place workspace rules in `.gemini/rules/` directory
- These apply to the specific project
- Include project-specific conventions

### 3. Workflows

- Create workflow files in `.gemini/workflows/` directory
- Use markdown format with YAML frontmatter
- Define step-by-step processes for common tasks

### 4. Skills

- Create skill directories in `.gemini/skills/` directory
- Each skill needs a SKILL.md file with instructions
- Include any additional resources needed by the skill

## Best Practices

- Keep rules focused and specific
- Use clear, descriptive names for workflows
- Document skills thoroughly with usage examples
- Regularly review and update configurations as the project evolves
- Coordinate with team members on shared configurations
