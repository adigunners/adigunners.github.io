# Design System Guide

## IIM Mumbai Fantasy League Website

### 🎯 Purpose

Ensure consistent design and development across all pages, making it easy for team members to add features and maintain consistency.

## 🏗️ Architecture Principles

### 1. **Single Source of Truth**

All design tokens, components, and utilities are centralized:

- **Colors & Spacing**: `css/variables.css`
- **Base Styles**: `css/base.css`
- **Components**: `css/components.css`
- **Utilities**: `js/utils.js`
- **Data Loading**: `js/data-loader.js`

### 2. **Mobile-First Responsive Design**

Consistent breakpoints across all pages:

```css
/* Mobile: ≤700px (default) */
/* Tablet: 701-1024px */
/* Desktop: ≥1025px */
```

### 3. **Component-Based Architecture**

Every page imports shared components instead of duplicating code.

## 📁 File Structure

```
css/
├── variables.css          # Design tokens (colors, spacing, fonts)
├── base.css              # Reset, typography, containers
├── components.css        # Reusable UI components
├── header.css           # Site header & countdown
├── winners.css          # Winner-specific components
├── leaderboard.css      # Table components
├── responsive.css       # Responsive utilities
├── mobile-optimizations.css # Mobile enhancements
└── advanced-mobile.css  # Ultra-compact mobile

js/
├── utils.js             # Shared utilities (escapeHTML, etc.)
├── data-loader.js       # Data fetching & caching
├── countdown.js         # Countdown logic
├── ui-manager.js        # UI state management
├── error-handler.js     # Error handling
└── [page-specific].js   # Page-specific logic only
```

## 🎨 Design Tokens

### Colors (css/variables.css)

```css
:root {
  --primary-color: #37003c; /* FPL Purple */
  --secondary-color: #00ff87; /* FPL Green */
  --accent-color: #5bbad5; /* FPL Teal */
  --background-color: #f8f9fa;
  --card-background: #fff;
  --text-color: #212529;
  --heading-color: #37003c; /* Primary color for headings */
  --text-muted: #777; /* Consistent muted text (subtitles, descriptions) */
}
```

### Spacing System

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### Typography Scale

```css
--font-size-xs: 0.8rem;
--font-size-sm: 0.9rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.5rem;
```

## 🧩 Component Usage

### Standard Page Template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title</title>

    <!-- Design System CSS -->
    <link rel="stylesheet" href="css/variables.css" />
    <link rel="stylesheet" href="css/base.css" />
    <link rel="stylesheet" href="css/components.css" />
    <link rel="stylesheet" href="css/header.css" />
    <link rel="stylesheet" href="css/responsive.css" />
    <link rel="stylesheet" href="css/mobile-optimizations.css" />

    <!-- Page-specific CSS -->
    <link rel="stylesheet" href="css/[page-name].css" />
  </head>
  <body>
    <!-- Page content -->

    <!-- Design System JS -->
    <script src="js/utils.js"></script>
    <script src="js/data-loader.js"></script>
    <script src="js/error-handler.js"></script>
    <script src="js/countdown.js"></script>

    <!-- Page-specific JS -->
    <script src="js/[page-name].js"></script>
  </body>
</html>
```

## 🧩 Component Library

### Navigation Buttons

Consistent navigation components for moving between pages.

#### Back Navigation Button

Use `.btn.nav-back` for returning to previous pages:

**Desktop/Tablet (≥769px)**:

```html
<a href="index.html" class="btn nav-back nav-back--sm" aria-label="Go back to home page">
  <i class="fas fa-arrow-left" aria-hidden="true"></i>
  Back to Home
</a>
```

**Mobile (<768px)**:

- Automatically becomes full-width within container
- Larger padding for thumb accessibility
- Same gradient styling as other primary CTAs

**Key Features**:

- **Responsive**: Compact desktop placement, full-width mobile
- **Accessible**: Proper ARIA labels and semantic HTML
- **URL Preservation**: Maintains test/data/phase parameters via `setupPageNavigation()`
- **Design Consistency**: Purple gradient matching other CTAs

**CSS Classes**:

- `.btn` - Base button styles
- `.nav-back` - Navigation-specific styling
- `.nav-back--sm` - Compact variant for desktop/tablet
- `.full-width` - Mobile full-width modifier

**Usage Context**:

- Page headers (right-aligned below divider)
- Description rows (inline with content)
- Mobile navigation areas (centered, full-width)

## 🔧 Development Guidelines

### Adding New Components

1. **Use existing design tokens**: Never hardcode colors/spacing
2. **Follow naming conventions**: Use BEM methodology
3. **Mobile-first**: Write mobile styles first, then enhance for desktop
4. **Test responsively**: Verify on all breakpoints

Example:

```css
/* ❌ Don't do this */
.my-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

/* ✅ Do this */
.my-card {
  background: var(--card-background);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### Adding New Features

1. **Check for existing components**: Don't reinvent
2. **Use shared utilities**: Import from `utils.js`
3. **Follow URL parameter system**: Support test modes
4. **Handle errors gracefully**: Use `error-handler.js`

## 📱 Responsive Principles

### Breakpoint Strategy

```css
/* Mobile First - No media query needed */
.component {
  /* Mobile styles */
}

/* Tablet */
@media (min-width: 701px) and (max-width: 1024px) {
  .component {
    /* Tablet styles */
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .component {
    /* Desktop styles */
  }
}
```

### Layout Patterns

- **Mobile**: Single column, cards
- **Tablet**: 2-column grids, cards
- **Desktop**: Tables, multi-column layouts

## 🚀 Quick Start for New Developers

1. **Clone and setup**:

```bash
git clone [repo]
python3 -m http.server 8000
```

2. **Study the design system**:
   - Review `css/variables.css` for available tokens
   - Check `css/components.css` for reusable components
   - Look at `js/utils.js` for shared functions

3. **Follow the template**: Use standard page template above

4. **Test across devices**: Use `?test=true` for demo data

## 🎯 Success Metrics

- ✅ Zero code duplication between pages
- ✅ Consistent visual appearance across all breakpoints
- ✅ New features follow established patterns
- ✅ Fast development with reusable components
- ✅ Easy maintenance and updates

## 🔄 Maintenance

### Monthly Reviews

- Audit for code duplication
- Update design tokens if needed
- Test on new device sizes
- Update documentation

### Before Adding New Pages

1. Check existing components first
2. Follow standard template
3. Add only page-specific CSS/JS
4. Test on all breakpoints
