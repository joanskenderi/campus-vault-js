import { useEffect } from 'react';

import { useLocalStorage } from './useLocalStorage';

export const useColorTheme = () => {
  const [colorTheme, setColorTheme] = useLocalStorage('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const bodyClass = document.documentElement;

    if (colorTheme === 'dark') {
      bodyClass.classList.add(className);
    } else {
      bodyClass.classList.remove(className);
    }
  }, [colorTheme]);

  return [colorTheme, setColorTheme];
};
