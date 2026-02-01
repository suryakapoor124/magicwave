# MagicWave UI Testing & Implementation Guide

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Expo Go app installed on physical device or Android/iOS emulator

### Installation & Launch

```bash
cd /Users/suryanshkapoor/Developer/magicwave

# Clear cache and reinstall
npm install
npx expo start -c --go
```

Then either:
- Press `a` for Android emulator
- Scan QR code with phone camera for Expo Go
- Press `i` for iOS simulator (macOS only)

---

## Testing Checklist

### 1. Font System ✓
- [ ] All text displays in Ubuntu font (not system default)
- [ ] Light mode text is dark navy (#0F172A)
- [ ] Dark mode text is off-white (#FFFFFE)
- [ ] Headers use Ubuntu Bold (700 weight)
- [ ] Body text uses Ubuntu Regular (400 weight)
- [ ] Labels use Ubuntu Medium (500 weight)

**How to verify:**
1. Launch app and observe font rendering
2. Should look cleaner and more modern than before
3. Font should be consistent across all screens

---

### 2. HomeScreen - Visual Design ✓

#### Header Section
- [ ] Gradient background visible (Primary → Secondary)
- [ ] "Welcome back" text visible
- [ ] "MagicWave" title in large, bold font
- [ ] "Control yourself from within" tagline below title
- [ ] Theme toggle button (sun/moon icon) in top right
- [ ] Button has gradient background on press

#### Did You Know Section - FIXED ✓
- [ ] Card displays with gradient (Primary → Tertiary/Secondary)
- [ ] Icon visible (brain, heart, moon, or sparkles)
- [ ] Title text: "Brain Entrainment", "Healing Frequencies", "Sleep Science", or "Chakra Alignment"
- [ ] Description text is readable and relevant
- [ ] Card has rounded corners (24px)
- [ ] Card has shadow elevation
- [ ] Refreshing page shows different fact sometimes

#### Content Sections
- [ ] "Trending Now" section visible with horizontal scrolling cards
- [ ] "Explore All Frequencies" section visible with 2-column grid
- [ ] Cards have smooth corners and gradients
- [ ] Playing indicator shows when audio is playing
- [ ] Favorite button works and shows filled/empty heart

---

### 3. FrequencyCard Component ✓

#### Card Design
- [ ] 28px border radius
- [ ] Gradient background based on category color
- [ ] Shadow elevation visible
- [ ] Padding and spacing looks balanced

#### Content
- [ ] Category dot colored correctly (top left)
- [ ] Favorite button in top right
- [ ] Large emoji/icon in center
- [ ] Frequency number displayed (e.g., "528")
- [ ] "Hz" unit visible
- [ ] Frequency name below frequency value
- [ ] Category badge at bottom

#### Playing State
- [ ] When playing:
  - [ ] Border becomes thicker (2px)
  - [ ] Border color matches category
  - [ ] Shadow becomes more prominent
  - [ ] Gradient becomes brighter
  - [ ] Play indicator visible at top-left corner

#### Interactions
- [ ] Tapping card plays frequency
- [ ] Favorite button toggles heart state
- [ ] Card opacity changes on press (0.88)

---

### 4. PlayerScreen ✓

#### Header
- [ ] Back button (chevron down) visible
- [ ] "Now Playing" title centered
- [ ] Heart button for favorite on right
- [ ] Background gradient visible

#### Main Content
- [ ] Large circular icon container (160x160px)
- [ ] Icon container has gradient background
- [ ] Icon container has elevated shadow
- [ ] Frequency name displayed large (28px)
- [ ] Frequency value displayed (20px)
- [ ] Category badge below frequency info

#### Controls
- [ ] Progress bar visible at top of controls section
- [ ] "Playing" label on left, "∞" on right
- [ ] Previous button (skip back icon)
- [ ] Large play/pause button in center (88x88px)
- [ ] Next button (skip forward icon)
- [ ] All buttons have shadows and proper styling

#### Volume Control
- [ ] Volume slider visible at bottom
- [ ] Low volume icon on left
- [ ] High volume icon on right
- [ ] Slider thumb color matches category
- [ ] Slider is interactive

---

### 5. CategoriesScreen ✓

#### Header
- [ ] Gradient background matching other screens
- [ ] "Explore" title in primary color (large, bold)
- [ ] "Discover your perfect frequency" subtitle
- [ ] Rounded bottom corners (32px)

#### Category Cards
- [ ] 2-column grid layout
- [ ] Cards have rounded corners (28px)
- [ ] Each card displays:
  - [ ] Gradient icon container (56x56px)
  - [ ] Category icon (white, centered)
  - [ ] Category name (bold, dark text in light mode)
  - [ ] Frequency count subtitle
  - [ ] Arrow button (right side)
- [ ] Cards have gradient backgrounds
- [ ] Cards have colored borders
- [ ] Cards have shadows matching category color
- [ ] Arrow button has semi-transparent background

#### Interactions
- [ ] Tapping card navigates to category detail
- [ ] Press opacity animation (0.85)
- [ ] Smooth transitions between screens

---

### 6. Theme Consistency ✓

#### Light Mode
- [ ] Background: Light off-white (#F8FAFC)
- [ ] Text: Dark navy (#0F172A)
- [ ] Headers: Gradient with Primary + Secondary
- [ ] Accents: Bright primary colors visible

#### Dark Mode
- [ ] Background: Deep black (#050511)
- [ ] Text: Off-white (#FFFFFE)
- [ ] Headers: Brighter gradient (more vibrant)
- [ ] Accents: Neon colors visible
- [ ] Toggle between modes with theme button

#### Dark Mode Toggle
- [ ] Tap theme button (sun/moon) to toggle
- [ ] App immediately switches theme
- [ ] All screens update colors
- [ ] Preference persists across restarts

---

### 7. Audio Playback - Seamless Loop ✓

#### Audio Quality
- [ ] Play any frequency
- [ ] Sound is clear and continuous
- [ ] NO beep or click at loop boundary
- [ ] Sound fades in/out smoothly
- [ ] Sound maintains constant amplitude

#### Testing Different Frequencies
- [ ] 432 Hz - no artifacts
- [ ] 528 Hz - no artifacts
- [ ] 174 Hz - no artifacts
- [ ] 963 Hz - no artifacts
- [ ] High frequencies (800+) - smooth playback

---

### 8. Typography Verification ✓

#### Font Rendering
- [ ] Headings: Ubuntu Bold (57px display, 28px headline)
- [ ] Titles: Ubuntu Bold/Medium (16-22px)
- [ ] Body: Ubuntu Regular (14-16px)
- [ ] Labels: Ubuntu Medium (11-14px)

#### Text Properties
- [ ] Letter spacing appropriate (0.25-0.5px)
- [ ] Line height readable (1.2-1.5)
- [ ] Font weights consistent with spec
- [ ] Text colors high contrast

---

### 9. Performance Testing

#### Launch Time
- [ ] App launches in < 3 seconds
- [ ] No frozen screens during load
- [ ] Splash screen displays correctly

#### Scrolling Performance
- [ ] Home screen scrolls smoothly (60fps)
- [ ] Horizontal card scroll is smooth
- [ ] Category grid scroll is smooth
- [ ] No jank or stuttering

#### Memory Usage
- [ ] App doesn't crash with multiple plays
- [ ] Smooth navigation between screens
- [ ] No lag when toggling theme
- [ ] Background audio continues properly

---

### 10. Device Testing

#### Android Testing
- [ ] Test on Android 10+
- [ ] Test on Android 13+
- [ ] Landscape orientation works
- [ ] Portrait orientation default
- [ ] Status bar styling correct

#### iOS Testing (if available)
- [ ] Test on iOS 14+
- [ ] Safe area respected (notch, home indicator)
- [ ] Status bar styling correct
- [ ] Landscape orientation works

---

## Known Issues & Fixes

### Font Loading Issues
**Symptom**: Text appears in system font instead of Ubuntu
**Solution**:
```bash
npx expo start -c --go
# Clear cache with -c flag
```

### Gradient Not Showing
**Symptom**: Screens appear flat/no gradients
**Solution**:
- Check if expo-linear-gradient is installed: `npm list expo-linear-gradient`
- If not: `npm install expo-linear-gradient`

### Audio Beeping
**Symptom**: Still hearing click/beep on loop boundary
**Solution**:
- Implemented seamless looping with 8-second buffer
- Perfect phase alignment ensures no discontinuity
- Constant amplitude throughout playback

### Dark Mode Not Toggling
**Symptom**: Theme button not working
**Solution**:
- Verify theme provider wraps entire app in App.js
- Check AsyncStorage for permission errors
- Try clearing app data and reinstalling

---

## Debugging Tips

### Enable Logging
Add to any component:
```javascript
console.log('Component loaded', { theme, isDark });
```

### Theme Inspection
In App.js, add:
```javascript
const { theme, isDark } = useTheme();
console.log('Current theme:', { colors: theme.colors, isDark });
```

### Font Verification
Check loaded fonts:
```javascript
const [fontsLoaded] = useFonts({...});
console.log('Fonts loaded:', fontsLoaded);
```

### Audio Debug
In audio.js, add:
```javascript
console.log('Playing frequency:', frequency);
console.log('Buffer duration:', duration, 'seconds');
```

---

## Regression Testing

After any changes, verify:

1. **Fonts**: All text uses Ubuntu
2. **Colors**: Theme colors correct
3. **Layouts**: No overlapping elements
4. **Gradients**: All gradients display
5. **Shadows**: Elevation looks correct
6. **Audio**: No new artifacts
7. **Performance**: Still 60fps
8. **Accessibility**: Touch targets > 44px
9. **Dark Mode**: Fully functional
10. **All Screens**: Consistent design

---

## Performance Benchmarks

Target metrics:
- **Launch Time**: < 3 seconds
- **Theme Toggle**: < 100ms
- **Screen Transition**: < 200ms
- **Scroll Framerate**: 60fps
- **Memory**: < 150MB idle

---

## Deployment Checklist

Before deploying to production:

- [ ] All fonts load correctly
- [ ] All colors accurate
- [ ] No console errors/warnings
- [ ] Performance benchmarks met
- [ ] Dark mode fully tested
- [ ] Audio seamlessly looping
- [ ] All screens responsive
- [ ] Accessibility standards met
- [ ] App works offline
- [ ] Cache clearing works

---

## Support & Troubleshooting

### Common Issues

**Issue**: "Ubuntu font not found"
- Solution: Fonts load from Google Fonts CDN, check internet connection

**Issue**: "App keeps crashing"
- Solution: Run `npm install`, clear cache with `npx expo start -c --go`

**Issue**: "Gradient doesn't show on cards"
- Solution: Restart Expo with `npx expo start -c`, reinstall `expo-linear-gradient`

**Issue**: "Audio is distorted"
- Solution: Check volume level, ensure app has audio permissions

---

## Questions?

Refer to:
- **Design System**: See `DESIGN_GUIDE.md`
- **UI Changes**: See `UI_TRANSFORMATION.md`
- **Theme Code**: See `src/utils/theme.js`
- **Audio Code**: See `src/utils/audio.js`

---

## Version Info

- **Expo SDK**: 54
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Font**: Ubuntu (Google Fonts)
- **Icons**: Ionicons (v15)

Last Updated: 2024