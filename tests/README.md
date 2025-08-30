# 🧪 Testing Directory Structure

> **Standardized testing organization for consistent development workflows**

## Directory Structure

```
tests/
├── README.md                          # This file - testing organization guide
├── unit/                              # Unit tests (.test.js files)
│   ├── formatting/                    # Formatting system tests
│   │   ├── prettier-config.test.js    # Prettier configuration tests
│   │   ├── vscode-settings.test.js    # VSCode settings validation
│   │   └── markdown-linting.test.js   # Markdown linting tests
│   ├── functions/                     # JavaScript function tests
│   │   ├── missing-functions.test.js  # Function validation tests
│   │   └── font-loading-fallback.test.js # Font loading tests
│   └── components/                    # Component-specific tests
├── integration/                       # Integration and E2E tests
│   ├── deployment/                    # Deployment-related tests
│   │   ├── DEPLOYMENT_READINESS.md   # Deployment checklist
│   │   └── CROSS_BROWSER_COMPATIBILITY.md # Browser compatibility
│   └── performance/                   # Performance assessment
│       └── PERFORMANCE_ASSESSMENT.md # Performance metrics and analysis
├── manual/                           # Manual testing files and tools
│   ├── index.html                    # Manual test suite index
│   ├── final-validation.html         # Final validation checklist
│   ├── test-countdown-stability.html # Countdown timer testing
│   ├── test-font-loading.html        # Font loading behavior
│   ├── test-js-functions.html        # JavaScript function testing
│   ├── test-winners-page.html        # Winners page validation
│   ├── countdown-stress.html         # Performance stress testing
│   └── testing-README.md             # Manual testing documentation
├── fixtures/                         # Test data and sample files
│   ├── formatting/                   # Formatting test samples
│   │   ├── format-test-files/        # Prettier formatting samples
│   │   │   ├── test.js               # JavaScript sample
│   │   │   ├── test.html             # HTML sample
│   │   │   ├── test.css              # CSS sample
│   │   │   ├── test.json             # JSON sample
│   │   │   └── test.md               # Markdown sample
│   │   ├── format-consistency-test/  # Advanced formatting tests
│   │   │   ├── enhanced-markdown.md  # Markdown with embedded code
│   │   │   ├── test-override.json    # JSON with overrides
│   │   │   └── test.yaml             # YAML formatting test
│   │   └── markdown-lint-test/       # Markdown linting samples
│   │       ├── test-valid.md         # Valid markdown sample
│   │       └── test-violations.md    # Markdown with intentional issues
│   └── data/                         # Test data files
└── docs/                            # Testing documentation
    ├── TESTING_GUIDELINES.md        # Testing best practices
    ├── AGENT_WORKFLOW.md            # Guidelines for .claude/.codex agents
    └── CONTINUOUS_INTEGRATION.md    # CI/CD testing documentation
```

## Organization Principles

### 1. **Clear Separation of Concerns**

- **`unit/`** - Isolated component testing
- **`integration/`** - Cross-system testing
- **`manual/`** - Human-executed tests and tools
- **`fixtures/`** - Test data and sample files
- **`docs/`** - Testing documentation

### 2. **Consistent Naming Conventions**

- **Unit tests**: `*.test.js` files in `unit/` subdirectories
- **Manual tests**: `test-*.html` files in `manual/`
- **Documentation**: `*.md` files in appropriate directories
- **Fixtures**: Descriptive names in `fixtures/` subdirectories

### 3. **Logical Grouping**

- Group related tests in subdirectories (e.g., `formatting/`, `functions/`)
- Keep manual testing tools together
- Separate test data from test code

## Usage Guidelines

### For Developers

```bash
# Run unit tests
npm test

# Manual testing
open tests/manual/index.html

# Check test fixtures
ls tests/fixtures/
```

### For Claude/Codex Agents

When creating test files during development:

1. **Unit Tests** → `tests/unit/[category]/[name].test.js`
2. **Test Fixtures** → `tests/fixtures/[category]/[descriptive-name]`
3. **Manual Tests** → `tests/manual/test-[feature].html`
4. **Documentation** → `tests/docs/[TOPIC].md`

## Integration with Build System

### Prettier Configuration

Test fixtures are excluded from formatting to preserve intentional formatting errors:

```json
// .prettierignore
tests/fixtures/formatting/format-test-files/
tests/fixtures/formatting/format-consistency-test/
tests/fixtures/formatting/markdown-lint-test/
```

### Markdown Linting

Test files are excluded from markdown linting:

```json
// .markdownlint-cli2.jsonc
"globs": [
  "**/*.{md,mdx}",
  "!tests/fixtures/**"
]
```

### Git Hooks

Test organization is enforced via pre-commit hooks to maintain consistency.

## Benefits

### ✅ **Organized Structure**

- Easy to find relevant tests
- Clear separation between test types
- Consistent naming and organization

### ✅ **Agent Consistency**

- Claude and Codex agents follow same patterns
- Reduces scattered test files across project
- Prevents duplicate testing directories

### ✅ **Maintainability**

- Easy to add new test categories
- Clear documentation for each test type
- Integration with existing build tools

### ✅ **Team Efficiency**

- Faster test discovery and execution
- Consistent patterns across sessions
- Reduced cognitive overhead

---

_This structure ensures consistent test organization across all development workflows and agent
interactions._
