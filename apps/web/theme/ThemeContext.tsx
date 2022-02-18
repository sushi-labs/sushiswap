import React, { createContext, FC, useCallback, useEffect, useState } from 'react'

export enum Theme {
  NO_PREFERENCE = 'no-preference',
  LIGHT = 'light',
  DARK = 'dark',
}

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPreference = window.localStorage.getItem('color-theme') as Theme

    if (storedPreference) {
      return storedPreference
    }

    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)')
    if (darkMedia.matches) {
      return Theme.DARK
    }

    return Theme.LIGHT
  }

  return Theme.NO_PREFERENCE
}

const ThemeContext = createContext<{ theme: Theme; setTheme(theme: Theme): void } | undefined>(undefined)

export const ThemeProvider: FC = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme())

  const rawSetTheme = useCallback((rawTheme: Theme, explicit: boolean = true) => {
    const root = window.document.documentElement
    const isDark = rawTheme === Theme.DARK

    root.classList.remove(isDark ? Theme.LIGHT : Theme.DARK)
    root.classList.add(rawTheme)

    if (explicit) {
      localStorage.setItem('color-theme', rawTheme)
    }
  }, [])

  useEffect(() => {
    rawSetTheme(theme, false)
  }, [rawSetTheme, theme])

  useEffect(() => {
    if (!!window.localStorage.getItem('color-theme')) return

    const query = window.matchMedia('(prefers-color-scheme: dark)')

    const handler = () => {
      rawSetTheme(query.matches ? Theme.DARK : Theme.LIGHT, false)
    }

    query.addEventListener('change', handler)
    return () => {
      query.removeEventListener('change', handler)
    }
  }, [rawSetTheme, theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
