import { Currency, classNames } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { EvmToken } from 'sushi/evm'
import type { LaunchpadToken } from '../types'

const SIZE_IN_PIXELS = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
  '2xl': 96,
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
    <span className="relative inline-flex shrink-0">
      <Currency.Icon
        disableLink
        currency={currency}
        width={pixels}
        height={pixels}
      />
      {badge ? (
        <span className={classNames('absolute -bottom-0.5 -right-0.5')}>
          {badge}
        </span>
      ) : null}
    </span>
  )
}
