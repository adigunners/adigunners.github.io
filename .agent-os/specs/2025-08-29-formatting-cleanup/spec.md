# Spec Requirements Document

> Spec: Formatting Configuration Cleanup & Standardization
> Created: 2025-08-29
> Status: Planning

## Overview

Consolidate 10+ scattered formatting configurations into a unified, holistic system that prevents PR failures, eliminates markdown errors, enables reliable auto-formatting on save, and follows development best practices across the entire codebase.

## User Stories

### As a developer, I want reliable auto-formatting on save
- **Given** I'm editing HTML, CSS, JavaScript, or Markdown files in VSCode
- **When** I save the file (Cmd+S)
- **Then** the file should be automatically formatted according to project standards
- **And** I should not see any syntax errors or conflicting formatter warnings

### As a team lead, I want PR builds to pass consistently
- **Given** a developer submits a pull request
- **When** the CI/CD pipeline runs formatting checks
- **Then** the build should pass without formatting-related failures
- **And** there should be no markdown linting errors on valid markdown content
- **And** pre-commit hooks should catch issues before they reach CI

### As a maintainer, I want simplified formatting configuration
- **Given** the current scattered configuration across multiple files
- **When** I need to modify formatting rules or troubleshoot issues
- **Then** I should have a single source of truth for each formatting concern
- **And** configuration conflicts should be eliminated
- **And** the system should be easy to understand and maintain

## Spec Scope

### 1. VSCode Settings Consolidation
- **Fix syntax errors** in `.vscode/settings.json` that prevent proper IDE integration
- **Create unified language-specific formatting** with consistent indentation, quotes, and line endings
- **Resolve formatter conflicts** between Prettier, built-in formatters, and extensions
- **Enable format-on-save** for all supported file types (HTML, CSS, JS, MD, JSON, YAML)
- **Configure proper file associations** for project-specific file types

### 2. Prettier Configuration Unification
- **Resolve parent/local config conflicts** between `.prettierrc` files and package.json settings
- **Establish single source of truth** for Prettier configuration
- **Standardize formatting rules** across HTML, CSS, JavaScript, and JSON files
- **Configure proper file ignoring** through `.prettierignore`
- **Ensure VSCode Prettier extension** uses project configuration correctly

### 3. Markdown Linting Standardization
- **Choose single approach** between markdownlint vs markdownlint-cli2 (eliminate dual setup)
- **Configure comprehensive ruleset** that catches real issues without false positives
- **Create project-specific overrides** for legitimate formatting exceptions (like HTML in MD)
- **Integrate with VSCode** for real-time linting feedback
- **Ensure CI compatibility** with chosen linting approach

### 4. Git Hook System Cleanup
- **Consolidate Husky vs pre-commit approaches** into single, reliable system
- **Configure pre-commit formatting checks** that match CI pipeline exactly
- **Set up commit-msg hooks** for commit message standards if needed
- **Ensure hook performance** doesn't slow down development workflow
- **Provide easy hook bypass** for emergency commits when needed

### 5. CI/CD Pipeline Optimization
- **Ensure formatting checks work reliably** in GitHub Actions environment
- **Match local development environment** formatting behavior exactly
- **Provide clear error messages** when formatting issues are detected
- **Optimize pipeline performance** by caching dependencies and running checks efficiently
- **Add formatting auto-fix suggestions** in PR comments when possible

## Out of Scope

### Explicitly NOT included in this specification:
- **Changing existing code style preferences** (keep current indentation, quote styles, etc.)
- **Migrating to different formatting tools** (keep Prettier, Markdownlint - just unify configuration)
- **Reformatting existing codebase** (focus on tooling, not mass code changes)
- **Adding new linting rules** beyond formatting (no ESLint, StyleLint additions)
- **Changing build tools or CI/CD platforms** (work within current GitHub Actions setup)

## Expected Deliverable

### Browser-Testable Outcomes:
1. **Auto-formatting works on file save in VSCode**
   - Open any HTML/CSS/JS/MD file, make formatting changes, save → file formats automatically
   - No VSCode errors or warnings related to formatter conflicts
   - Consistent behavior across all supported file types

2. **PR builds pass formatting checks consistently**
   - Submit PR with properly formatted code → CI passes formatting checks
   - Submit PR with intentionally poor formatting → CI fails with clear error messages
   - Pre-commit hooks catch issues locally before push

3. **No markdown linting errors on valid markdown files**
   - Existing documentation files (README.md, CHANGELOG.md, etc.) pass linting
   - New markdown files with standard formatting pass validation
   - HTML-in-markdown scenarios (like in documentation) are handled correctly

### Configuration Deliverables:
1. **Unified .vscode/settings.json** with corrected syntax and comprehensive formatting settings
2. **Single Prettier configuration** (either .prettierrc or package.json, not both)
3. **Consolidated markdown linting setup** with single tool and clear ruleset
4. **Streamlined git hooks** using either Husky OR pre-commit, not mixed approaches
5. **Optimized GitHub Actions workflow** with reliable formatting validation

### Documentation Outcomes:
1. **Clear setup instructions** for new developers joining the project
2. **Troubleshooting guide** for common formatting issues
3. **Configuration rationale** explaining tool choices and rule decisions

## Spec Documentation

- Tasks: @.agent-os/specs/2025-08-29-formatting-cleanup/tasks.md
- Technical Specification: @.agent-os/specs/2025-08-29-formatting-cleanup/sub-specs/technical-spec.md
- Configuration Details: @.agent-os/specs/2025-08-29-formatting-cleanup/sub-specs/config-consolidation.md
- Testing Specification: @.agent-os/specs/2025-08-29-formatting-cleanup/sub-specs/tests.md