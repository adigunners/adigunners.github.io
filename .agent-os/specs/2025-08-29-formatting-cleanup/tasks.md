# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/specs/2025-08-29-formatting-cleanup/spec.md

> Created: 2025-08-29
> Status: Ready for Implementation

## Tasks

### 1. Fix Critical VSCode Configuration Issues

1.1. **Write Configuration Validation Tests**
   - Create test script to validate VSCode settings.json syntax
   - Write tests to verify language-specific formatter configurations
   - Create test cases for auto-format-on-save functionality across file types

1.2. **Fix JSON Syntax Errors**
   - Fix nested [markdown] syntax error in .vscode/settings.json (line causing parse failure)
   - Validate JSON structure using proper linting tools
   - Ensure all property names and values follow JSON specification

1.3. **Restructure Language-Specific Configurations**
   - Reorganize [language] overrides to follow VSCode best practices
   - Separate markdown, JavaScript, TypeScript, CSS, and HTML configurations
   - Ensure formatter precedence is clearly defined

1.4. **Test Auto-Formatting Integration**
   - Test "editor.formatOnSave" functionality across all supported file types
   - Verify "editor.defaultFormatter" settings work correctly
   - Test format-on-paste and format-on-type behaviors

1.5. **Verify All Configuration Tests Pass**
   - Run configuration validation test suite
   - Ensure VSCode loads settings without errors
   - Confirm auto-formatting works consistently

### 2. Resolve Prettier Configuration Conflicts

2.1. **Write Prettier Consistency Tests**
   - Create test suite to validate Prettier formatting across project
   - Write tests to detect configuration conflicts between parent/local configs
   - Create test cases for all supported file types (JS, TS, CSS, HTML, MD, JSON)

2.2. **Analyze Configuration Hierarchy**
   - Map all existing Prettier configuration files (.prettierrc, package.json, etc.)
   - Identify conflicts between parent directory and project-specific configs
   - Document current configuration precedence and conflicts

2.3. **Implement Unified Configuration Strategy**
   - Choose single source of truth for Prettier configuration
   - Remove redundant or conflicting configuration files
   - Ensure consistent formatting rules across entire project

2.4. **Update Ignore Files**
   - Create comprehensive .prettierignore file
   - Include appropriate exclusions (node_modules, dist, build, etc.)
   - Ensure ignore patterns don't conflict with formatting requirements

2.5. **Test Formatting Consistency**
   - Run Prettier on all supported file types
   - Verify consistent output regardless of execution context
   - Test npm run format and npm run format:check commands

2.6. **Verify All Prettier Tests Pass**
   - Run complete Prettier test suite
   - Ensure no formatting conflicts remain
   - Confirm consistent behavior across development environments

### 3. Standardize Markdown Linting Approach

3.1. **Write Markdown Linting Tests**
   - Create test suite for markdown linting validation
   - Write tests to compare markdownlint vs markdownlint-cli2 performance
   - Create test cases for custom markdown rules and exceptions

3.2. **Evaluate Linting Tool Options**
   - Compare markdownlint and markdownlint-cli2 features and performance
   - Assess integration with existing VSCode and CI workflows
   - Document pros/cons of each approach for project needs

3.3. **Choose and Implement Single Solution**
   - Select optimal markdown linting tool based on evaluation
   - Remove redundant markdown linting configurations
   - Install and configure chosen solution

3.4. **Create Unified Configuration**
   - Create single .markdownlint.json or .markdownlintrc configuration
   - Remove duplicate or conflicting markdown configuration files
   - Create comprehensive .markdownlintignore file

3.5. **Test Markdown Linting Integration**
   - Test markdown linting on sample files across project
   - Verify VSCode integration works correctly
   - Test command-line linting functionality

3.6. **Verify All Markdown Linting Tests Pass**
   - Run complete markdown linting test suite
   - Ensure consistent linting behavior
   - Confirm integration with development workflow

### 4. Consolidate Git Hook Systems

4.1. **Write Git Hook Performance Tests**
   - Create test suite to measure git hook execution time
   - Write tests to validate pre-commit formatting enforcement
   - Create test cases for hook failure scenarios and recovery

4.2. **Evaluate Hook System Options**
   - Compare Husky vs pre-commit framework performance and features
   - Assess integration complexity with existing npm scripts
   - Document resource usage and execution time for each approach

4.3. **Choose Optimal Hook System**
   - Select single git hook solution based on performance evaluation
   - Remove redundant hook configurations (duplicate .husky/, .pre-commit-config.yaml)
   - Clean up conflicting package.json scripts

4.4. **Optimize lint-staged Configuration**
   - Configure lint-staged for faster commit-time processing
   - Optimize file patterns to process only necessary files
   - Ensure lint-staged integrates properly with chosen hook system

4.5. **Test Pre-Commit Workflow**
   - Test pre-commit formatting enforcement on various file types
   - Verify hook execution doesn't slow down commit process excessively
   - Test hook behavior with large changesets

4.6. **Verify All Git Hook Tests Pass**
   - Run complete git hook test suite
   - Ensure hooks execute reliably and efficiently
   - Confirm commit workflow operates smoothly

### 5. Optimize CI/CD Pipeline Integration

5.1. **Write CI Formatting Tests**
   - Create test suite for CI formatting validation
   - Write tests to verify GitHub Actions workflow reliability
   - Create test cases for PR formatting check scenarios

5.2. **Update GitHub Actions Workflow**
   - Modify .github/workflows/ files to use consolidated formatting setup
   - Ensure format:check command executes reliably in CI environment
   - Optimize workflow for faster execution and clearer error reporting

5.3. **Test CI Integration End-to-End**
   - Test PR formatting validation workflow
   - Verify failed formatting checks block PR merges appropriately
   - Test CI behavior with various formatting violation scenarios

5.4. **Document Unified Workflow**
   - Create clear documentation for the consolidated formatting approach
   - Document developer setup requirements and common workflows
   - Provide troubleshooting guide for formatting-related issues

5.5. **Optimize Performance and Reliability**
   - Fine-tune CI workflow execution time
   - Ensure formatting checks provide clear, actionable error messages
   - Test workflow stability across different PR scenarios

5.6. **Verify All CI/CD Tests Pass**
   - Run complete CI/CD integration test suite
   - Ensure reliable formatting validation in production workflow
   - Confirm documentation accuracy and completeness