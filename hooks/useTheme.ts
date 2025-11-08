import { useLocalStorage } from './useLocalStorage';
import { useEffect, Dispatch, SetStateAction } from 'react';
import { ThemeSetting } from '../types';

export const useTheme = (): [ThemeSetting, Dispatch<SetStateAction<ThemeSetting>>] => {
  const [themeSetting, setThemeSetting] = useLocalStorage<ThemeSetting>('theme', 'system');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Centralized function to apply the theme to the DOM
    const applyTheme = () => {
      const isDark =
        themeSetting === 'dark' ||
        (themeSetting === 'system' && mediaQuery.matches);
      
      root.classList.toggle('dark', isDark);
    };

    // Listener for when the OS theme preference changes
    const handleSystemChange = () => {
      // Only re-apply theme if the current setting is 'system'
      if (themeSetting === 'system') {
        applyTheme();
      }
    };

    applyTheme(); // Apply the theme immediately on load or when themeSetting changes

    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [themeSetting]); // Re-run this effect whenever the user's preference changes

  return [themeSetting, setThemeSetting];
};
