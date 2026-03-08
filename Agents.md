# Camera PWA - Developer Guide

## Project Overview
- **Type**: Progressive Web App (PWA) for viewing camera recordings
- **Stack**: Vanilla HTML, CSS, JavaScript with Bulma CSS framework
- **Hosting**: https://camera.navynui.cc
- **Data Source**: data.json (camera recordings metadata)

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main gallery view with thumbnails |
| `video.html` | Standalone video player (legacy, not used) |
| `script.js` | Core logic for loading data, rendering thumbnails, video modal |
| `style.css` | Styling for gallery and video modal |
| `sw.js` | Service worker for PWA |
| `manifest.json` | PWA manifest |
| `data.json` | Camera recordings metadata (camera ID, path, timestamp) |

## Video Storage Structure
- Thumbnails: `thumbs/aqara_video/{camera}/{path}.png`
- Videos: `files/aqara_video/{camera}/{path}.mp4`

## Running Locally
```bash
# Simple HTTP server
python3 -m http.server 8000
# or
npx serve
```

## PWA Features
- Service worker registration
- Manifest with icons (192x192, 512x512)
- Apple mobile web app support
- Offline-capable (network-first caching)

## Video Modal Controls
- Play/Pause: Click button or Space key
- Previous/Next: Arrow buttons or ←/→ keys
- Volume: Volume slider or M key to mute
- Fullscreen: F key or double-click video
- Fit mode: C key to toggle fill/fit
- Close: Escape key or × button

## Adding New Features
1. Modify `script.js` for functionality
2. Update `style.css` for styling
3. Add new HTML in `index.html` if needed

## Notes
- Uses Bulma CSS from CDN
- Dark theme by default
- Infinite scroll pagination (12 items per batch)
- Filter by date/hour via navbar dropdown
