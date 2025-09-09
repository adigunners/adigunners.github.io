# Repository Organization

This document describes the current organization structure of the repository after cleanup.

## Directory Structure

```
/
├── archive/           # Backup and historical files
├── assets/           # Static assets (images, fonts, icons)
├── css/              # Stylesheets
├── data/             # JSON data files
├── demos/            # Demonstration and example files
├── docs/             # Documentation files
├── js/               # JavaScript files
├── logs/             # Log files (gitignored)
├── scripts/          # Build and utility scripts
├── tests/            # All test files and testing infrastructure
│   ├── fixtures/     # Test fixtures and sample data
│   ├── integration/  # Integration tests
│   ├── manual/       # Manual testing pages
│   └── unit/         # Unit tests
└── [root files]      # Main application files

```

## File Organization Rules

### Root Level

- Only main application files (index.html, winners.html, etc.)
- Configuration files (package.json, .gitignore, etc.)
- Main documentation (README.md, CHANGELOG.md)

### Tests

- All test files go in `tests/` directory
- Manual test pages go in `tests/manual/`
- Unit tests go in `tests/unit/`
- Integration tests go in `tests/integration/`

### Documentation

- All documentation goes in `docs/` directory
- Architecture documents, guides, and technical specs

### Demos

- Demo and example files go in `demos/` directory
- Include README.md explaining each demo

### Archives

- Backup files and historical versions go in `archive/`
- Old implementations and deprecated files

### Logs

- All log files go in `logs/` directory
- This directory is gitignored

## Recent Changes

### Moved Files

- `test-stat-boxes.html` → `tests/manual/test-stat-boxes.html`
- `countdown-demo.html` → `demos/countdown-demo.html`
- `CSS_ARCHITECTURE_STATUS.md` → `docs/CSS_ARCHITECTURE_STATUS.md`
- `JAVASCRIPT_ARCHITECTURE_ANALYSIS.md` → `docs/JAVASCRIPT_ARCHITECTURE_ANALYSIS.md`
- `TESTING_STRATEGY.md` → `docs/TESTING_STRATEGY.md`
- `winners.html.backup` → `archive/winners.html.backup`
- `server.log` → `logs/server.log`
- `js/test-admin-wrappers.js` → `tests/unit/test-admin-wrappers.js`

### Created Directories

- `demos/` - For demonstration files
- `logs/` - For log files (gitignored)

### Updated Files

- `.gitignore` - Added logs/ directory
- `CHANGELOG.md` - Updated file paths to reflect new organization
- `demos/README.md` - Created to explain demo files
