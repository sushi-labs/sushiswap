import { classNames } from '@sushiswap/ui'
import {
  SUSHI_ICON_ASPECT_RATIO,
  SushiIcon,
} from '@sushiswap/ui/icons/sushi-icon'
import type { LaunchpadProvider } from '../types'

const MARK_PIXELS = {
  sm: 14,
  md: 16,
  lg: 20,
} as const

interface ProviderMarkProps {
  className?: string
  pixels: number
}

function SushiProviderMark({ className, pixels }: ProviderMarkProps) {
  return (
    <SushiIcon
      aria-hidden
      width={Math.round(pixels * SUSHI_ICON_ASPECT_RATIO)}
      height={pixels}
      className={classNames('shrink-0', className)}
    />
  )
}

function PoolsFunProviderMark({ className, pixels }: ProviderMarkProps) {
  return (
    // Source: Pools.fun profile image, with its background removed.
    <img
      src="/launchpad/pools-fun.png"
      alt=""
      aria-hidden
      width={pixels}
      height={pixels}
      loading="lazy"
      decoding="async"
      className={classNames('shrink-0 object-contain', className)}
    />
  )
}

const PROVIDER_MARKS = {
  SUSHI_V1: SushiProviderMark,
  POOLS_FUN_V1: PoolsFunProviderMark,
} as const satisfies Record<LaunchpadProvider, typeof SushiProviderMark>

export function LaunchpadProviderMark({
  provider,
  size = 'md',
  className,
}: {
  provider: LaunchpadProvider
  size?: keyof typeof MARK_PIXELS
  className?: string
}) {
  const Mark = PROVIDER_MARKS[provider]

  return <Mark pixels={MARK_PIXELS[size]} className={className} />
}
