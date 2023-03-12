import { AppType } from './types'
import {MaxWidth} from "./future/components/Container";
export const HEADER_HEIGHT = 56

export const APP_TYPE_LINKS = {
  [AppType.Root]: '/',
  [AppType.Legacy]: '/',
  [AppType.Blog]: '/blog',
  [AppType.Bridge]: '/bridge',
  [AppType.Swap]: '/swap',
  [AppType.xSwap]: '/xswap',
  [AppType.Furo]: '/furo',
  [AppType.Internal]: '/internal',
  [AppType.Kashi]: '/kashi',
  [AppType.Analytics]: '/analytics',
  [AppType.Earn]: '/earn',
  [AppType.Partner]: '/partner',
  [AppType.Widget]: '/widget',
  [AppType.Academy]: '/academy',
}
export const TailwindMapper: Record<MaxWidth, string> = {
  full: 'max-w-full',
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
  '4xl': 'max-w-4xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  xl: 'max-w-xl',
  lg: 'max-w-lg',
  md: 'max-w-md',
  sm: 'max-w-sm',
  xs: 'max-w-xs',
}

