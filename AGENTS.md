# AGENTS.md - Camera PWA Developer Guide

## Project Overview

- **Type**: Progressive Web App (PWA) - Vanilla HTML/CSS/JS
- **Purpose**: Mobile-first camera recording viewer
- **Hosting**: https://camera.navynui.cc
- **Data Source**: data.json (camera recordings metadata)

## File Structure

```
/home/nui/dev/camera/
├── index.html       # Main gallery view with thumbnails & video modal
├── script.js       # Core logic (data loading, rendering, video player)
├── style.css       # Styling (gallery + video modal + fullscreen)
├── sw.js           # Service worker for PWA offline support
├── manifest.json   # PWA manifest (also inlined in index.html)
├── icon.svg        # App icon
├── data.json       # Camera recordings metadata
├── Agents.md       # This file
└── README.md       # User documentation
```

## Development Commands

### Local Development Server

```bash
# Python 3
python3 -m http.server 8000

# Node.js with serve
npx serve .

# PHP
php -S localhost:8000
```

Then open http://localhost:8000

### No Build System

This is a vanilla JS project - no build, lint, or test commands exist.
- No npm/yarn/pnpm
- No TypeScript
- No linting (ESLint, etc.)
- No test framework

### Testing PWA Features

Use Chrome DevTools:
1. Application > Service Workers - verify SW registration
2. Lighthouse - run PWA audit
3. Application > Manifest - verify PWA metadata

## Code Style Guidelines

### JavaScript (script.js)

**Variables & Constants**
- Use `var` for global state (legacy style in this codebase)
- Use `const` for constants: `const PAGE_SIZE = 12;`
- Use `let` for local variables

**Functions**
- Use function declarations: `function functionName() {}`
- Keep functions small and focused
- Document complex logic with inline comments

**Naming Conventions**
- camelCase for variables and functions: `jsonD`, `loaddata()`, `currentVideoIndex`
- All caps for constants: `PAGE_SIZE`
- Descriptive names: `currentVideoIndex` not `idx`

**Code Structure**
```javascript
// Global state (top of file)
var jsonD = [], menu = [];

// Constants
const PAGE_SIZE = 12;

// Functions (alphabetical or logical grouping)
function init() {}
function loadData() {}
function render() {}
function handleEvent() {}

// Event listeners (bottom)
document.addEventListener("DOMContentLoaded", function() {});
```

**Error Handling**
- Use try/catch for iframe detection: `try { ... } catch (e) { ... }`
- Add `.catch()` to fetch promises
- Check DOM elements exist before use: `if (mn) mn.innerHTML = ""`

**No TypeScript**
- This is a vanilla JS project - do not add TypeScript
- If types needed, use JSDoc comments

### HTML (index.html)

**Structure**
- Use semantic HTML5 elements
- Keep inline styles minimal (use style.css)
- External scripts with version query: `script.js?v=mobile_v8`

**Meta Tags**
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Theme color: `<meta name="theme-color" content="#000000">`
- PWA: Include both `mobile-web-app-capable` and `apple-mobile-web-app-capable`

### CSS (style.css)

**Variables**
- Define in `:root`: `--primary: #00d1b2;`
- Use throughout: `color: var(--primary);`

**Formatting**
- Use 2-space indentation
- Group related styles
- Comment sections: `/* Section Name */`

**Responsive**
- Use Bulma classes for grid: `is-one-quarter-widescreen is-half-tablet`
- Add custom media queries: `@media screen and (max-width: 768px) {}`

### Icons & Assets

- SVG for icons: `icon.svg`
- Inline manifest in HTML as data URI for PWA
- Keep favicon references updated

## Adding Features

1. **New JS Function**: Add to script.js following naming conventions
2. **New CSS**: Add to style.css with variables
3. **New HTML**: Add to index.html, keep inline styles minimal
4. **New Data**: Update data.json format if needed

## PWA Requirements

When modifying, ensure:
- Service worker registered in sw.js
- Manifest includes icon (inline in HTML)
- Theme color matches design
- Works offline (network-first or cache-first strategy)

## Testing Checklist

- [ ] Page loads without console errors
- [ ] Thumbnails render from data.json
- [ ] Click thumbnail opens video modal
- [ ] Video controls work (play/pause/seek/volume)
- [ ] Fullscreen works (button, double-click, F key)
- [ ] Next/Prev video navigation works
- [ ] Keyboard shortcuts work
- [ ] PWA installable (Lighthouse audit)
- [ ] Works on mobile viewport
