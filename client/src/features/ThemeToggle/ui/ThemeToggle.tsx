import { useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon/ui/Icon';
import SunIcon from '@shared/assets/icons/sun2.svg';
import MoonIcon from '@shared/assets/icons/moon.svg';
import { LOCAL_STORAGE_THEME_KEY } from '@/shared/const/localstorage';
import { useLocalStorage } from '@/shared/lib/hooks/useLocalStorage/useLocalStorage';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

interface ThemeToggleProps { className?: string }

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [theme, setTheme] = useLocalStorage<Theme>(LOCAL_STORAGE_THEME_KEY, getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isLight = theme === 'light';

  return (
    <Button
      theme="clear"
      className={className}
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
    >
      <Icon Svg={isLight ? MoonIcon : SunIcon} width={30} height={30} />
    </Button>
  );
};
