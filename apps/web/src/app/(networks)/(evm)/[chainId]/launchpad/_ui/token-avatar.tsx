import { Currency, classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { EvmToken } from 'sushi/evm'
import type { LaunchpadToken } from '../types'

const SIZE_IN_PIXELS = {
  xs: 20,
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
  '2xl': 96,
  card: 384,
} as const

export function TokenAvatar({
  token,
  size = 'md',
  badge,
}: {
  token: Pick<
    LaunchpadToken,
    'address' | 'chainId' | 'decimals' | 'name' | 'symbol'
  >
  size?: keyof typeof SIZE_IN_PIXELS
  badge?: ReactNode
}) {
  const currency = new EvmToken({
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
  })
  const pixels = SIZE_IN_PIXELS[size]

  return (
    <span
      className={classNames('relative inline-flex shrink-0 align-top', {
        'w-full overflow-hidden rounded-xl': size === 'card',
      })}
    >
      <Currency.Icon
        disableLink
        currency={currency}
        width={pixels}
        height={pixels}
        shape={size === 'card' ? 'square' : 'circle'}
        style={
          size === 'card'
            ? { width: '100%', height: 'auto', aspectRatio: '1 / 1' }
            : undefined
        }
      />
      {badge ? (
        <span className={classNames('absolute -bottom-0.5 -right-0.5')}>
          {badge}
        </span>
      ) : null}
    </span>
  )
}
