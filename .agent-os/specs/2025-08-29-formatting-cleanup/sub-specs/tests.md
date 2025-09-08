# Tests Specification

This is the tests coverage details for the spec detailed in @.agent-os/specs/2025-08-29-formatting-cleanup/spec.md

> Created: 2025-08-29
> Version: 1.0.0

## Test Coverage

### 1. VSCode Integration Testing

#### Test 1.1: Auto-Format on Save
**Objective**: Verify format-on-save works consistently across all supported file types

**Test Cases**:
```
TC1.1.1: HTML file auto-formatting
- Create HTML file with poor formatting (inconsistent indentation, spacing)
- Save file (Cmd+S / Ctrl+S)
- Expected: File automatically formats according to Prettier rules
- Verification: No manual formatting required, consistent indentation/spacing

TC1.1.2: CSS file auto-formatting
- Create CSS file with inconsistent formatting
- Save file
- Expected: Properties aligned, consistent spacing, proper bracket placement
- Verification: Matches Prettier CSS formatting rules

TC1.1.3: JavaScript file auto-formatting  
- Create JS file with mixed quotes, inconsistent semicolons
- Save file
- Expected: Consistent quote style, proper semicolon usage, aligned formatting
- Verification: Follows configured Prettier JavaScript rules

TC1.1.4: Markdown file auto-formatting
- Create markdown file with inconsistent line breaks, spacing
- Save file  
- Expected: Consistent line wrapping, proper list formatting
- Verification: Prettier markdown rules applied

TC1.1.5: JSON file auto-formatting
- Create JSON file with inconsistent indentation
- Save file
- Expected: Consistent 2-space indentation, proper bracket alignment
- Verification: Valid JSON with clean formatting

TC1.1.6: YAML file auto-formatting
- Create YAML file with inconsistent spacing
- Save file
- Expected: Proper YAML indentation and alignment
- Verification: Valid YAML structure maintained
```

**Success Criteria**:
- All test cases pass without manual intervention
- No VSCode error messages or warnings appear
- Formatting is consistent across file types
- Performance is acceptable (<2 seconds for typical files)

#### Test 1.2: Formatter Conflict Resolution
**Objective**: Ensure no conflicts between different formatting extensions

**Test Cases**:
```
TC1.2.1: Single formatter per file type
- Open project in VSCode
- Check that each file type has only one configured formatter
- Expected: No "Format Document With..." disambiguation prompts
- Verification: Format command works immediately without choices

TC1.2.2: Extension compatibility
- Install common VSCode extensions (Prettier, Markdownlint)
- Test formatting with extensions active
- Expected: No conflicts or error messages in VSCode output
- Verification: Formatting works reliably with extensions enabled
```

### 2. Prettier Configuration Testing

#### Test 2.1: Configuration Consistency
**Objective**: Verify single source of truth for Prettier configuration

**Test Cases**:
```  
TC2.1.1: Single config file detection
- Audit project for .prettierrc*, package.json prettier sections
- Expected: Only one Prettier configuration source exists
- Verification: No conflicting configuration files

TC2.1.2: VSCode Prettier integration
- Open project in VSCode with Prettier extension
- Format a file using Prettier
- Expected: Uses project .prettierrc.json configuration
- Verification: Formatting matches configured rules exactly

TC2.1.3: Command line consistency
- Format file using VSCode
- Format same file using `prettier --write filename`
- Expected: Identical formatting results
- Verification: No differences between VSCode and CLI formatting
```

#### Test 2.2: File Type Coverage
**Objective**: Ensure Prettier handles all intended file types correctly

**Test Cases**:
```
TC2.2.1: HTML formatting consistency
- Test with various HTML structures (nested elements, attributes)
- Expected: Consistent indentation, attribute formatting
- Verification: HTML remains valid and properly structured

TC2.2.2: CSS formatting coverage
- Test with CSS, SCSS, media queries, complex selectors
- Expected: Property alignment, consistent spacing
- Verification: CSS remains valid and follows style guide

TC2.2.3: JavaScript formatting scope
- Test with ES6+, React JSX, complex expressions
- Expected: Consistent quote usage, semicolon handling
- Verification: JavaScript remains syntactically correct
```

### 3. Markdown Linting Testing

#### Test 3.1: Linting Rule Validation
**Objective**: Ensure markdown linting catches real issues without false positives

**Test Cases**:
```
TC3.1.1: Valid markdown passes
- Test existing documentation files (README.md, CHANGELOG.md)
- Run markdown linting
- Expected: All valid files pass without errors
- Verification: Zero linting errors on properly formatted markdown

TC3.1.2: HTML-in-markdown handling
- Test markdown files containing HTML elements (like documentation)
- Run markdown linting
- Expected: Legitimate HTML usage is allowed
- Verification: No false positives on valid HTML-in-markdown scenarios

TC3.1.3: Real issue detection
- Create markdown with actual problems (broken links, duplicate headings)
- Run markdown linting
- Expected: Real issues are flagged
- Verification: Linting catches genuine markdown problems
```

#### Test 3.2: VSCode Integration
**Objective**: Verify real-time markdown linting feedback in VSCode

**Test Cases**:
```
TC3.2.1: Real-time linting feedback
- Open markdown file in VSCode
- Introduce linting violations
- Expected: Issues highlighted immediately with red squiggles
- Verification: Problems panel shows markdown linting errors

TC3.2.2: Auto-fix functionality
- Apply auto-fix suggestions for fixable issues
- Expected: Issues resolved automatically where possible
- Verification: Manual fixes only required for non-auto-fixable issues
```

### 4. Git Hook System Testing

#### Test 4.1: Pre-Commit Hook Validation
**Objective**: Ensure hooks catch formatting issues before commit

**Test Cases**:
```
TC4.1.1: Formatting issue prevention
- Stage files with intentional formatting problems
- Attempt to commit
- Expected: Commit blocked with clear error message
- Verification: Poorly formatted files cannot be committed

TC4.1.2: Clean code commits succeed
- Stage properly formatted files
- Attempt to commit
- Expected: Commit succeeds without issues
- Verification: Well-formatted code commits normally

TC4.1.3: Hook bypass functionality
- Stage files with formatting issues
- Commit with --no-verify flag
- Expected: Commit succeeds (emergency bypass works)
- Verification: Developers can override hooks when necessary
```

#### Test 4.2: Hook Performance Testing
**Objective**: Ensure hooks don't significantly slow development workflow

**Test Cases**:
```
TC4.2.1: Hook execution time
- Measure time for pre-commit hooks on various file sets
- Expected: Hook execution completes in <10 seconds for typical commits
- Verification: Acceptable performance impact on development workflow

TC4.2.2: Large file handling
- Test hooks with large files or many files
- Expected: Reasonable performance even with large changesets
- Verification: No timeout or memory issues with substantial commits
```

### 5. CI/CD Pipeline Testing

#### Test 5.1: Build Consistency
**Objective**: Ensure CI formatting checks match local environment exactly

**Test Cases**:
```
TC5.1.1: Local vs CI consistency
- Format files locally using configured tools
- Run same files through CI pipeline
- Expected: Identical formatting results
- Verification: No discrepancies between local and CI formatting

TC5.1.2: Error message clarity
- Submit PR with intentional formatting issues
- Check CI error messages
- Expected: Clear, actionable error messages
- Verification: Developers can understand and fix issues from CI feedback

TC5.1.3: Success case validation
- Submit PR with properly formatted code
- Check CI pipeline results
- Expected: All formatting checks pass
- Verification: Clean code passes CI without issues
```

#### Test 5.2: Pipeline Performance
**Objective**: Ensure formatting checks don't significantly impact CI/CD performance

**Test Cases**:
```
TC5.2.1: Pipeline execution time
- Measure CI pipeline duration before/after formatting integration
- Expected: Minimal impact on overall pipeline time (<2 minutes added)
- Verification: Acceptable performance overhead

TC5.2.2: Parallel execution
- Verify formatting checks run in parallel with other jobs where possible
- Expected: Optimal job parallelization
- Verification: No unnecessary sequential dependencies
```

### 6. Cross-Platform Testing

#### Test 6.1: Operating System Compatibility
**Objective**: Ensure consistent behavior across developer environments

**Test Cases**:
```
TC6.1.1: macOS compatibility
- Test all formatting functionality on macOS
- Expected: Consistent behavior and performance
- Verification: No macOS-specific issues

TC6.1.2: Linux compatibility  
- Test all formatting functionality on Linux
- Expected: Identical results to macOS testing
- Verification: Cross-platform consistency

TC6.1.3: Windows compatibility
- Test all formatting functionality on Windows
- Expected: Same formatting results as Unix systems
- Verification: No Windows-specific path or line-ending issues
```

#### Test 6.2: Tool Version Compatibility
**Objective**: Ensure compatibility across different versions of development tools

**Test Cases**:
```
TC6.2.1: Node.js version compatibility
- Test with supported Node.js versions (16, 18, 20)
- Expected: Consistent functionality across versions
- Verification: No version-specific formatting differences

TC6.2.2: VSCode version compatibility
- Test with current and recent VSCode versions
- Expected: Extension integration works consistently
- Verification: No version-specific VSCode issues
```

## Mocking Requirements

### Test Environment Setup

#### Mock Data for Testing
```
Mock Files for Testing:
├── test-files/
│   ├── poorly-formatted.html      # Intentionally bad HTML formatting
│   ├── poorly-formatted.css       # Inconsistent CSS formatting
│   ├── poorly-formatted.js        # Mixed quotes, semicolons, indentation
│   ├── poorly-formatted.md        # Inconsistent markdown formatting
│   ├── poorly-formatted.json      # Inconsistent JSON indentation
│   └── poorly-formatted.yaml      # Poor YAML structure
├── well-formatted/
│   ├── clean.html                 # Properly formatted HTML
│   ├── clean.css                  # Consistent CSS formatting
│   ├── clean.js                   # Proper JavaScript formatting
│   ├── clean.md                   # Well-structured markdown
│   ├── clean.json                 # Properly formatted JSON
│   └── clean.yaml                 # Clean YAML formatting
└── edge-cases/
    ├── html-in-markdown.md        # Markdown with embedded HTML
    ├── large-file.js              # Large file for performance testing
    ├── complex-css.css            # Complex CSS with media queries
    └── mixed-content.md           # Markdown with various content types
```

#### Test Automation Scripts
```
Test Scripts:
├── scripts/
│   ├── test-format-consistency.sh    # Test local vs CI consistency
│   ├── test-vscode-integration.sh    # Test VSCode auto-formatting
│   ├── test-git-hooks.sh            # Test pre-commit hook functionality
│   ├── test-performance.sh          # Measure formatting performance
│   └── setup-test-environment.sh    # Set up clean test environment
```

#### CI/CD Mock Scenarios
```
CI Test Scenarios:
├── .github/workflows/test-formatting.yml    # Test workflow
├── test-prs/
│   ├── clean-pr-files/                      # Files that should pass CI
│   ├── messy-pr-files/                      # Files that should fail CI
│   └── edge-case-files/                     # Complex scenarios
```

### Testing Infrastructure

#### Local Testing Environment
- **Clean Git Repository**: Fresh clone for testing without existing config conflicts
- **Multiple Node.js Versions**: Test with 16.x, 18.x, 20.x versions
- **Cross-Platform VMs**: macOS, Ubuntu, Windows environments for compatibility testing
- **VSCode Configurations**: Test with different extension combinations

#### Automated Testing Pipeline
- **Pre-commit Testing**: Automated tests that run before each commit
- **PR Validation**: Comprehensive test suite that runs on every pull request
- **Nightly Tests**: Extended test suite including performance and edge cases
- **Release Testing**: Full regression testing before configuration changes are merged

### Success Metrics

#### Quantitative Metrics
- **Format-on-save success rate**: >99% across all supported file types
- **CI/CD consistency**: 100% agreement between local and CI formatting results
- **Hook performance**: <10 seconds for typical commits, <30 seconds for large commits
- **VSCode integration**: Zero formatter conflict errors or warnings
- **Cross-platform consistency**: Identical formatting results across all supported platforms

#### Qualitative Metrics  
- **Developer experience**: Positive feedback on workflow integration
- **Error clarity**: Clear, actionable error messages when formatting issues occur
- **Setup simplicity**: New developers can configure environment in <5 minutes
- **Maintenance ease**: Configuration changes can be made without extensive testing