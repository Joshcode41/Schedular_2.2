import { useTheme, type Theme, type ColorTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { Moon, Sun, Monitor, Palette, Check } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, colorTheme, setTheme, setColorTheme, isDark } = useTheme();

  const themes: Theme[] = ['light', 'dark', 'system'];
  const colors: ColorTheme[] = ['blue', 'purple', 'green', 'rose', 'amber', 'slate'];

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  const getColorCircle = (color: ColorTheme) => {
    const colorMap: Record<ColorTheme, string> = {
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      green: 'bg-green-600',
      rose: 'bg-rose-600',
      amber: 'bg-amber-600',
      slate: 'bg-slate-600',
    };
    return colorMap[color];
  };

  return (
    <DropdownMenu>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 hover:bg-gray-100 dark:hover:bg-slate-800"
        title={`Theme: ${getThemeLabel()} | Color: ${colorTheme}`}
      >
        <div className="flex items-center gap-2">
          {getThemeIcon()}
          <div className={`w-3 h-3 rounded-full ${getColorCircle(colorTheme)}`} />
        </div>
        <span className="hidden sm:inline text-xs font-medium">{getThemeLabel()}</span>
      </Button>

      <DropdownMenuContent align="end" className="w-64 shadow-lg">
        <div className="px-2 py-3">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Customize Theme
          </h3>
        </div>

        <DropdownMenuSeparator />

        {/* Theme Mode Section */}
        <div className="px-2 py-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Theme Mode
          </p>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`relative p-2 rounded-lg border-2 transition-all text-center ${
                  theme === t
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                title={`Switch to ${t} theme`}
              >
                <div className="flex justify-center mb-1">
                  {t === 'light' && <Sun className="w-5 h-5 text-yellow-500" />}
                  {t === 'dark' && <Moon className="w-5 h-5 text-slate-600" />}
                  {t === 'system' && <Monitor className="w-5 h-5 text-gray-600" />}
                </div>
                <p className="text-xs font-medium capitalize">{t}</p>
                {theme === t && (
                  <Check className="absolute top-1 right-1 w-3 h-3 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Color Theme Section */}
        <div className="px-2 py-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Color Theme
          </p>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setColorTheme(color)}
                className={`relative p-3 rounded-lg border-2 transition-all text-center group ${
                  colorTheme === color
                    ? 'border-gray-400 dark:border-gray-500 scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                title={`Switch to ${color} theme`}
              >
                <div className={`w-full h-6 rounded ${getColorCircle(color)} group-hover:shadow-lg transition-shadow`} />
                <p className="text-xs font-medium capitalize mt-1">{color}</p>
                {colorTheme === color && (
                  <Check className="absolute top-1 right-1 w-3 h-3 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Preview */}
        <div className="px-3 py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Current: <span className="font-semibold capitalize">{theme}</span> mode with{' '}
            <span className="font-semibold capitalize">{colorTheme}</span> theme
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
