# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-08-29-formatting-cleanup/spec.md

> Created: 2025-08-29
> Version: 1.0.0

## Technical Requirements

### VSCode Configuration Fixes

- **Fix syntax error in .vscode/settings.json**: Remove nested `[markdown]` configuration causing JSON parsing failure
- **Standardize language-specific formatters**: Configure proper formatter hierarchy for markdown, JSON, JavaScript, CSS, and HTML files
- **Enable reliable formatOnSave**: Ensure consistent auto-formatting behavior across all supported file types
- **Configure proper editor defaults**: Set consistent indentation, line endings, and whitespace handling

### Prettier Configuration Resolution

- **Resolve config hierarchy conflicts**: Address conflicts between parent directory .prettierrc and local configuration
- **Implement config resolution strategy**: Choose between inheriting parent config vs maintaining local overrides
- **Standardize formatting rules**: Ensure consistent code formatting across JavaScript, CSS, JSON, and Markdown files
- **Create unified .prettierignore**: Consolidate ignore patterns to prevent formatting conflicts with generated files

### Markdown Linting Consolidation

- **Choose primary linting tool**: Select between markdownlint vs markdownlint-cli2 based on:
  - Performance characteristics
  - Configuration flexibility
  - CI/CD integration capabilities
  - VSCode extension compatibility
- **Standardize rule configuration**: Create consistent .markdownlint.json with project-appropriate rules
- **Implement ignore patterns**: Create .markdownlintignore for generated/external content
- **Remove redundant tooling**: Eliminate duplicate or conflicting markdown linters

### Git Hook System Optimization

- **Consolidate hook systems**: Choose between Husky vs pre-commit based on:
  - Node.js ecosystem integration
  - Performance impact on commit operations
  - Cross-platform compatibility
  - Maintenance overhead
- **Optimize hook performance**: Implement staged-file-only processing to reduce commit time
- **Configure hook reliability**: Ensure hooks run consistently across different development environments
- **Remove redundant configurations**: Eliminate duplicate or conflicting hook setups

### CI/CD Workflow Enhancement

- **Implement formatting checks**: Add automated formatting validation to GitHub Actions workflow
- **Configure fail-fast behavior**: Ensure CI fails on formatting violations before running tests
- **Optimize workflow performance**: Use caching strategies for node_modules and formatting tool dependencies
- **Add format-check scripts**: Create npm scripts for local formatting validation

## Implementation Details

### VSCode Language-Specific Configuration

```json
{
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.markdownlint": true
    }
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Prettier Config Resolution Strategy

**Option 1: Local Override Approach**
- Maintain local .prettierrc with project-specific rules
- Use .prettierignore to exclude parent directory influences
- Benefits: Full control over formatting rules
- Drawbacks: Potential inconsistency with parent project

**Option 2: Parent Inheritance Approach**
- Remove local .prettierrc to inherit parent configuration
- Add project-specific overrides only when necessary
- Benefits: Consistency with parent project formatting
- Drawbacks: Less flexibility for project-specific needs

**Recommended**: Option 1 with selective inheritance of critical parent rules

### Markdown Linting Tool Selection Criteria

**markdownlint-cli2 Advantages**:
- Better performance on large file sets
- More flexible configuration options
- Better glob pattern support
- Improved ignore file handling

**markdownlint Advantages**:
- Simpler configuration
- Widespread adoption
- Better VSCode integration
- Established ecosystem

**Recommended**: markdownlint-cli2 for performance and flexibility

### Git Hook Performance Optimization

```javascript
// Husky pre-commit hook optimization
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Only run on staged files for performance
npx lint-staged
```

```json
// lint-staged configuration
{
  "*.{js,jsx,ts,tsx,json,css,md}": [
    "prettier --write",
    "git add"
  ],
  "*.md": [
    "markdownlint-cli2 --fix",
    "git add"
  ]
}
```

### CI/CD Integration Patterns

```yaml
# GitHub Actions workflow integration
- name: Check code formatting
  run: |
    npm run format:check
    npm run lint:markdown

- name: Validate formatting
  run: |
    if [ "$(git diff --name-only)" ]; then
      echo "Code formatting issues found"
      exit 1
    fi
```

## External Dependencies

**No new external dependencies required** - leveraging existing tools:

- **Prettier**: Already installed for code formatting
- **Markdownlint**: Available options already in ecosystem  
- **Husky**: Currently configured for git hooks
- **lint-staged**: For performance optimization of git hooks

## Configuration Files to Standardize

### Files to Update
- `.vscode/settings.json` - Fix syntax errors and language-specific settings
- `.prettierrc` - Resolve hierarchy conflicts
- `.markdownlint.json` - Consolidate markdown linting rules
- `package.json` - Update scripts and husky configuration

### Files to Create
- `.prettierignore` - Unified ignore patterns
- `.markdownlintignore` - Markdown-specific ignore patterns

### Files to Remove
- Redundant configuration files from previous setups
- Conflicting linting configurations
- Unused git hook configurations

## Performance Targets

- **Commit hook execution**: < 3 seconds for typical changesets
- **CI formatting check**: < 30 seconds
- **VSCode format-on-save**: < 500ms response time
- **Full project format check**: < 10 seconds

## Rollback Strategy

- Maintain backup of current configuration files
- Implement changes incrementally with validation at each step
- Test formatting behavior across different file types before finalizing
- Ensure git hooks can be temporarily disabled if issues arise