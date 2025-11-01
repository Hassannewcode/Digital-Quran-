import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 
    () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
};
