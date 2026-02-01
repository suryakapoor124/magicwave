# MagicWave - Stuck Loading Screen Fix Guide

## Problem
App is stuck on the MagicWave loading/splash screen and won't progress to the main app.

## Root Cause
The font loading mechanism in `App.js` was overly complex and the font URLs might be failing silently, causing the app to stay stuck in the loading state indefinitely.

## Solution

### Step 1: Clear Everything
```bash
cd magicwave
rm -rf node_modules package-lock.json .expo
npm install
```

### Step 2: Clear Device Cache
```bash
# For Expo Go
npx expo start -c --go
```

The `-c` flag clears the cache completely.

### Step 3: If Still Stuck - Simplified Approach

The app has been updated with a more robust font loading system. If you're still experiencing issues:

1. **Force Close Expo Go** on your device
2. **Clear Expo Go App Data**:
   - Android: Settings → Apps → Expo Go → Storage → Clear Data
   - iOS: Settings → General → iPhone Storage → Expo Go → Offload App, then reinstall

3. **Restart from scratch**:
```bash
cd magicwave
npx expo start -c --go
```

### Step 4: Monitor the Console
Watch the terminal output for messages like:
- "Ubuntu fonts not loaded, using system fonts" - This is OK
- "App initialization error" - This means there's a problem with audio or settings

If you see errors in the console, it will help diagnose the issue.

## What Changed in App.js

The font loading was simplified:
- Removed complex `useFonts` hook usage
- Implemented direct `Font.loadAsync()` call
- Added fallback behavior - if fonts fail to load, app continues anyway
- Better error logging to diagnose issues
- Cleaner initialization sequence

## Expected Behavior

1. **Splash Screen** (1-3 seconds): Shows "MagicWave - Frequency Therapy"
2. **Loading Message**: "Loading your healing frequencies..."
3. **Initialization**: Audio engine starts, settings load
4. **Main App**: HomeScreen appears with gradient header

If it gets stuck on the splash screen for more than 5 seconds, there's an initialization problem.

## Debugging Steps

### Check Logs
Open your browser DevTools if using web preview, or use:
```bash
adb logcat | grep -i expo
```

### Test Font Loading Separately
Create a test component to verify fonts load:
```javascript
import * as Font from "expo-font";

// Add this to test
Font.loadAsync({
  Ubuntu_400Regular: "https://fonts.gstatic.com/s/ubuntu/v20/4iCpE_yL0EHgdJg1E_BCIg.ttf",
}).then(() => console.log("Fonts loaded!"))
 .catch(e => console.log("Font error:", e));
```

### Fallback: Disable Custom Fonts
If Ubuntu fonts continue to fail, edit `App.js` and change:
```javascript
const [fontsLoaded, setFontsLoaded] = useState(true);
```

This will skip font loading and use system fonts instead.

## Network Issues

If fonts aren't loading:
- Check internet connection
- Try using Expo Go instead of dev client
- The app should still work with system fonts as fallback

## Audio Initialization Issues

If stuck after splash screen with no error:
- Check that audio permissions are granted
- Restart the device
- Try on a different device/emulator

## Still Not Working?

Try the nuclear option:

```bash
# Stop any running Expo processes
lsof -i :19000
lsof -i :19001
kill -9 [PID]

# Clean everything
cd magicwave
rm -rf node_modules package-lock.json .expo
npm cache clean --force
npm install

# Start fresh
npx expo start -c --go
```

## Quick Checklist

- [ ] Closed previous Expo sessions
- [ ] Cleared node_modules and reinstalled
- [ ] Used `-c` flag to clear cache
- [ ] Have stable internet connection
- [ ] Device has enough storage (> 500MB free)
- [ ] Expo Go is up to date
- [ ] Restarted device once
- [ ] Checked console for specific errors

## Expected Console Output

When working correctly, you should see:
```
Font loading error, using system fonts: null
(or no message if fonts load successfully)
Loading your healing frequencies...
App initialized successfully
```

## Contact Support

If none of these steps work, provide:
1. Full console error message
2. Device/OS (Android version, iOS version, or emulator name)
3. Expo version: `expo --version`
4. Whether app is in dev or production mode

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Troubleshooting Guide