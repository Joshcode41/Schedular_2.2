# Theme & Dark Mode Setup Guide

## Overview
The Scheduler app includes a complete theme system with:
- **Light/Dark/System modes** - Global theme switching with system preference detection
- **6 Color Themes** - Blue, Purple, Green, Rose, Amber, Slate
- **Persistent Storage** - Theme preferences saved to localStorage
- **Dark Mode Toggle** - Quick switch component for individual pages

---

## Components

### 1. ThemeSwitcher (Global)
**Location:** `src/app/components/ThemeSwitcher.tsx`

Full-featured theme switcher with all options. Used in the header.

**Features:**
- Theme mode selection (Light/Dark/System)
- Color theme selection with visual preview
- Current selection indicator
- Tooltip with current theme info

**Usage:**
```tsx
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';

export function MyComponent() {
  return (
    <div>
      <ThemeSwitcher />
    </div>
  );
}
```

---

### 2. DarkModeToggle (Page-level)
**Location:** `src/app/components/DarkModeToggle.tsx`

Simple dark/light mode toggle for quick switching on individual pages.

**Props:**
```typescript
interface DarkModeToggleProps {
  showLabel?: boolean;    // Show "Light" or "Dark" text (default: false)
  size?: 'sm' | 'md' | 'lg';  // Button size (default: 'md')
  variant?: 'default' | 'outline' | 'ghost';  // Button style (default: 'outline')
}
```

**Usage Examples:**

```tsx
import { DarkModeToggle } from '@/app/components/DarkModeToggle';

// Minimal icon button
<DarkModeToggle />

// With label text
<DarkModeToggle showLabel />

// Large button in hero section
<DarkModeToggle size="lg" showLabel variant="default" />

// Small icon in navbar
<DarkModeToggle size="sm" variant="ghost" />
```

---

## Using the Theme Hook

### useTheme() Hook
Access theme context anywhere in your component.

```typescript
import { useTheme } from '@/app/context/ThemeContext';

export function MyComponent() {
  const { theme, colorTheme, setTheme, setColorTheme, isDark } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Color: {colorTheme}</p>
      <p>Is dark? {isDark ? 'Yes' : 'No'}</p>
      
      <button onClick={() => setTheme('dark')}>
        Enable Dark Mode
      </button>
    </div>
  );
}
```

---

## Adding Dark Mode Toggle to Pages

### Example 1: Dashboard Page
```tsx
import { DarkModeToggle } from '../../components/DarkModeToggle';

export function Dashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DarkModeToggle showLabel />
      </div>
      {/* Page content */}
    </div>
  );
}
```

### Example 2: Login Page
```tsx
import { DarkModeToggle } from '../../components/DarkModeToggle';

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <DarkModeToggle size="lg" showLabel variant="outline" />
      </div>
      {/* Login form */}
    </div>
  );
}
```

### Example 3: Settings/Profile Page
```tsx
import { DarkModeToggle } from '../../components/DarkModeToggle';
import { useTheme } from '../../context/ThemeContext';

export function SettingsPage() {
  const { theme, colorTheme, setColorTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Quick Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <h3 className="font-semibold">Dark Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Toggle light/dark theme</p>
          </div>
          <DarkModeToggle showLabel />
        </div>

        {/* Color Theme Selection */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="font-semibold mb-4">Color Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            {['blue', 'purple', 'green', 'rose', 'amber', 'slate'].map(color => (
              <button
                key={color}
                onClick={() => setColorTheme(color as any)}
                className={`p-3 rounded capitalize font-medium transition-all ${
                  colorTheme === color 
                    ? 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Theme Types

### Theme Mode
```typescript
type Theme = 'light' | 'dark' | 'system';
```

- **light**: Always use light theme
- **dark**: Always use dark theme  
- **system**: Follow system color scheme preference

### Color Themes
```typescript
type ColorTheme = 'blue' | 'purple' | 'green' | 'rose' | 'amber' | 'slate';
```

---

## CSS Classes

The dark mode is applied via the `.dark` class on the `<html>` element.

**Light Mode Styling:**
```css
/* Default (light) variables */
--background: #ffffff;
--foreground: #1a1a2e;
```

**Dark Mode Styling:**
```css
/* Applied when .dark class is on html element */
.dark {
  --background: #1a1a2e;
  --foreground: #f5f5f5;
}
```

**Using in Components:**
```tsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content that changes in dark mode
</div>
```

---

## Storage

Theme preferences are persisted in localStorage:
- `theme` - Current theme mode ('light', 'dark', 'system')
- `colorTheme` - Current color theme name

---

## Best Practices

1. **Place DarkModeToggle near the top** of page-specific sections for easy access
2. **Use `showLabel`** on mobile/tablet layouts for clarity
3. **Combine with ThemeSwitcher** for color customization in settings
4. **Test both modes** to ensure proper contrast and readability
5. **Use semantic classes** like `dark:` prefix for dark mode styles

---

## Testing Checklist

- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] System mode follows device preference
- [ ] All 6 color themes render properly
- [ ] Toggle switches themes instantly
- [ ] Theme persists after page refresh
- [ ] Dark mode toggle works on all pages
- [ ] Contrast meets WCAG AA standards

