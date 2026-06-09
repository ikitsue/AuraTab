# AuraTab - Images & Icons

This folder contains the icon files for the AuraTab extension.

## Extension Icons

### Icon Sizes

| Size | Filename | Purpose | Usage |
|------|----------|---------|-------|
| 16×16 px | `icon16.png` | Toolbar icon (small) | Browser toolbar |
| 48×48 px | `icon48.png` | Extension popup icon | Popup window display |
| 128×128 px | `icon128.png` | Chrome Web Store icon | Store and installation |

### Design Guidelines

- **Format**: PNG with transparency (RGBA)
- **Color Scheme**: Cyberpunk/Gaming Modern theme
  - Primary color: Cyan (#00d9ff)
  - Secondary color: Pink (#ff006e)
  - Tertiary color: Purple (#8338ec)
  - Background: Dark (#0a0e27)

### Current Icons

- ✅ **icon16.png** - Small toolbar icon (16×16)
- ✅ **icon48.png** - Popup icon (48×48)
- ✅ **icon128.png** - Store icon (128×128)

## Icon Requirements

### Chrome Web Store Submission

If submitting to the Chrome Web Store, icons must be:
- Square (equal width/height)
- Minimum 128×128 pixels
- PNG or JPG format
- Transparent background recommended
- Clear and recognizable at small sizes

### Manifest Declaration

Icons are declared in `manifest.json`:

```json
{
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  }
}
```

## Wallpapers Folder

The `/wallpapers/` folder (created at runtime) stores custom user wallpapers:
- Location: `/wallpapers/`
- Format: Data URLs (PNG, JPG, GIF)
- Max size per wallpaper: 5MB
- Stored in: `chrome.storage.local`

---

## Customizing Icons

To replace the icons:

1. Create PNG files in the exact sizes (16, 48, 128 pixels)
2. Name them: `icon16.png`, `icon48.png`, `icon128.png`
3. Place them in the `images/` folder
4. Reload the extension in `chrome://extensions`

### Tool Recommendations

For creating/editing icons:
- **Photoshop** - Professional image editor
- **Affinity Photo** - Lightweight alternative
- **GIMP** - Free open-source editor
- **Aseprite** - Pixel art editor
- **Figma** - Online design tool

---

## Icon Specifications

### Design Tips

✅ **DO:**
- Make icons clear and distinctive
- Use solid colors or simple gradients
- Test at actual sizes (very small icons are hard to see)
- Keep important details centered
- Use consistent styling with your app theme

❌ **DON'T:**
- Use too many colors or complex patterns
- Make icons with thin lines (hard to see at 16px)
- Use text or numbers (unclear at small sizes)
- Use copyrighted materials
- Make icons too similar to existing extensions

---

**Last Updated**: 2026-06-09
