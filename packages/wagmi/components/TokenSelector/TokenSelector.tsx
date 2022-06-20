import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { FC } from 'react'

import { TokenSelectorDialog } from './TokenSelectorDialog'
import { TokenSelectorOverlay } from './TokenSelectorOverlay'

export type TokenSelectorProps = {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  chainId?: ChainId
  tokenMap: Record<string, Token>
  onClose(): void
  onSelect(currency: Type): void
}

export const TokenSelector: FC<TokenSelectorProps> = ({ variant, ...props }) => {
  if (variant === 'overlay') return <TokenSelectorOverlay {...props} />
  return <TokenSelectorDialog {...props} />
}
