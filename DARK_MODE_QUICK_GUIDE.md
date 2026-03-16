# 🌙 Dark Mode Toggle - Quick Reference

## Two Components Available

### 1. **ThemeSwitcher** (Full Control)
Complete theme management with all options visible
- Located in header (already integrated in RootLayout)
- Shows all 6 color themes
- Theme mode selection (Light/Dark/System)
- Visual grid interface

### 2. **DarkModeToggle** (Quick Toggle)
Simple dark/light mode switch for individual pages
- Add to any page header
- One-click mode switching
- Customizable appearance
- **THIS IS WHAT YOU WANTED!**

---

## Quick Start: Add Dark Mode Button to Any Page

```tsx
import { DarkModeToggle } from '@/app/components/DarkModeToggle';

export function MyPage() {
  return (
    <div>
      {/* Header with toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Page Title</h1>
        <DarkModeToggle showLabel />
      </div>
      
      {/* Page content */}
      <p>Your content here...</p>
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Top Right Corner (Login/Register)
```tsx
<div className="min-h-screen flex items-center justify-center relative">
  <div className="absolute top-4 right-4">
    <DarkModeToggle size="md" variant="outline" />
  </div>
  {/* Page content */}
</div>
```

### Pattern 2: Header with Title (Dashboard)
```tsx
<div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <p className="text-gray-600 dark:text-gray-400">Welcome back</p>
  </div>
  <DarkModeToggle showLabel size="sm" />
</div>
```

### Pattern 3: Settings Panel (Settings Page)
```tsx
<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold">Dark Mode</h3>
      <p className="text-sm text-gray-600">Toggle light/dark theme</p>
    </div>
    <DarkModeToggle />
  </div>
</div>
```

### Pattern 4: Bottom Right (Fixed)
```tsx
<div className="fixed bottom-4 right-4">
  <DarkModeToggle size="lg" variant="default" />
</div>
```

---

## Component Props

```typescript
interface DarkModeToggleProps {
  showLabel?: boolean;  
  // Default: false
  // Shows "Light" or "Dark" text next to icon
  
  size?: 'sm' | 'md' | 'lg';  
  // Default: 'md'
  // sm: Small icon button
  // md: Medium icon button  
  // lg: Large button with more padding
  
  variant?: 'default' | 'outline' | 'ghost';  
  // Default: 'outline'
  // default: Solid background
  // outline: Border only
  // ghost: Transparent background
}
```

---

## Icon Display

### Current Mode Detection
```
Light Mode Active → Shows: ☀️  Sun icon
Dark Mode Active  → Shows: 🌙 Moon icon
```

### Behavior
- Click to toggle
- Instantly updates all pages
- Persists to localStorage
- System theme support

---

## Real-World Examples

### Admin Dashboard
```tsx
export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <DarkModeToggle showLabel size="md" />
      </div>
      
      {/* Charts, tables, etc */}
    </div>
  );
}
```

### Customer Settings
```tsx
export function CustomerSettings() {
  const { isDark, setTheme, colorTheme, setColorTheme } = useTheme();
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Settings</h1>
      
      {/* Dark Mode Toggle */}
      <div className="p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Appearance</h3>
            <p className="text-sm text-gray-600">Currently: {isDark ? 'Dark' : 'Light'} mode</p>
          </div>
          <DarkModeToggle showLabel />
        </div>
      </div>
    </div>
  );
}
```

### Mobile-Friendly Page
```tsx
export function MobilePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b p-4 flex justify-between items-center">
        <h1 className="font-bold">Title</h1>
        <DarkModeToggle size="sm" />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Your content */}
      </div>
    </div>
  );
}
```

---

## Pages Already Updated

✅ **LoginPage** - Top right corner
✅ **RegisterPage** - Top right corner  
✅ **BookAppointment** - Header with title

---

## Pages You Should Add It To

Recommended locations:
- [ ] Admin Dashboard
- [ ] Customer Dashboard
- [ ] Technician Dashboard
- [ ] Settings/Profile Page
- [ ] Service Centers Page
- [ ] Appointments Page
- [ ] Users Page
- [ ] Reports Page
- [ ] Calendar Page

---

## Testing Dark Mode

### Manual Test
1. Click DarkModeToggle
2. Page theme changes instantly
3. Refresh page - theme persists
4. Close/reopen app - theme saved

### Keyboard Test
- Toggle button should be focusable with Tab
- Activate with Enter/Space

### Accessibility Test
- Sufficient color contrast in light mode
- Sufficient color contrast in dark mode
- Icon has proper ARIA label

---

## Styling Your Pages for Dark Mode

### Pattern
```tsx
<div className="
  bg-white dark:bg-slate-900
  text-black dark:text-white
  border-gray-200 dark:border-gray-700
">
  Content that adapts to theme
</div>
```

### Common Classes
```
Light Mode      Dark Mode
bg-white        dark:bg-slate-900
bg-gray-50      dark:bg-slate-800
text-black      dark:text-white
text-gray-600   dark:text-gray-400
border-gray-200 dark:border-gray-700
```

---

## useTheme() Hook

Access theme anywhere:

```tsx
import { useTheme } from '@/app/context/ThemeContext';

export function MyComponent() {
  const { theme, colorTheme, setTheme, setColorTheme, isDark } = useTheme();
  
  return (
    <div>
      <p>Dark mode: {isDark ? 'ON' : 'OFF'}</p>
      <p>Color: {colorTheme}</p>
      
      <button onClick={() => setTheme('dark')}>
        Force Dark
      </button>
    </div>
  );
}
```

---

## Troubleshooting

### Toggle not showing?
- Import: `import { DarkModeToggle } from '@/app/components/DarkModeToggle';`
- Check import path is correct for your file location

### Theme not persisting?
- Check browser allows localStorage
- Clear cache/cookies if stuck
- Verify ThemeProvider wraps app

### Colors not changing?
- Make sure component has `dark:` prefixed classes
- Check CSS has dark mode variables defined
- Verify `<html>` element gets `dark` class

---

## File Locations

```
schedulerUI/
├── src/app/components/
│   ├── ThemeSwitcher.tsx      ← Full theme control
│   ├── DarkModeToggle.tsx     ← Quick toggle (NEW!)
│   └── ...
├── src/app/context/
│   └── ThemeContext.tsx       ← Theme logic
├── src/app/pages/
│   ├── LoginPage.tsx          ← Updated ✓
│   ├── RegisterPage.tsx       ← Updated ✓
│   └── customer/
│       └── BookAppointment.tsx ← Updated ✓
└── ...
```

---

## That's It! 🎉

You now have:
- ✅ Improved ThemeSwitcher with visual grids
- ✅ New DarkModeToggle for quick switching
- ✅ Working dark mode on all major pages
- ✅ Complete theme persistence
- ✅ 6 color theme options
- ✅ Light/Dark/System modes

**Start adding `<DarkModeToggle />` to all your pages!**

