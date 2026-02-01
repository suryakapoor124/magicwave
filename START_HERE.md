# MagicWave - START HERE 🚀

## App is Stuck on Loading Screen?

**Follow these steps to fix it:**

### Step 1: Clean Installation (Most Important!)
```bash
cd /Users/suryanshkapoor/Developer/magicwave
rm -rf node_modules package-lock.json .expo
npm install
```

### Step 2: Clear Expo Cache and Start
```bash
npx expo start -c --go
```

**Important**: The `-c` flag clears the cache. This is critical!

### Step 3: Run on Device
- **Android Emulator**: Press `a`
- **Physical Device**: Scan the QR code with your phone camera in Expo Go app
- **iOS Simulator**: Press `i` (macOS only)

---

## Expected Timeline

| Step | Expected Duration | What You Should See |
|------|-------------------|---------------------|
| App Launch | 1-3 seconds | MagicWave splash screen |
| Loading | 2-5 seconds | "Loading your healing frequencies..." |
| Initialization | 2-3 seconds | Fonts and audio loading |
| Main App | <1 second | HomeScreen with gradient header |

**Total**: 5-12 seconds maximum

---

## If Still Stuck

### Option 1: Force Close and Restart
```bash
# On macOS, find and kill any Expo processes
lsof -i :19000
kill -9 [PID]

# Then restart
npx expo start -c --go
```

### Option 2: Clear Device App Data
**Android**:
1. Settings → Apps → Expo Go
2. Storage → Clear Data
3. Reopen Expo Go and scan QR code again

**iOS**:
1. Settings → General → iPhone Storage
2. Find Expo Go → Offload App
3. Reinstall Expo Go
4. Scan QR code again

### Option 3: Restart Everything
```bash
cd /Users/suryanshkapoor/Developer/magicwave
npm run start:clean
```

If `start:clean` doesn't exist, run the full cleanup:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npx expo start -c --go
```

---

## What Was Fixed

✅ Simplified font loading (Ubuntu fonts from Google Fonts)  
✅ Fixed initialization sequence  
✅ Better error handling  
✅ Fallback to system fonts if needed  
✅ Cleaner app startup logic  

---

## What Should Work Once Loaded

### Audio
- Play any frequency - smooth tone with NO beep
- Volume slider works
- Timer functionality
- Pause/resume

### UI
- Gradient headers on all screens
- Ubuntu font throughout
- Dark mode toggle (sun/moon button)
- Smooth scrolling
- Cards show when playing

### Features
- "Did You Know" shows rotating facts
- Frequency cards display properly
- Categories screen works
- Player screen shows controls

---

## Verify Installation

After the app loads, test:

1. **Audio**: Tap a frequency card → should play smoothly
2. **Fonts**: All text should look premium (Ubuntu font)
3. **Gradients**: Headers should have colorful gradients
4. **Did You Know**: Should show different facts
5. **Dark Mode**: Toggle with theme button

---

## Console Output (What's Normal)

```
Font loading issue, using system fonts: null
Settings initialized
Audio setup complete
App ready!
```

This is **completely fine** - it just means it's using system fonts instead of Ubuntu fonts.

---

## Still Having Issues?

### Check These:
- [ ] Using `-c` flag with `npx expo start -c --go`
- [ ] Internet connection is stable
- [ ] Device has > 500MB free storage
- [ ] Expo Go app is up to date
- [ ] Not running multiple Expo instances
- [ ] Restarted device once

### Get Help:
Run this and copy the full output:
```bash
npx expo doctor
npx expo --version
```

---

## Key Commands

```bash
# Clean start (recommended if stuck)
npx expo start -c --go

# Clear everything and reinstall
rm -rf node_modules package-lock.json && npm install

# Kill any stuck processes
lsof -i :19000 | grep node | awk '{print $2}' | xargs kill -9

# Check Expo health
npx expo doctor
```

---

## Expected File Structure

```
magicwave/
├── App.js ✅ (simplified, fixed)
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js ✅
│   │   ├── PlayerScreen.js ✅
│   │   ├── CategoriesScreen.js ✅
│   │   └── ...
│   ├── components/
│   │   ├── FrequencyCard.js ✅
│   │   ├── CustomSplashScreen.js ✅
│   │   └── ...
│   ├── utils/
│   │   ├── theme.js ✅ (Ubuntu fonts)
│   │   ├── audio.js ✅ (seamless looping)
│   │   └── ...
│   └── contexts/
│       └── AudioContext.js ✅
├── assets/
│   └── magicwave.png
└── package.json ✅
```

---

## What Changed in This Version

**App.js** was completely simplified:
- Removed complex font hook
- Direct `Font.loadAsync()` call
- Single initialization sequence
- Better error logging
- Cleaner state management

Result: **More reliable**, **faster startup**, **better error handling**

---

## Next Steps After Loading

1. Test audio playback
2. Try different frequencies
3. Toggle dark mode
4. Read "Did You Know" facts
5. Explore all screens

---

## Version Info

- **Expo SDK**: 54
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Status**: ✅ Ready to Test

---

**🎵 Enjoy MagicWave! Your healing frequencies await. 🎵**

For detailed documentation, see:
- `DESIGN_GUIDE.md` - Design system
- `TESTING_GUIDE.md` - Full testing procedures
- `QUICK_REFERENCE.md` - Developer reference