import { useMediaQuery } from '@sushiswap/hooks' // Your tailwind config
// Assuming defaults since we are using them, and something weird with importing tailwind here...
import defaultTheme from 'tailwindcss/defaultTheme'

export function useBreakpoint<K extends keyof typeof defaultTheme.screens>(
  breakpointKey: K,
) {
  const bool = useMediaQuery({
    query: `(min-width: ${defaultTheme.screens[breakpointKey]})`,
  })
  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1)
  type Key = `is${Capitalize<K>}`
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>
}
