# Test Markdown File

This file contains intentional markdown violations to test our linting configuration.

## Multiple headers with same content

Some content here.

## Multiple headers with same content

This should trigger MD024 but we have it disabled.

### Line length violation test
This is an extremely long line that exceeds the typical 80 character limit used by many markdown linters and should trigger MD013 but we have it disabled for flexibility with long URLs and table content.

### Trailing punctuation in heading?

This heading has a question mark which should trigger MD026 but we have it disabled.

### HTML content test

<div class="custom-div">
  <p>This HTML should trigger MD033 but we have it disabled.</p>
</div>

### Table test

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Very long data that might cause line length issues | More data | Even more data that extends the line |

This file should pass linting with our current configuration!