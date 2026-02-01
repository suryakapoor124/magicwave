# MagicWave Design Guide

## Visual Design Philosophy
"Control yourself from within" - An immersive, modern experience that makes sound control feel intuitive and empowering.

---

## Color System

### Light Mode
```
Primary:           #6246EA (Electric Indigo)
Secondary:         #00B4D8 (Cyan)
Tertiary:          #F72585 (Neon Pink)
Background:        #F8FAFC (Off-white)
Surface:           #FFFFFF (Pure White)
OnSurface:         #0F172A (Dark Navy)
OnSurfaceVariant:  #64748B (Slate Gray)
```

### Dark Mode
```
Primary:           #7F5AF0 (Neon Purple)
Secondary:         #2CB67D (Neon Green)
Tertiary:          #F72585 (Neon Pink)
Background:        #050511 (Deep Space Black)
Surface:           #16161A (Dark Gunmetal)
OnSurface:         #FFFFFE (Pure White)
OnSurfaceVariant:  #94A1B2 (Light Gray)
```

### Category Colors (Examples)
- **Chill Vibes**: Cool blues and cyans
- **Healing**: Warm golds and oranges
- **Sleep**: Deep purples and blues
- **Energy**: Bright greens and yellows
- **Focus**: Electric purples and indigos

---

## Typography System

### Font Family
**Ubuntu** - Premium, modern, and highly readable
- Ubuntu Light (300): Subtle backgrounds, disabled states
- Ubuntu Regular (400): Body text, descriptions
- Ubuntu Medium (500): Labels, buttons, navigation
- Ubuntu Bold (700): Titles, headlines, emphasis

### Type Scale

| Component | Size | Weight | Letter Spacing | Usage |
|-----------|------|--------|-----------------|-------|
| Display Large | 57px | Bold | -0.25 | Hero titles |
| Display Medium | 45px | Bold | 0 | Large sections |
| Headline Large | 32px | Bold | 0 | Page titles |
| Headline Medium | 28px | Bold | 0 | Section headers |
| Title Large | 22px | Bold | 0 | Card titles |
| Title Medium | 16px | Medium | 0.15 | Subheadings |
| Body Large | 16px | Regular | 0.5 | Main content |
| Body Medium | 14px | Regular | 0.25 | Secondary content |
| Label Large | 14px | Medium | 0.1 | Buttons |
| Label Medium | 12px | Medium | 0.5 | Small labels |

---

## Component Specifications

### Headers
```
Height:            80-100px (including padding)
Padding:           20px horizontal, 24px vertical (top)
Border Radius:     32px bottom corners
Background:        Gradient overlay (Primary + Secondary)
Shadow:            None (gradient creates depth)
Status Bar:        Transparent, translucent
```

**Gradient Pattern**: 
- Light Mode: Primary (20% opacity) → Secondary (10% opacity)
- Dark Mode: Primary (30% opacity) → Secondary (20% opacity)

### Frequency Cards
```
Dimensions:        Full width minus gutters, min 240px height
Border Radius:     28px
Padding:           16px
Background:        Gradient (category color based)
Border Width:      1px (inactive), 2px (active)
Shadow:            8px elevation (6-8px blur)
Icon Container:    76x76px, 38px radius
```

**Playing State**:
- Border: 2px, category color
- Shadow: Color-matched (category color, 0.4 opacity)
- Gradient: Lighter, more vibrant

**Inactive State**:
- Border: 1px, outline + 15% opacity
- Shadow: Black, 0.08 opacity
- Gradient: Subtle, muted

### Buttons
```
Primary Button:
  - Size:        88x88px (large play button)
  - Radius:      44px
  - Color:       Category color
  - Shadow:      Elevated with category color
  - Active:      Press opacity 0.85

Secondary Button:
  - Size:        44-64px (various)
  - Radius:      22-32px
  - Color:       Surface container
  - Border:      1px outline + 15% opacity
  - Active:      Press opacity 0.7

Icon Button:
  - Size:        32-48px
  - Radius:      16-24px
  - Color:       Surface container
  - Icon Color:  Primary or category
```

### Category Badges
```
Padding:           12px horizontal, 5px vertical
Border Radius:     14px
Background:        Category color + 20% opacity
Text Color:        Category color (full opacity)
Font:              Ubuntu Bold, 9px
Letter Spacing:    0.6px
Transform:         Uppercase
```

### Progress Bars
```
Height:            6px
Radius:            3px
Background:        Surface container (full)
Fill:              Gradient (category color)
Animation:         Smooth linear update
```

### Modals & Overlays
```
Background:        Black, 70% opacity
Border Radius:     24-28px
Padding:           24px
Shadow:            16px blur, 0.2 opacity
Animation Speed:   300ms ease-out
```

---

## Spacing System

### Padding & Margins
```
XS:  4px      (micro spacing)
SM:  8px      (buttons, small gaps)
MD:  16px     (card padding, sections)
LG:  20px     (screen padding)
XL:  24px     (large gaps, sections)
XXL: 32px     (headers, major sections)
```

### Gutters
```
Horizontal:        20px screen padding
Between Cards:     12-16px
Card Internal:     16px padding
List Items:        20px padding
```

---

## Shadow System

### Elevation Levels
```
Level 0:  No shadow (elevation: 0)
Level 1:  Small (4px blur, 0.05 opacity)
Level 2:  Medium (8px blur, 0.08 opacity)
Level 3:  Large (12px blur, 0.12 opacity)
Level 4:  Extra (16px blur, 0.16 opacity)
Level 5:  Maximum (20px blur, 0.20 opacity)
```

### Colored Shadows
- Use category color when hovering/active
- Opacity: 0.3-0.4 (not overdone)
- Blur radius: 12-24px
- Offset: Usually 0, 4px

---

## Border Radius System

```
XS:  4px       (small elements)
SM:  8px       (input fields)
MD:  12px      (badges)
LG:  16px      (buttons)
XL:  20px      (modals)
2XL: 24px      (large cards)
3XL: 28px      (frequency cards)
4XL: 32px      (header sections)
Full: 9999px   (circles, max radius)
```

---

## Gradient Patterns

### Header Gradients
```css
/* Light Mode */
start: Primary + 20% → Secondary + 10%

/* Dark Mode */
start: Primary + 30% → Secondary + 20%
```

### Card Playing State
```css
/* Vibrant */
start: Category + 20% → Category + 8%
```

### Category Gradients
```css
/* Icon Containers */
start: Category + 25% → Category + 8%

/* Overlay */
start: Category + 20% → Category + 10%
```

---

## Interactive States

### Buttons
- **Default**: Full color/opacity
- **Pressed**: 85-90% opacity
- **Disabled**: 50% opacity, gray color
- **Focus**: Enhanced shadow

### Cards
- **Default**: Subtle shadow, muted gradient
- **Hover**: Slightly enhanced shadow
- **Playing**: Bright gradient, colored border, enhanced shadow
- **Pressed**: 88% opacity

### Touchables
- **Active Opacity**: 0.7-0.9 (varies by component)
- **Animation Duration**: 100-200ms
- **Feedback**: Immediate visual response

---

## Animations & Transitions

### Durations
```
Quick:      100-150ms (opacity, small scale)
Standard:   200-300ms (card transitions)
Slow:       400-500ms (modal open/close)
```

### Easing
- **Standard**: cubic-bezier(0.2, 0.0, 0, 1.0)
- **Emphasized**: cubic-bezier(0.2, 0.0, 0, 1.0)
- **Decelerated**: cubic-bezier(0.0, 0.0, 0.2, 1.0)
- **Accelerated**: cubic-bezier(0.4, 0.0, 1, 1.0)

---

## Accessibility

### Contrast Ratios
- Text on background: WCAG AA standard (4.5:1 minimum)
- Small text: 3:1 minimum
- Icon/graphical elements: 3:1 minimum

### Touch Targets
- Minimum: 44x44px
- Recommended: 48-56px
- Spacing: At least 8px between targets

### Typography
- Minimum font size: 11px (labels only)
- Body text: 14px minimum
- Readable line length: 40-60 characters

---

## Dark Mode Implementation

### Key Differences
1. **Backgrounds**: Much darker, but not pure black
2. **Text**: Off-white instead of dark navy
3. **Gradients**: Slightly more vibrant
4. **Shadows**: Adjusted for visibility
5. **Category Colors**: Slightly lighter/more neon

### Toggling
- Long press theme button in header
- Persists user preference to AsyncStorage
- System preference fallback

---

## Responsive Design

### Breakpoints
```
Mobile:     < 600px
Tablet:     600px - 900px
Desktop:    > 900px
```

### Grid System
- **Mobile**: 2-column frequency grid
- **Tablet**: 3-4 column
- **Desktop**: 4-6 column

### Padding Adjustments
- **Mobile**: 16-20px
- **Tablet**: 20-24px
- **Desktop**: 24-32px

---

## Icon Usage

### Icon Set
- Primary: **Ionicons** (Material Design)
- Size: 16-48px (context dependent)
- Color: Inherit from context or use primary/category color

### Common Icons
```
Play:              play
Pause:             pause
Volume High:       volume-high
Volume Low:        volume-low
Heart:             heart / heart-outline
Skip Back:         play-skip-back
Skip Forward:      play-skip-forward
Settings:          settings
Search:            search
Menu:              menu
Close:             close
Back:              chevron-back
Forward:           arrow-forward
Theme:             moon / sunny
```

---

## Quality Checklist

Before shipping UI changes:

- [ ] All text uses Ubuntu font family
- [ ] Colors match light/dark theme specifications
- [ ] Shadows are appropriate elevation levels
- [ ] Border radius follows system
- [ ] Spacing uses defined scale
- [ ] Touch targets are 44px+ minimum
- [ ] Contrast ratios meet WCAG AA
- [ ] Animations are smooth (60fps)
- [ ] No hardcoded colors (use theme)
- [ ] Responsive on all screen sizes
- [ ] Dark mode tested thoroughly
- [ ] Loading states show progress
- [ ] Error states are clear
- [ ] Empty states are friendly
- [ ] Performance optimized

---

## References

- **Design System**: Material Design 3
- **Theme**: Cosmic/Cyberpunk (custom)
- **Font**: Ubuntu (Google Fonts)
- **Icons**: Ionicons (Expo Vector Icons)
- **Colors**: Custom cosmic palette
- **Inspiration**: Modern, immersive audio apps
