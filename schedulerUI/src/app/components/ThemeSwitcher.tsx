import { useTheme, type Theme, type ColorTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, colorTheme, setTheme, setColorTheme, isDark } = useTheme();

  const themes: Theme[] = ['light', 'dark', 'system'];
  const colors: ColorTheme[] = ['blue', 'purple', 'green', 'rose', 'amber', 'slate'];

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <DropdownMenu>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        title="Theme and Color Settings"
      >
        {getThemeIcon()}
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline text-xs">Theme</span>
      </Button>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme Mode */}
        <DropdownMenuLabel className="text-xs font-normal text-gray-500 dark:text-gray-400 py-2">
          Theme Mode
        </DropdownMenuLabel>
        {themes.map((t) => (
          <DropdownMenuCheckboxItem
            key={t}
            checked={theme === t}
            onCheckedChange={() => setTheme(t)}
            className="capitalize"
          >
            {t === 'light' && <Sun className="w-4 h-4 mr-2" />}
            {t === 'dark' && <Moon className="w-4 h-4 mr-2" />}
            {t === 'system' && <Monitor className="w-4 h-4 mr-2" />}
            {t}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        {/* Color Theme */}
        <DropdownMenuLabel className="text-xs font-normal text-gray-500 dark:text-gray-400 py-2">
          Color Theme
        </DropdownMenuLabel>
        {colors.map((color) => (
          <DropdownMenuCheckboxItem
            key={color}
            checked={colorTheme === color}
            onCheckedChange={() => setColorTheme(color)}
            className="capitalize"
          >
            <div className={`w-3 h-3 rounded-full mr-2 ${getColorCircle(color)}`} />
            {color}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getColorCircle(color: ColorTheme) {
  const colors: Record<ColorTheme, string> = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
    slate: 'bg-slate-600',
  };
  return colors[color];
}
