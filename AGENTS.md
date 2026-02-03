# AGENTS.md - Guide for AI Coding Assistants and Contributors

## Overview
This document serves as a guide for both AI coding assistants and human developers contributing to this repository. Its purpose is to ensure consistency in contributions, streamline workflows, and adhere to the project’s standards.

---

## Project Overview
This repository, `lodestar`, is a continuation and personalization of the original Lodestar project. It focuses on:
- **Streamlined Consensus Layer Development**: Building and maintaining core functionalities inspired by Ethereum specifications.
- **Customization**: Features tailored to personal workflows and experimental improvements.

---

## Directory Structure
An overview of the repository setup:
- **src/**: Contains core source code.
- **tests/**: Includes unit and integration tests.
- **docs/**: Project documentation.
- **scripts/**: Utility scripts for automation.
- **configs/**: Configuration files for different environments.

---

## Build Process
Before contributing, ensure you set up the development environment correctly:
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Build Project**:
   ```bash
   npm run build
   ```
3. **Run Tests**:
   ```bash
   npm test
   ```

---

## Code Style
Follow these conventions to maintain consistency:
1. **Linting**:
   - Run lint checks: `npm run lint`
   - Fix issues automatically: `npm run lint:fix`
2. **Formatting**:
   - Use Prettier for formatting.
   - Ensure no trailing whitespace or unused imports.

---

## Contribution Guidelines
1. **Fork and Clone**:
   ```bash
   git clone https://github.com/twoeths/lodestar.git
   ```
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/<short-name>
   ```
3. **Commit Messages**:
   - Use descriptive commit messages.
   - Example: `feat: add support for new state transition logic`.
4. **Pull Request Guidelines**:
   - Draft pull requests for incomplete contributions.
   - Include a detailed description for reviewers.

---

## Testing Guidelines
1. Always write tests for new features.
2. Run all tests locally before creating a pull request:
   ```bash
   npm test
   ```
3. If end-to-end or integration tests are required, document assumptions.

---

## Common Development Tasks
1. **Sync with Upstream**:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```
2. **Generate Documentation**:
   ```bash
   npm run docs
   ```
3. **Address Issues/Reviews**:
   - Use GitHub Issues for tracking bugs/enhancements.
   - Respond promptly to reviewer comments.

---

## Improvements
This document is tailored to the needs of this forked repository. Contributors are encouraged to suggest any additional tasks or workflows that improve clarity and productivity in this file.