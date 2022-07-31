import { useMediaQuery } from '@sushiswap/hooks' // Your tailwind config

import tailwindConfig from './tailwind.js'

const breakpoints = tailwindConfig.theme.screens

export function useBreakpoint<K extends string>(breakpointKey: K) {
  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  })
  const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1)
  type Key = `is${Capitalize<K>}`
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>
}
