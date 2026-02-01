# Testing Guide - Favorites & About Updates

## Quick Start
```bash
cd magicwave
npx expo start -c --go
# Press 'a' for Android or scan QR for device
```

---

## About Page Testing

### Header Section
- [ ] Tap back button → returns to previous screen
- [ ] Tap theme button → toggles dark/light mode instantly
- [ ] Header gradient visible with rounded corners
- [ ] Title "About MagicWave" displays in primary color
- [ ] Version shows "1.0.0"

### Features Section
Look for 4 feature cards:
- [ ] 🎵 Healing Frequencies - card displays with icon
- [ ] 🧠 Brain Entrainment - card displays with icon
- [ ] 🌙 Sleep Enhancement - card displays with icon
- [ ] ✨ Wellness - card displays with icon

Each card should have:
- [ ] Gradient background
- [ ] Icon with background circle
- [ ] Title text
- [ ] Description text
- [ ] Proper spacing

### Developer Section
- [ ] Developer avatar (👨‍💻) displays
- [ ] Name: "Suryansh Kapoor" shows
- [ ] Title: "Full Stack Developer" shows
- [ ] Bio paragraph displays and is readable
- [ ] 4 social media buttons visible below bio

### Social Media Links Testing

**Instagram**
- [ ] Tap Instagram icon
- [ ] **Android**: Opens Instagram app to @isuryanshkapoor OR opens browser
- [ ] **iOS**: Opens browser to instagram profile
- [ ] Icon is colored correctly (pink)
- [ ] Label "Instagram" displays below icon

**GitHub**
- [ ] Tap GitHub icon
- [ ] Opens browser to github.com/suryakapoor124
- [ ] Icon is colored correctly (dark gray)
- [ ] Label "GitHub" displays below icon

**LinkedIn**
- [ ] Tap LinkedIn icon
- [ ] **Android**: Opens LinkedIn app to profile OR opens browser
- [ ] **iOS**: Opens browser to LinkedIn profile
- [ ] Icon is colored correctly (blue)
- [ ] Label "LinkedIn" displays below icon

**Interactive Feedback**
- [ ] Tap any social button → scales down to 0.95
- [ ] Release → scales back to 1
- [ ] Visual feedback is smooth

### App Information Section
- [ ] Application: MagicWave
- [ ] Version: 1.0.0
- [ ] Platform: React Native
- [ ] Status: "Active" with green dot

### Footer
- [ ] Shows: "Made with 💜 by Suryansh Kapoor"
- [ ] Shows: "Bringing harmony through frequency and technology"
- [ ] Has gradient background

### General
- [ ] All text uses Ubuntu font (clean, modern look)
- [ ] Scroll smooth without jank
- [ ] Dark mode colors correct
- [ ] No console errors

---

## Favorites Screen Testing

### Header Section
- [ ] Gradient header displays
- [ ] Greeting: "Collections" shows
- [ ] Title: "Your Frequencies" shows in large text
- [ ] Theme toggle button works
- [ ] Header rounded corners (32px)

### Tab Navigation
- [ ] Two tabs visible: "Favorites" and "Recent"
- [ ] Tap "Favorites" → shows favorites tab content
- [ ] Tap "Recent" → shows recent tab content
- [ ] Active tab has underline highlight
- [ ] Icons display correctly

### Favorites Tab

**When You Have Favorites**
- [ ] Each favorite shows as a card in 2-column grid
- [ ] Card shows emoji/icon
- [ ] Card shows frequency number
- [ ] Card shows frequency name
- [ ] Card shows category badge
- [ ] Red delete button in top-right corner (trash icon)
- [ ] Favorite count badge shows in section header

**Testing Delete**
- [ ] Tap trash icon on any card
- [ ] Confirmation alert appears
- [ ] Tap "Remove" → frequency removed from list
- [ ] Card disappears smoothly
- [ ] Count badge updates

**Empty State**
- [ ] If no favorites: 💝 emoji displays
- [ ] "No Favorites Yet" message shows
- [ ] Helpful description displays
- [ ] "Explore Frequencies" button displays
- [ ] Tap button → navigates to Home screen

### Recent Tab

**When You Have Recents**
- [ ] Each recent shows as a card in 2-column grid
- [ ] Similar layout to favorites tab
- [ ] "Clear" button in section header
- [ ] Recent count shows

**Testing Clear**
- [ ] Tap "Clear" button
- [ ] Confirmation alert appears
- [ ] Tap "Clear" → all recents removed
- [ ] Tab becomes empty

**Empty State**
- [ ] If no recents: ⏱️ emoji displays
- [ ] "No Recent History" message shows
- [ ] Helpful description displays
- [ ] No button (can't navigate from here)

### Pull-to-Refresh
- [ ] Pull down on scroll view
- [ ] Refresh spinner appears
- [ ] Release → data reloads
- [ ] Data updates if changed elsewhere

### Playing Indicator
- [ ] Play any frequency from home
- [ ] Go to Favorites screen
- [ ] Card shows play indicator (play icon)
- [ ] Indicator updates in real-time

### General
- [ ] Smooth tab transitions
- [ ] Ubuntu font throughout
- [ ] Dark mode colors correct
- [ ] Responsive on all screen sizes
- [ ] No console errors
- [ ] Loading spinner shows while loading
- [ ] No data loss or corruption

---

## Cross-Device Testing

### Android Emulator
- [ ] Test on Android 10+
- [ ] Social links open apps first, then browser fallback
- [ ] Instagram app link works if Instagram installed
- [ ] GitHub always opens browser
- [ ] LinkedIn app link works if LinkedIn installed

### Physical Android Device
- [ ] Same as emulator
- [ ] Test with Instagram installed
- [ ] Test with Instagram uninstalled (should use web)
- [ ] Test with LinkedIn installed
- [ ] Test with LinkedIn uninstalled (should use web)

### iOS Simulator (macOS)
- [ ] All social links open in Safari browser
- [ ] No app linking (iOS limitation)
- [ ] Links work correctly in Safari

---

## Theme Testing

### Light Mode
- [ ] About page colors: Light backgrounds, dark text
- [ ] Favorites page colors: Light backgrounds, dark text
- [ ] Gradient headers: Primary + Secondary visible
- [ ] Category badges: Colored correctly per category
- [ ] All readable with good contrast

### Dark Mode
- [ ] About page colors: Dark backgrounds, light text
- [ ] Favorites page colors: Dark backgrounds, light text
- [ ] Gradient headers: Brighter, more vibrant
- [ ] Neon colors pop on dark background
- [ ] All readable with good contrast

### Toggle Between Modes
- [ ] Click theme button
- [ ] Colors change instantly
- [ ] No visual glitches
- [ ] Both pages update together
- [ ] Persists on restart

---

## Performance Testing

### Speed
- [ ] About page loads instantly
- [ ] Favorites page loads instantly
- [ ] Tab switching <100ms
- [ ] Social link taps <500ms
- [ ] No lag when scrolling

### Memory
- [ ] No memory leak after multiple tab switches
- [ ] App responsive after 5+ min use
- [ ] No crashes after many interactions

---

## Checklist Summary

### Must Have ✅
- [ ] About page displays with developer info
- [ ] 4 social media links functional
- [ ] Instagram opens in app or browser
- [ ] GitHub opens in browser
- [ ] LinkedIn opens in app or browser
- [ ] Favorites tab shows favorites
- [ ] Recent tab shows recent
- [ ] Delete from favorites works
- [ ] Clear recent works
- [ ] Empty states display
- [ ] All fonts are Ubuntu
- [ ] Dark mode works

### Nice to Have 🌟
- [ ] Smooth animations
- [ ] Pull-to-refresh works
- [ ] Playing indicator updates
- [ ] No console errors
- [ ] Responsive design perfect

---

## Reporting Issues

If something doesn't work:

1. **Social Link Issues**
   - Device: Android/iOS
   - App installed?: Yes/No
   - Error: (if any)
   - Expected: (what should happen)
   - Actual: (what actually happened)

2. **Favorites Issues**
   - Action: (what you did)
   - Expected: (what should happen)
   - Actual: (what actually happened)
   - Console error?: (if any)

3. **Visual Issues**
   - Screenshot of issue
   - Dark or light mode?
   - Expected vs actual

---

**Status**: Ready for Testing ✅
**Version**: 1.0.0
**Last Updated**: 2024
