# AuraTab - Wallpapers

This folder stores custom user wallpapers for the AuraTab new tab page.

## 📁 Folder Purpose

The `/wallpapers/` folder is created dynamically at runtime to store user-uploaded wallpaper images. This folder may not exist in a fresh installation—it is created the first time a user uploads a custom wallpaper.

## 🎨 Supported Formats

- **PNG** (.png) - Recommended for transparency and quality
- **JPEG** (.jpg, .jpeg) - Compressed format, smaller file sizes
- **GIF** (.gif) - Animated GIFs supported
- **WebP** (.webp) - Modern format with best compression

## 📸 Wallpaper Specifications

### Recommended Dimensions

- **Minimum**: 1280×720 px (HD)
- **Optimal**: 1920×1080 px (Full HD)
- **Maximum**: 2560×1440 px (2K) or 3840×2160 px (4K)

### File Size Limits

- **Maximum per wallpaper**: 5 MB
- **Maximum total**: Limited by `chrome.storage.local` quota (10 MB across all extension data)
- **Recommended**: Keep under 2 MB for faster loading

## 🔄 How Wallpapers Are Stored

### Storage Method

Wallpapers are stored in `chrome.storage.local` as Data URLs:

```javascript
// Example storage structure
{
  "customWallpapers": [
    "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

### Why Data URLs?

✅ **Advantages:**
- No file system access required
- Works in service worker context
- Persists across browser restarts
- No additional API permissions needed

### Retrieval

To use a stored wallpaper:

```javascript
// In newtab.js
chrome.storage.local.get('customWallpapers', (result) => {
  const wallpapers = result.customWallpapers || [];
  // Use wallpapers[index] as background image
});
```

## 📤 Uploading a Wallpaper

### Via Settings Page

1. Open AuraTab Settings (click ⚙️ gear icon)
2. Go to "Wallpaper" section
3. Click "Upload Wallpaper"
4. Select an image file
5. Confirm and save

### Technical Process

1. User selects file via `<input type="file">`
2. `FileReader.readAsDataURL()` converts image to Base64 string
3. Data URL stored in `chrome.storage.local`
4. On new tab load, background image set from stored URL

## 🎯 Best Practices

### Image Quality

✅ **DO:**
- Use high-quality original images
- Ensure contrast with text overlay (clock, weather)
- Test that text remains readable over the image
- Use darker wallpapers (easier to read light text)

❌ **DON'T:**
- Use extremely bright/light wallpapers (text becomes invisible)
- Use very busy/complex patterns (too distracting)
- Use compressed/low-quality images
- Use huge file sizes (slows down extension)

### Design Tips

For maximum readability with AuraTab's light-colored elements:

**Best wallpaper styles:**
- Dark, moody atmospheres
- Night scenes
- Mountain/landscape at dusk
- City skylines
- Abstract dark patterns

**Difficult wallpaper types:**
- Bright colors
- Pure white backgrounds
- High-contrast patterns
- Blurry/low-resolution images

## 🗑️ Managing Wallpapers

### Viewing Stored Wallpapers

Currently stored wallpapers can be managed through the AuraTab settings:

```javascript
// In settings.js
chrome.storage.local.get('customWallpapers', (result) => {
  const wallpapers = result.customWallpapers || [];
  console.log(`${wallpapers.length} wallpapers stored`);
});
```

### Deleting a Wallpaper

To remove a wallpaper:

1. Open AuraTab Settings
2. Go to Wallpaper section
3. Click delete/remove next to the wallpaper
4. Confirm deletion

### Clearing All Wallpapers

To reset all custom wallpapers:

```javascript
chrome.storage.local.set({ customWallpapers: [] });
```

## 🔧 Storage Quota Information

### Chrome Storage Quota

- **Total per extension**: 10 MB
- **Per site**: 10 MB
- **Allocated in AuraTab**:
  - Settings/preferences: ~1 MB
  - Wallpapers: ~8 MB (approximately 4-5 high-res wallpapers)
  - Other data: ~1 MB

### Checking Storage Usage

```javascript
chrome.storage.local.getBytesInUse(null, (bytes) => {
  console.log(`Storage used: ${bytes} bytes (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
});
```

## 📊 Wallpaper Recommendations

### Popular Sources

- **Unsplash** - Free high-quality photos
- **Pexels** - Free stock photography
- **Pixabay** - Royalty-free images
- **Wallpaper Engine** - Dedicated wallpaper collection
- **Custom artwork** - Your own designs or photography

### Editing Tools

- **Canva** - Simple online editor
- **Photoshop** - Professional editing
- **GIMP** - Free alternative
- **Affinity Photo** - Lightweight professional
- **Paint.NET** - Simple & fast

## 🚨 Troubleshooting

### Wallpaper Not Showing

**Problem**: Uploaded wallpaper doesn't display  
**Solution**: 
- Check file format (PNG, JPG, GIF, WebP)
- Verify file size < 5 MB
- Try re-uploading the file
- Clear extension data and try again

### Text Invisible Over Wallpaper

**Problem**: Clock/weather text can't be read  
**Solution**:
- Choose a darker wallpaper
- Reduce image brightness in editor
- Add semi-transparent overlay
- Adjust extension theme to lighter colors

### Storage Quota Exceeded

**Problem**: Can't upload new wallpaper  
**Solution**:
- Delete unused wallpapers
- Use smaller file sizes
- Convert to WebP format (better compression)

---

## 📝 Technical Details

### Wallpaper Loading Code (newtab.js)

```javascript
// Load custom wallpaper
chrome.storage.local.get('customWallpapers', (result) => {
  const wallpapers = result.customWallpapers || [];
  if (wallpapers.length > 0) {
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    document.body.style.backgroundImage = `url('${wallpapers[randomIndex]}')`;
  }
});
```

### Upload Handler (settings.js)

```javascript
const fileInput = document.getElementById('wallpaperUpload');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    chrome.storage.local.get('customWallpapers', (result) => {
      const wallpapers = result.customWallpapers || [];
      wallpapers.push(dataUrl);
      chrome.storage.local.set({ customWallpapers: wallpapers });
    });
  };
  
  reader.readAsDataURL(file);
});
```

---

**Last Updated**: 2026-06-09  
**AuraTab v1.0.0**
