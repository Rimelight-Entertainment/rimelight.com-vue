---
name: gemini-setup-workflow
description: Sets up a new project with rimelight-utilities and gemini configuration
---

# Gemini Setup Workflow

This workflow guides through setting up a new project with rimelight-utilities and gemini configuration.

## Steps

1. **Initialize Project**
   - Run `bun install` to install dependencies
   - Verify bun.lock file is up to date

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Fill in required environment variables

3. **Setup Git Hooks**
   - Run `bun prepare` to install husky hooks
   - Verify commitlint configuration

4. **Configure Gemini/Antigravity**
   - Ensure .gemini and .antigravity directories are properly set up
   - Verify rules, workflows, and skills are configured

5. **Run Initial Checks**
   - Run `bun lint` to verify code style
   - Run `bun typecheck` to verify TypeScript
   - Run `bun test` to execute tests