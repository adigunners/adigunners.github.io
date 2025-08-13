# Git Configuration Guide

This guide documents the Git configurations and best practices set up for this repository.

## Current Git Configuration

### Global Settings

\`\`\`bash

# Core settings

init.defaultBranch=main # Default branch name for new repositories
status.showUntrackedFiles=all # Show all untracked files in git status
core.autocrlf=input # Proper line ending handling
pull.rebase=false # Use merge strategy for pulls
\`\`\`

### Useful Aliases

We have set up several helpful aliases to make git commands more convenient:

| Alias        | Command                    | Description                      |
| ------------ | -------------------------- | -------------------------------- |
| \`git st\`   | \`git status\`             | Quick status check               |
| \`git co\`   | \`git checkout\`           | Switch branches or restore files |
| \`git br\`   | \`git branch\`             | List or manage branches          |
| \`git up\`   | \`git pull --ff-only\`     | Safe pull (only fast-forward)    |
| \`git sync\` | \`git pull && git status\` | Update and check status          |

To use these aliases, simply type the short version. For example:
\`\`\`bash
git st # Instead of git status
git sync # To pull changes and see status
\`\`\`

### Global Gitignore

We have set up a global gitignore file at \`~/.gitignore_global\` with common files to ignore:

\`\`\`gitignore

# System files

.DS*Store
.DS_Store?
.*\*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files

.idea/
.vscode/

# Temporary files

_.swp
_.swo
\*~

# Environment and dependencies

.env
node_modules/
\`\`\`

## Best Practices

### Preventing Repository Duplication

1. **Always Clone, Do not Copy**
   \`\`\`bash

   # Do this:

   git clone https://github.com/username/repo.git

   # Do not do this:

   # cp -r existing-repo new-repo

   \`\`\`

2. **Moving Repositories**
   If you need to move a repository, update its remote URL:
   \`\`\`bash
   git remote set-url origin new-repository-url
   \`\`\`

3. **Checking Repository Status**
   Regularly check your repository status:
   \`\`\`bash
   git sync # Our custom alias for pull + status
   \`\`\`

### Common Workflows

1. **Starting Work**
   \`\`\`bash
   git sync # Update your repository
   git co -b feature-name # Create and switch to new branch
   \`\`\`

2. **Making Changes**
   \`\`\`bash
   git st # Check status
   git add . # Stage changes
   git commit -m "Descriptive message"
   \`\`\`

3. **Updating Your Branch**
   \`\`\`bash
   git up # Pull changes (safe fast-forward)
   \`\`\`

### Handling Multiple Copies

If you find duplicate repositories:

1. Identify the main repository using \`git remote -v\`
2. Back up any unique changes from duplicates
3. Delete duplicate repositories
4. Always use git commands for managing repositories

## Troubleshooting

### Common Issues

1. **Duplicate Repositories**
   - Check remote URLs: \`git remote -v\`
   - Ensure you are working in the correct directory
   - Use \`git sync\` to keep repositories updated

2. **File Changes Not Showing**
   - Use \`git st\` to check status
   - Verify you are in the correct directory
   - Check if files are in \`.gitignore\`

### Getting Help

For more information about any command:
\`\`\`bash
git help <command> # Detailed help
git <command> -h # Quick help
\`\`\`

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2)
