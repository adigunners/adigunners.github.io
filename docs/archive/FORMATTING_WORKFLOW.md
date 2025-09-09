# 🎨 Unified Formatting Workflow

> **Comprehensive guide to the standardized formatting and linting system**

## Overview

This project uses a unified formatting workflow that ensures consistent code style across all file
types. The system combines **Prettier** for formatting, **markdownlint-cli2** for markdown
validation, and **Husky** for git hook automation.

## 🛠️ Core Components

### 1. **Prettier Configuration**

- **File**: `.prettierrc`
- **Coverage**: HTML, CSS, JavaScript, JSON, Markdown, YAML
- **Features**:
  - Unified base configuration (printWidth: 100, tabWidth: 2, etc.)
  - File-specific overrides for YAML/JSON (double quotes)
  - Markdown prose wrapping and embedded code formatting
  - JSON schema validation

### 2. **Markdown Linting**

- **Tool**: `markdownlint-cli2` (modern CLI)
- **Configuration**: `.markdownlint-cli2.jsonc`
- **Features**:
  - JSONC format with comments support
  - Comprehensive glob patterns with smart exclusions
  - Flexible rules (disabled overly strict rules like MD013, MD033, MD040)

### 3. **Git Hooks**

- **System**: Husky + lint-staged
- **Hook**: `.husky/pre-commit`
- **Features**:
  - Automatic formatting on commit
  - Separate patterns for different file types
  - Markdown gets both formatting and linting

### 4. **CI/CD Integration**

- **Workflow**: `.github/workflows/ci.yml`
- **Triggers**: All pull requests to main branch
- **Validation**: Both Prettier format check and markdown linting

## 📋 Available Commands

### Development Commands

```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check

# Run markdown linting
npm run lint:md

# Setup git hooks
npm run prepare
```

### Manual Validation

```bash
# Test specific file types
npx prettier "**/*.js" --check
npx prettier "**/*.md" --check
npx markdownlint-cli2 "**/*.md"
```

## 🔄 Workflow Process

### 1. **Local Development**

#### Auto-formatting on Save

- **VSCode**: Configured in `.vscode/settings.json`
- **Triggers**: Format-on-save for all supported file types
- **Formatter**: Uses `esbenp.prettier-vscode` extension

#### Manual Formatting

```bash
# Format entire project
npm run format

# Format specific files
npx prettier path/to/file.js --write
```

### 2. **Commit Process**

#### Pre-commit Hook (Automatic)

```bash
# Triggered automatically on: git commit
.husky/pre-commit → npx lint-staged
```

#### Lint-staged Configuration

```json
{
  "*.{html,css,js,json}": ["prettier --write"],
  "*.{md,mdx}": ["prettier --write", "markdownlint-cli2"]
}
```

#### What Happens:

1. **Stage Detection**: Only processes staged files
2. **Format Code Files**: HTML, CSS, JS, JSON get Prettier formatting
3. **Format + Lint Markdown**: MD files get Prettier + markdownlint-cli2
4. **Auto-stage Changes**: Formatted files are automatically re-staged
5. **Commit Proceeds**: Only if all checks pass

### 3. **Pull Request Validation**

#### CI Workflow Steps

1. **Environment Setup**
   - Ubuntu latest runner
   - Node.js 20 with npm cache
   - `HUSKY=0` to prevent hook conflicts

2. **Dependency Installation**
   - Prefers `npm ci` for lockfile consistency
   - Fallback to `npm install` if needed

3. **Format Validation**

   ```bash
   npm run format:check
   # Fails if any files need formatting
   ```

4. **Markdown Linting**

   ```bash
   npm run lint:md
   # Validates all markdown files
   ```

5. **Success/Failure**
   - ✅ **Pass**: All files properly formatted and linted
   - ❌ **Fail**: PR blocked until issues resolved

## 🎯 File Type Coverage

### Supported File Types

| File Type      | Tool                         | Configuration             | Features                                     |
| -------------- | ---------------------------- | ------------------------- | -------------------------------------------- |
| **JavaScript** | Prettier                     | `.prettierrc`             | Standard formatting rules                    |
| **HTML**       | Prettier                     | `.prettierrc`             | Consistent indentation, attribute formatting |
| **CSS**        | Prettier                     | `.prettierrc`             | Property ordering, spacing                   |
| **JSON**       | Prettier                     | `.prettierrc` + overrides | Double quotes, proper spacing                |
| **YAML**       | Prettier                     | `.prettierrc` + overrides | Double quotes for consistency                |
| **Markdown**   | Prettier + markdownlint-cli2 | Both configs              | Formatting + content validation              |

### Excluded Patterns

```
node_modules/           # Dependencies
data/*.json            # Generated data files
tests/format-test-files/  # Test fixtures
.agent-os/             # Agent OS specifications
.claude/               # Claude agent files
dist/, build/          # Build outputs
coverage/              # Test coverage
docs/lighthouse-*.report.*  # Generated Lighthouse reports (local audits)
```

## ⚡ Performance Optimizations

### Git Hooks

- **Selective Processing**: Only formats changed files
- **Parallel Operations**: Prettier and markdownlint run efficiently
- **Smart Caching**: Git stash integration for reliable operation

### CI/CD Pipeline

- **Dependency Caching**: npm cache for faster installs
- **Early Termination**: Fails fast on first formatting issue
- **Husky Disabled**: Prevents hook conflicts in CI environment

### Configuration

- **Optimized Globs**: Efficient file matching patterns
- **Rule Tuning**: Disabled overly strict rules for better performance
- **Smart Ignoring**: Excludes generated and test files

## 🚨 Troubleshooting

### Common Issues

#### "Pre-commit hook failed"

```bash
# Fix formatting issues
npm run format

# Check what's wrong
npm run format:check
npm run lint:md
```

#### "CI formatting check failed"

```bash
# Locally run the same checks as CI
HUSKY=0 npm run format:check
HUSKY=0 npm run lint:md

# Fix issues
npm run format
```

#### "VSCode not auto-formatting"

1. Check `.vscode/settings.json` is properly configured
2. Ensure Prettier extension is installed and enabled
3. Verify `prettier.requireConfig: true` finds `.prettierrc`

### Manual Override (Emergency)

```bash
# Skip pre-commit hooks (not recommended)
git commit --no-verify

# Format everything and commit
npm run format
git add .
git commit -m "Apply formatting fixes"
```

## 🧪 Testing File Organization

### Standardized Directory Structure

All testing files are organized under a single `tests/` directory:

```
tests/
├── README.md                    # Testing organization guide
├── unit/                        # Unit tests (.test.js files)
│   ├── formatting/              # Formatting system tests
│   ├── functions/               # JavaScript function tests
│   └── components/              # Component-specific tests
├── integration/                 # Integration and E2E tests
│   ├── deployment/              # Deployment-related tests
│   └── performance/             # Performance assessment
├── manual/                      # Manual testing files and tools
│   ├── test-*.html              # Interactive testing tools
│   └── testing-README.md        # Manual testing documentation
├── fixtures/                    # Test data and sample files
│   ├── formatting/              # Formatting test samples
│   └── data/                    # Test data files
└── docs/                        # Testing documentation
    ├── TESTING_GUIDELINES.md    # Testing best practices
    └── AGENT_WORKFLOW.md        # Guidelines for .claude/.codex agents
```

### Agent Workflow Integration

For Claude Code and Codex agents, always use this standardized structure:

- **Unit Tests** → `tests/unit/[category]/[name].test.js`
- **Test Fixtures** → `tests/fixtures/[category]/[descriptive-name]`
- **Manual Tests** → `tests/manual/test-[feature].html`
- **Documentation** → `tests/docs/[TOPIC].md`

See `tests/docs/AGENT_WORKFLOW.md` for complete agent guidelines.

### Benefits of Unified Testing Structure

- ✅ **Single Source**: All testing files in one organized location
- ✅ **Agent Consistency**: Claude and Codex agents follow same patterns
- ✅ **Clear Categories**: Easy to find and organize test types
- ✅ **Build Integration**: Proper exclusions in formatting configurations

## 🔧 Configuration Files Reference

### Primary Configuration

- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to exclude from formatting
- `.markdownlint-cli2.jsonc` - Markdown linting configuration
- `.vscode/settings.json` - VSCode integration
- `package.json` - Scripts and dependencies

### Git Integration

- `.husky/pre-commit` - Git pre-commit hook
- `.github/workflows/ci.yml` - CI/CD pipeline

### Dependencies

```json
{
  "prettier": "^3.6.2",
  "markdownlint-cli2": "^0.14.0",
  "husky": "^9",
  "lint-staged": "^15"
}
```

## 📈 System Benefits

### Developer Experience

- ✅ **Automatic Formatting**: No manual styling needed
- ✅ **Consistent Code**: Same style across all contributors
- ✅ **Fast Feedback**: Immediate validation on save and commit
- ✅ **IDE Integration**: Works seamlessly with VSCode

### Code Quality

- ✅ **Style Consistency**: Unified formatting across file types
- ✅ **Documentation Quality**: Markdown linting ensures readable docs
- ✅ **Automated Validation**: CI prevents style issues in PRs
- ✅ **Zero Configuration**: Works out of the box for developers

### Maintenance Benefits

- ✅ **Single Source of Truth**: Unified configuration system
- ✅ **Performance Optimized**: Fast git hooks and CI checks
- ✅ **Future Proof**: Modern tools (markdownlint-cli2, Prettier 3.x)
- ✅ **Minimal Complexity**: One hook system, clear documentation

---

## 🎉 Success Metrics

After implementing this unified formatting workflow:

- **0 configuration conflicts** between different tools
- **100% file type coverage** for all code and documentation
- **Consistent PR validation** with clear error messages
- **Optimized performance** for both local development and CI
- **Comprehensive documentation** for easy onboarding

The system ensures that **all code is consistently formatted** and **all documentation meets quality
standards** without requiring manual intervention from developers.
