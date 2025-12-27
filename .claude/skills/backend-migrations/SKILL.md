---
name: Backend Migrations
description:
  Manage changes to data structure and formats in JSON files, ensuring compatibility and smooth
  transitions when updating the static site's data sources. Use this skill when modifying data
  schemas, updating JSON structures, or evolving how data is consumed.
---

# Backend Migrations

This Skill provides Claude Code with specific guidance on how to adhere to coding standards as they
relate to how it should handle data migrations in the adigunners.github.io static website project.

## When to use this skill

- Adding new fields to JSON data structures in the `data/` directory while maintaining backward
  compatibility
- Updating existing data files to support new content or features on the website
- Refactoring data schema to improve organization or performance without breaking existing
  JavaScript modules
- Creating migration scripts to transform old data format to new format (using Node.js utilities)
- Documenting data structure changes so developers understand how to update pages that consume the
  data
- Testing data compatibility when JavaScript modules expect certain properties in JSON objects
- Planning gradual rollouts of data structure changes to avoid breaking the site's data consumption
  layer

## Instructions

For details, refer to the information provided in this file:
[backend migrations](../../../agent-os/standards/backend/migrations.md)
