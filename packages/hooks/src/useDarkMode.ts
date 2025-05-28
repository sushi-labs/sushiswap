import { useEffect, useState } from 'react'

export const useDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const html = document.documentElement
    const hasClass = html.classList.contains('dark')
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    return hasClass || prefersDark
  })

  useEffect(() => {
    const html = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateDark = () => {
      const hasClass = html.classList.contains('dark')
      const prefersDark = mediaQuery.matches
      setIsDark(hasClass || prefersDark)
    }

    mediaQuery.addEventListener('change', updateDark)

    const observer = new MutationObserver(updateDark)
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      mediaQuery.removeEventListener('change', updateDark)
      observer.disconnect()
    }
  }, [])

  return isDark
}
