import { Currency } from '@sushiswap/ui'
import { UnknownTokenIcon } from '@sushiswap/ui/icons/unknown-token-icon'
import type { ReactElement } from 'react'

interface PositionToken {
  logoUrl: string | null
  symbol: string | null
}

function renderTokenIcon({ logoUrl, symbol }: PositionToken) {
  return logoUrl ? (
    <img className="rounded-full" src={logoUrl} alt={symbol ?? ''} />
  ) : (
    <UnknownTokenIcon aria-hidden="true" />
  )
}

export function PortfolioPositionTokenIcons({
  token0,
  token1,
}: {
  token0: PositionToken
  token1: PositionToken
}): ReactElement {
  return (
    <Currency.IconList iconWidth={24} iconHeight={24}>
      {renderTokenIcon(token0)}
      {renderTokenIcon(token1)}
    </Currency.IconList>
  )
}
