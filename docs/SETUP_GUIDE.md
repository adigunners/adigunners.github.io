# ⚙️ Development Setup Guide

**Local development setup for contributing to the Fantasy League website.**

---

## 📋 Prerequisites

To contribute to this project, you'll need:

- ✅ **Node.js** (v16 or higher)
- ✅ **Git** for version control
- ✅ **Modern web browser** (Chrome, Firefox, Safari, Edge)
- ✅ **Code editor** (VS Code recommended)

---

## 🚀 Quick Start

### 1. Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR-USERNAME/adigunners.github.io.git
cd adigunners.github.io
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
# Option 1: Using Python (if installed)
python -m http.server 8000

# Option 2: Using Node.js serve
npx serve .

# Option 3: Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

### 4. Open in Browser

Navigate to:

- `http://localhost:8000` (Python server)
- `http://localhost:3000` (serve)
- Live Server will automatically open browser

---

## 📁 Project Structure

```
adigunners.github.io/
├── index.html          # Main page
├── winners.html        # Winners display
├── css/               # Stylesheets
├── js/                # JavaScript modules
├── assets/            # Images, fonts, icons
├── data/              # JSON data files
├── tests/             # Test files
└── docs/              # Documentation
```

---

## 🛠️ Development Workflow

### Making Changes

1. **Create a branch** for your feature/fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** using your preferred editor

3. **Test locally** in multiple browsers

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**:

   ```bash
   git push origin feature/your-feature-name
   ```

### Testing Your Changes

**Manual Testing:**

- Test on different screen sizes (mobile, tablet, desktop)
- Check multiple browsers (Chrome, Firefox, Safari)
- Verify keyboard navigation works
- Check for JavaScript errors in console

**Responsive Testing:**

- Use browser dev tools device emulation
- Test common breakpoints: 320px, 768px, 1024px, 1200px

---

## 🔧 Development Tools

### Recommended VS Code Extensions

- **Live Server** - Local development server
- **Prettier** - Code formatting
- **ESLint** - JavaScript linting
- **Auto Rename Tag** - HTML tag management

### Browser Developer Tools

- **Elements tab** - Inspect HTML/CSS
- **Console tab** - Check for JavaScript errors
- **Network tab** - Monitor resource loading
- **Device emulation** - Test responsive design

---

## 📝 Code Style Guidelines

### HTML

- Use semantic HTML elements
- Include proper `alt` attributes for images
- Maintain consistent indentation (2 spaces)

### CSS

- Use existing CSS classes when possible
- Follow mobile-first approach
- Use CSS custom properties for consistent values
- Avoid `!important` unless absolutely necessary

### JavaScript

- Write modern ES6+ JavaScript
- Use `const`/`let` instead of `var`
- Handle errors gracefully with try/catch
- Add comments for complex logic

---

## 🐛 Common Issues & Solutions

### Server Not Starting

```bash
# Try different port if 8000 is busy
python -m http.server 8001
```

### Changes Not Showing

- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check browser console for errors

### CORS Issues

- Always use a local server (don't open HTML files directly)
- Use `http://localhost:PORT` not `file://`

---

## 📚 Learning Resources

### Web Technologies

- **HTML/CSS**: [MDN Web Docs](https://developer.mozilla.org/)
- **JavaScript**: [JavaScript.info](https://javascript.info/)
- **Responsive Design**: [CSS-Tricks](https://css-tricks.com/)

### Git & GitHub

- **Git Basics**: [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- **GitHub Flow**: [Understanding the GitHub Flow](https://guides.github.com/introduction/flow/)

---

## 🤝 Getting Help

- **Check Issues**: Look for existing solutions in GitHub Issues
- **Ask Questions**: Create a new issue with `question` label
- **Contact**: Email [aditya.garg.2006@gmail.com](mailto:aditya.garg.2006@gmail.com)

---

**Ready to contribute?** Check out our [Contributing Guide](CONTRIBUTING.md) for detailed guidelines
and coding standards!
