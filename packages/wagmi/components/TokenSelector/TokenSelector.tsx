import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { FC, useMemo } from 'react'

import { TokenSelectorDialog } from './TokenSelectorDialog'
import { TokenSelectorOverlay } from './TokenSelectorOverlay'

export type TokenSelectorProps = {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  chainId?: ChainId
  tokenMap: Record<string, Token>
  customTokenMap: Record<string, Token>
  onClose(): void
  onSelect(currency: Type): void
  onAddToken(token: Token): void
  onRemoveToken({ chainId, address }: { chainId: ChainId; address: string }): void
}

export const TokenSelector: FC<TokenSelectorProps> = ({ variant, tokenMap, ...props }) => {
  const _tokenMap = useMemo(() => ({ ...tokenMap, ...props.customTokenMap }), [tokenMap, props.customTokenMap])

  if (variant === 'overlay') return <TokenSelectorOverlay tokenMap={_tokenMap} {...props} />
  return <TokenSelectorDialog tokenMap={_tokenMap} {...props} />
}
