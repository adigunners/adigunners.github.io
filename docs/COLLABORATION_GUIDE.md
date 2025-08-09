Collaborating on the IIM Mumbai Fantasy Premier League GitHub Repo

Purpose

This document outlines the steps for multiple people to safely work together on the project without breaking the live website.

⸻

1. Adding Collaborators
   1. Go to the repository on GitHub.
   2. Click Settings → Collaborators.
   3. Click Add people and enter your friend’s GitHub username.
   4. Grant Write access (allows creating branches, commits, and pull requests).
   5. They will get an email invitation — they must accept before they can contribute.

⸻

2. Branching Workflow

We use branches to separate work:
• main → Production / live website
• dev → Shared development branch
• feature/<short-description> → Personal task branches

Example:
feature/readme-badges or feature/mobile-fix

⸻

3. How to Contribute

Step 1: Update your local copy

git checkout dev
git pull

Step 2: Create a new feature branch

git checkout -b feature/short-name

Step 3: Make changes locally

Use VS Code + Live Server to preview before pushing.

Step 4: Commit and push

git add .
git commit -m "Short description of change"
git push -u origin feature/short-name

Step 5: Open a Pull Request
• On GitHub, open PR: feature/... → dev
• Ask a teammate for review
• After testing, merge dev → main to deploy live

⸻

4. Protecting the Live Branch

Owner setup: 1. Go to Settings → Branches → Add branch protection rule for main. 2. Enable:
• ✅ Require pull request before merging
• ✅ Require at least 1 approval
• ✅ Restrict who can push (optional: only owner)

⸻

5. Local Testing (Option 3 from earlier)
   1. Install VS Code Live Server extension.
   2. Right-click index.html → Open with Live Server.
   3. Preview at <http://127.0.0.1:5500/>.
   4. Make changes → Save → Browser auto-refresh.

⸻

6. Collaboration Tips
   • Always start a branch from dev, never main.
   • Keep commit messages clear (e.g., fix: stat box padding).
   • Pull latest dev before starting new work.
   • Communicate via GitHub Issues for tracking tasks.
   • Use small PRs for easy review.

⸻

7. Optional for Growth

When the project grows:
• GitHub Organisation → easier access control.
• CODEOWNERS file → auto-request reviews for sensitive files.
• Multiple Environments:
• main → Production
• staging → Preview site
• dev → Active development

⸻

Last updated: 9 Aug 2025
