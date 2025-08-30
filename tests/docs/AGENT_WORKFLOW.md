# 🤖 Agent Testing Workflow Guidelines

> **Essential testing guidelines for Claude Code and Codex agents**

## Testing File Organization

### 🎯 **Always Use This Structure**

When creating test files during development sessions, follow this exact pattern:

```
tests/
├── unit/[category]/[name].test.js          # Unit tests
├── integration/[category]/[name].md        # Integration docs
├── manual/test-[feature].html              # Manual testing tools
├── fixtures/[category]/[descriptive-name] # Test data
└── docs/[TOPIC].md                         # Testing documentation
```

### 🚫 **Never Create**

- ❌ `tools/testing/` directory (use `tests/manual/` instead)
- ❌ Scattered test files in project root
- ❌ Multiple testing directories (`test/`, `testing/`, etc.)
- ❌ Test files without proper categorization

## Category Guidelines

### **unit/** - Isolated Component Tests

```bash
# ✅ Good examples
tests/unit/formatting/prettier-config.test.js
tests/unit/functions/countdown-timer.test.js
tests/unit/components/winner-card.test.js

# ❌ Avoid
tests/test-prettier.js  # Missing category
tests/unit/test.js      # Not descriptive
```

### **integration/** - Cross-System Tests

```bash
# ✅ Good examples
tests/integration/deployment/DEPLOYMENT_READINESS.md
tests/integration/performance/PERFORMANCE_ASSESSMENT.md
tests/integration/ci-cd/workflow-validation.md

# ❌ Avoid
tests/deployment.md    # Missing category
tests/perf-test.md     # Not descriptive
```

### **manual/** - Human-Executed Tests

```bash
# ✅ Good examples
tests/manual/test-countdown-stability.html
tests/manual/test-winner-validation.html
tests/manual/test-responsive-design.html

# ❌ Avoid
tests/test.html        # Not descriptive
tests/manual/debug.html # Too generic
```

### **fixtures/** - Test Data & Samples

```bash
# ✅ Good examples
tests/fixtures/formatting/unformatted-samples/
tests/fixtures/data/mock-fpl-responses/
tests/fixtures/ui/screenshot-baselines/

# ❌ Avoid
tests/test-data/       # Wrong location
tests/fixtures/stuff/  # Not descriptive
```

## Agent-Specific Instructions

### For **Claude Code** Sessions

When working on:

- **Formatting/Linting** → `tests/unit/formatting/`
- **JavaScript Functions** → `tests/unit/functions/`
- **UI Components** → `tests/unit/components/`
- **Build/Deploy** → `tests/integration/deployment/`
- **Performance** → `tests/integration/performance/`

### For **Codex** Sessions

When generating:

- **Test Fixtures** → `tests/fixtures/[relevant-category]/`
- **Mock Data** → `tests/fixtures/data/`
- **Sample Code** → `tests/fixtures/code-samples/`

## File Naming Conventions

### Unit Tests (.test.js files)

```bash
# Pattern: [feature-or-component].test.js
prettier-config.test.js     # ✅ Clear, descriptive
countdown-timer.test.js     # ✅ Feature-focused
auth-validation.test.js     # ✅ Component-specific

# Avoid
test.js                     # ❌ Too generic
config.test.js             # ❌ Not specific enough
```

### Manual Tests (.html files)

```bash
# Pattern: test-[specific-feature].html
test-countdown-stability.html  # ✅ Feature-specific
test-responsive-layout.html    # ✅ Clear purpose
test-form-validation.html      # ✅ Component-focused

# Avoid
test.html                      # ❌ Too generic
debug.html                     # ❌ Not descriptive
```

### Documentation (.md files)

```bash
# Pattern: [TOPIC_IN_CAPS].md
DEPLOYMENT_READINESS.md        # ✅ Clear topic
BROWSER_COMPATIBILITY.md       # ✅ Specific area
API_INTEGRATION_TESTING.md     # ✅ Focused scope

# Avoid
readme.md                      # ❌ Too generic
docs.md                        # ❌ Not specific
```

## Integration with Build Tools

### Prettier Exclusions

Always exclude test fixtures from formatting:

```json
// .prettierignore
tests/fixtures/formatting/
tests/fixtures/code-samples/
```

### Markdown Linting

Always exclude fixtures from linting:

```json
// .markdownlint-cli2.jsonc
"globs": [
  "**/*.{md,mdx}",
  "!tests/fixtures/**"
]
```

## Quality Checks

### ✅ Before Completing a Session

1. **File Organization**: All test files in proper subdirectories
2. **Naming Convention**: Descriptive names following patterns
3. **Documentation**: README.md updated if new categories added
4. **Build Integration**: Ignore files updated for new fixtures

### ✅ Required Documentation

When creating new test categories:

1. Update `tests/README.md` with new structure
2. Add category to this file (`AGENT_WORKFLOW.md`)
3. Update ignore patterns in configuration files
4. Document purpose and usage in category README

## Common Patterns

### Creating Unit Tests

```javascript
// tests/unit/[category]/[feature].test.js
describe('[Feature] Validation', () => {
  test('should validate [specific behavior]', () => {
    // Test implementation
  });
});
```

### Creating Manual Tests

```html
<!-- tests/manual/test-[feature].html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Manual Test: [Feature]</title>
  </head>
  <body>
    <h1>[Feature] Testing</h1>
    <!-- Test interface -->
  </body>
</html>
```

### Creating Test Fixtures

```
tests/fixtures/[category]/[descriptive-name]/
├── README.md           # Purpose and usage
├── sample-input.json   # Test input data
├── expected-output.json # Expected results
└── edge-cases/         # Edge case scenarios
```

## Benefits of This Structure

### 🎯 **For Agents**

- Clear, unambiguous file placement rules
- Consistent patterns across all sessions
- No duplicate testing directories
- Easy integration with build tools

### 🎯 **For Development Team**

- Predictable test locations
- Easy test discovery and execution
- Consistent documentation patterns
- Reduced maintenance overhead

### 🎯 **For Project**

- Organized test suite
- Clear separation of concerns
- Better CI/CD integration
- Improved long-term maintainability

---

## 📋 Quick Reference

**Creating a new unit test?** → `tests/unit/[category]/[name].test.js`  
**Creating test data?** → `tests/fixtures/[category]/[descriptive-name]`  
**Creating manual test?** → `tests/manual/test-[feature].html`  
**Creating documentation?** → `tests/docs/[TOPIC].md`

_Follow these patterns consistently to maintain organized, discoverable, and maintainable test
suites._
