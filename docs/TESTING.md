# Testing Guide — Public

This guide covers local testing and auditing for the public website. It excludes any private data or
credentials.

## Local server

```bash
# Serve the site locally (default port 8000)
npm run dev

# Or choose a port
PORT=3000 npm run dev
```

Visit `http://localhost:<port>/` in your browser.

## Lighthouse performance audits

We ship convenience scripts to run Lighthouse locally against the site served on localhost. Reports
are written to `docs/` and ignored by Prettier.

```bash
# Audit homepage
PORT=3000 npm run audit:index

# Audit winners page
PORT=3000 npm run audit:winners

# Audit both
PORT=3000 npm run audit
```

Outputs:

- `docs/lighthouse-index.report.html(.json)`
- `docs/lighthouse-winners.report.html(.json)`

Notes:

- Chrome must be installed for headless audits.
- These audits rely on your local environment/network and are meant for development guidance.

## Formatting and linting

```bash
# Prettier formatting (write)
npm run format

# Prettier formatting (check only)
npm run format:check

# Markdown linting
npm run lint:md
```

## Confidentiality

This repository contains only public assets and code necessary for the website. Any private
operational procedures (e.g., automation credentials, spreadsheets, admin playbooks) are maintained
outside this repository.
