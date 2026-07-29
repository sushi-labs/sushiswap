import { Currency } from '@sushiswap/ui'
import { EvmToken } from 'sushi/evm'
import type { LaunchpadToken } from '../types'

const SIZE_IN_PIXELS = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
} as const

export function TokenAvatar({
  token,
  size = 'md',
}: {
  token: Pick<
    LaunchpadToken,
    'address' | 'chainId' | 'decimals' | 'name' | 'symbol'
  >
  size?: 'sm' | 'md' | 'lg' | 'xl'
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
    <Currency.Icon
      disableLink
      currency={currency}
      width={pixels}
      height={pixels}
    />
  )
}
