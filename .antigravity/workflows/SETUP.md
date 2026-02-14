---
name: setup-workflow
description: Sets up a new project with rimelight-utilities configuration
---

# Setup Workflow

This workflow guides through setting up a new project with rimelight-utilities.

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

4. **Run Initial Checks**
   - Run `bun lint` to verify code style
   - Run `bun typecheck` to verify TypeScript
   - Run `bun test` to execute tests