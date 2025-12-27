---
name: Global Validation
description:
  Validate data structures, user inputs, and loaded content to ensure the static website operates
  correctly. Use this skill when verifying JSON data integrity, validating form inputs, and ensuring
  DOM elements exist before manipulation.
---

# Global Validation

This Skill provides Claude Code with specific guidance on how to adhere to coding standards as they
relate to how it should handle global validation in the adigunners.github.io static website project.

## When to use this skill

- Validating JSON data structure when loading data files from the `data/` directory before using
  them
- Checking that required properties exist in data objects before rendering content to the page
- Validating user input from HTML forms to ensure data meets expected formats and constraints
- Verifying that DOM elements exist before attempting to manipulate them in JavaScript modules
- Validating data types and value ranges (e.g., ensuring scores are numbers, names are strings)
  before processing
- Checking CSS class names and ID selectors to ensure referenced elements exist in the HTML
- Validating file paths and URLs before attempting to fetch external resources in the static site

## Instructions

For details, refer to the information provided in this file:
[global validation](../../../agent-os/standards/global/validation.md)
