'use client'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export const AutoDarkMode = () => {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== 'dark') {
      setTheme('dark')
    }
  }, [resolvedTheme, setTheme])
  return null
}
