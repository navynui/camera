# Changelog

## [1.0.0] - 2026-01-16

### Fixed
- **Critical Session Loop**: Resolved an infinite loop where the "Media Locked" screen would reappear after refresh. This was caused by unstable Date token generation (UTC offsets). Switched to a stable, manually constructed `YYYY-MM-DD` local date string.
- **Navbar HTML Error**: Fixed a "Nested Select" console warning by completely refactoring the `navbar()` function to produce valid, non-nested HTML compliant with Bulma 1.0.2.
- **Missing Styles**: Resolved an issue where Bulma styles (specifically the navbar) would disappear after login. Added the `has-navbar-fixed-top` class to the body and `is-active` to the navbar menu to ensure visibility on all screen sizes.
- **Rain Animation**: Restored the missing CSS `animation` property for the "Media Locked" rain drops.

### Changed
- **Layout**: Switched to a **fluid container** (`is-fluid`) to maximize screen utilization on large displays.
- **Timeline**: Removed the scrollbar from the timeline to allow all date tags to be visible at once.
- **Mobile Experience**:
    - Made the navbar **collapsible** by default (accessible via hamburger menu).
    - Maximized image card size to **1 column (full width)** on mobile for better visibility.
    - Tightened grid gaps and reduced card padding to optimize space usage.
- **Cache Busting**: Implemented versioned query parameters (`?v=mobile_v3`) for scripts and styles to ensure immediate propagation of updates.
