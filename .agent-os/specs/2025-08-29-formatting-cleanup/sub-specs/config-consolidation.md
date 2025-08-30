# Configuration Consolidation Specification

This is the configuration consolidation details for the spec detailed in @.agent-os/specs/2025-08-29-formatting-cleanup/spec.md

> Created: 2025-08-29
> Version: 1.0.0

## Configuration File Audit

### Current Configuration Files (To Be Consolidated)

#### VSCode Configuration
- **File**: `.vscode/settings.json`
- **Status**: Contains syntax errors, needs consolidation
- **Issues**: Formatter conflicts, incomplete language-specific settings
- **Priority**: High - Affects all developers immediately

#### Prettier Configuration
- **Files**: `.prettierrc`, `package.json` (prettier section), possibly others
- **Status**: Multiple conflicting sources of truth
- **Issues**: VSCode extension confusion, inconsistent formatting results
- **Priority**: High - Core formatting tool

#### Markdown Linting
- **Files**: `.markdownlint.json`, `.markdownlintrc`, possible CLI configs
- **Status**: Dual setup with conflicting tools (markdownlint vs markdownlint-cli2)
- **Issues**: False positives, HTML-in-markdown handling
- **Priority**: Medium - Documentation quality

#### Git Hooks
- **Files**: `.husky/`, `.pre-commit-config.yaml`, `package.json` scripts
- **Status**: Mixed Husky and pre-commit approaches
- **Issues**: Hook conflicts, performance, reliability
- **Priority**: High - Prevents CI failures

#### CI/CD Configuration
- **Files**: `.github/workflows/*.yml`
- **Status**: Formatting checks may not match local environment
- **Issues**: Local vs CI inconsistency, unclear error messages
- **Priority**: Medium - Affects PR workflow

## Unified Configuration Strategy

### 1. VSCode Settings Consolidation

**Target File**: `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": null,
  
  // Language-specific formatters
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.markdownlint": true
    }
  },
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // File associations
  "files.associations": {
    "*.md": "markdown",
    "*.yml": "yaml",
    "*.yaml": "yaml"
  },
  
  // Prettier integration
  "prettier.requireConfig": true,
  "prettier.useEditorConfig": false,
  
  // Markdown linting
  "markdownlint.config": {
    "extends": ".markdownlint.json"
  }
}
```

**Changes Required**:
- Fix syntax errors in current file
- Add comprehensive language-specific formatting
- Resolve formatter conflicts
- Enable format-on-save consistently
- Configure proper file associations

### 2. Prettier Configuration Unification

**Strategy**: Single `.prettierrc.json` file (remove package.json prettier config)

**Target File**: `.prettierrc.json`

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "css",
  "overrides": [
    {
      "files": "*.md",
      "options": {
        "printWidth": 80,
        "proseWrap": "always"
      }
    }
  ]
}
```

**Target File**: `.prettierignore`

```
# Build outputs
dist/
build/
.next/
out/

# Dependencies
node_modules/
.pnp/
.pnp.js

# Environment files
.env*

# OS generated files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/

# Temporary files
*.tmp
*.temp
```

**Changes Required**:
- Remove prettier config from package.json
- Create single .prettierrc.json with project standards
- Update .prettierignore to exclude proper files
- Test VSCode integration

### 3. Markdown Linting Standardization

**Strategy**: Single markdownlint-cli2 approach (remove conflicting setups)

**Target File**: `.markdownlint.json`

```json
{
  "extends": "markdownlint/style/prettier",
  "line-length": {
    "line_length": 100,
    "code_blocks": false,
    "tables": false,
    "headings": false
  },
  "no-inline-html": {
    "allowed_elements": [
      "br",
      "sub",
      "sup",
      "kbd",
      "img",
      "details",
      "summary",
      "div",
      "span",
      "a"
    ]
  },
  "no-duplicate-heading": {
    "siblings_only": true
  },
  "proper-names": {
    "names": [
      "GitHub",
      "JavaScript",
      "TypeScript",
      "VSCode",
      "HTML",
      "CSS",
      "JSON",
      "YAML",
      "API",
      "URL",
      "FPL",
      "IIM"
    ],
    "code_blocks": false
  }
}
```

**Changes Required**:
- Choose markdownlint-cli2 as single tool
- Remove conflicting configurations
- Configure rules for project needs
- Handle HTML-in-markdown scenarios
- Test against existing documentation

### 4. Git Hook Consolidation

**Strategy**: Husky-only approach (remove pre-commit)

**Target File**: `package.json` scripts section

```json
{
  "scripts": {
    "prepare": "husky install",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint:md": "markdownlint-cli2 \"**/*.md\"",
    "lint:md:fix": "markdownlint-cli2 --fix \"**/*.md\""
  }
}
```

**Target File**: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Format check
npm run format:check

# Markdown lint
npm run lint:md

# If checks pass, stage any auto-fixes
git add .
```

**Changes Required**:
- Remove .pre-commit-config.yaml
- Consolidate to Husky hooks only
- Configure pre-commit formatting checks
- Match CI pipeline exactly
- Optimize for performance

### 5. CI/CD Pipeline Optimization

**Target File**: `.github/workflows/format-check.yml`

```yaml
name: Format Check

on:
  pull_request:
    branches: [ main, dev ]
  push:
    branches: [ main ]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Check Prettier formatting
        run: npm run format:check
      
      - name: Check Markdown linting
        run: npm run lint:md
      
      - name: Comment PR with format issues
        if: failure() && github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ **Format Check Failed**\n\nPlease run `npm run format` to fix formatting issues and `npm run lint:md:fix` to fix markdown issues.'
            })
```

**Changes Required**:
- Separate formatting job for clear failures
- Add dependency caching
- Match local environment exactly
- Provide helpful error messages
- Add PR comment automation

## Implementation Priority

### Phase 1: Critical Fixes (Week 1)
1. **Fix VSCode settings syntax errors** - Immediate developer impact
2. **Consolidate Prettier configuration** - Core formatting reliability
3. **Resolve git hook conflicts** - Prevent CI failures

### Phase 2: Standardization (Week 2)  
1. **Unified markdown linting** - Documentation quality
2. **CI/CD optimization** - Pipeline reliability
3. **Cross-platform testing** - Team consistency

### Phase 3: Enhancement (Week 3)
1. **Performance optimization** - Developer experience
2. **Error message improvement** - Troubleshooting ease
3. **Documentation updates** - Knowledge transfer

## Risk Mitigation

### Configuration Backup Strategy
- **Backup all existing config files** before changes
- **Test in isolated branch** before main integration
- **Gradual rollout** to team members
- **Quick rollback plan** if issues arise

### Compatibility Considerations
- **Cross-platform testing** (macOS, Linux, Windows)
- **Multiple VSCode versions** and extension versions
- **Node.js version compatibility** for formatting tools
- **Git version compatibility** for hook integration

### Performance Monitoring
- **Measure formatting operation times** before/after
- **Monitor CI pipeline duration** impact
- **Track developer feedback** on workflow changes
- **Optimize based on real usage** patterns