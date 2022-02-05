import React, { createContext, FC, useEffect, useState } from "react";
import { Theme } from "./types";

const getInitialTheme = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPreference = window.localStorage.getItem(
      "color-theme"
    ) as Theme;

    if (storedPreference === Theme.NO_PREFERENCE) {
      const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkMedia.matches) {
        return Theme.DARK;
      }

      return Theme.LIGHT;
    }

    if (typeof storedPreference === "string") {
      return storedPreference;
    }
  }

  return Theme.NO_PREFERENCE;
};

const ThemeContext = createContext<
  { theme: Theme; setTheme(theme: Theme): void } | undefined
>(undefined);

export const ThemeProvider: FC<{ initialTheme?: Theme }> = ({
  initialTheme,
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const rawSetTheme = (rawTheme: Theme, persist: boolean = true) => {
    const root = window.document.documentElement;
    const isDark = rawTheme === Theme.DARK;

    root.classList.remove(isDark ? Theme.LIGHT : Theme.DARK);
    root.classList.add(rawTheme);

    if (persist) {
      localStorage.setItem("color-theme", rawTheme);
    }
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== Theme.NO_PREFERENCE) return;

    const query = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      rawSetTheme(query.matches ? Theme.DARK : Theme.LIGHT, false);
    };

    query.addEventListener("change", handler);
    return () => {
      query.removeEventListener("change", handler);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
