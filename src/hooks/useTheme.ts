import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../providers/store';
import { theme } from '../theme';
import { loadThemeFromStorage, saveThemeToStorage, setTheme } from '../theme/theme.slice';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode, isLoading } = useSelector((state: RootState) => state.theme);

  // Load theme from storage on hook initialization
  useEffect(() => {
    dispatch(loadThemeFromStorage());
  }, [dispatch]);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    dispatch(setTheme(newTheme));
    dispatch(saveThemeToStorage(newTheme));
  };

  const setDarkMode = (darkMode: boolean) => {
    dispatch(setTheme(darkMode));
    dispatch(saveThemeToStorage(darkMode));
  };

  // Get current theme colors
  const colors = theme[isDarkMode ? 'dark' : 'light'];
  const colorScheme = isDarkMode ? 'dark' : 'light';

  return {
    isDarkMode,
    isLoading,
    colors,
    colorScheme,
    toggleDarkMode,
    setDarkMode,
  };
};