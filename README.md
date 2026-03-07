# Camera

A modern, minimal, mobile-first web application for viewing camera recordings. Designed for speed and visual clarity.

## Features

- **🚀 Mobile-First Design**: Optimized for touch interaction with a clean, high-density layout.
- **♾️ Infinite Scroll**: Browsing history is effortless with automatic loading as you scroll.
- **☁️ Glassmorphism UI**: High-end aesthetic using translucent surfaces, blur effects, and the modern **Kanit** font.
- **📅 Smart Navigation**: Jump to specific dates and hours via the top navigation menu.
- **🔒 Secure**: Designed to be deployed behind server-level protection (e.g., Apache2 password protection).
- **⚡ Lightweight**: Built with Vanilla JS and Bulma CSS for maximum performance without a complex build pipeline.

## Technical Details

- **Frontend**: Bulma CSS 1.0.2 + Custom Vanilla CSS.
- **Logic**: Vanilla JavaScript with native Fetch API.
- **Data Source**: Periodically updated `data.json` file containing metadata for thumbnails and video paths.

## Local Development vs. Production

- **Local**: Use for learning the structure and adjusting styles. `data.json` is a representative snapshot.
- **Server**: The production environment where `data.json` is dynamically updated by the camera system.

### How to Deploy
1. Commit changes locally.
2. `git push` to your repository.
3. SSH into the server and `git pull`.
4. Ensure Apache2 is configured with the necessary password protection for the directory.

## File Structure

- `index.html`: Main application container.
- `script.js`: Core logic including infinite scroll, data parsing, and navigation.
- `style.css`: Modern design system and layout overrides.
- `data.json`: Metadata storage (schema: camera, path, dt).
- `thumbs/`: Storage for video thumbnails.
- `files/`: Storage for the `.mp4` recordings.
