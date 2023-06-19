
'use client'

import { useEffect, useState } from 'react';

export const useIsDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

    const onChangeEvent: (e: MediaQueryListEvent) => void = (e) => {
      const colorScheme = e.matches ? 'dark' : 'light';
      setIsDarkMode(colorScheme === 'dark');
    };

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', onChangeEvent);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', onChangeEvent);
    };
  }, []);

  return isDarkMode;
};