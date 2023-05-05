'use client'

import { FC, ReactNode, useEffect } from 'react'
import { ToastContainer } from '../future/components/toast'
import { useLocalStorage, useMediaQuery } from '@sushiswap/hooks'

interface ThemeProvider {
  children: ReactNode | Array<ReactNode>
}

export enum ThemeState {
  Auto = 'Auto',
  Light = 'Light',
  Dark = 'Dark',
}

export const ThemeProvider: FC<ThemeProvider> = ({ children }) => {
  const [theme] = useLocalStorage('themePreference', ThemeState.Auto)
  const isDarkPreferred = useMediaQuery({ query: '(prefers-color-scheme: dark)' })
  const isDarkSet = theme === ThemeState.Dark

  useEffect(() => {
    const url = window.location.href
    if (url.includes('/pools') || url.includes('/swap')) {
      if (isDarkSet || (isDarkPreferred && theme === ThemeState.Auto)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkPreferred, isDarkSet, theme])

  return (
    <>
      <div id="network-check-portal" />
      {children}
      <div id="popover-portal" />
      <ToastContainer />
    </>
  )
}
