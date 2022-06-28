import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useBalances } from '../../hooks/useBalance'
import { usePrices } from '../../hooks/usePrices'
import { TokenSelectorDialog } from './TokenSelectorDialog'
import { TokenSelectorOverlay } from './TokenSelectorOverlay'

export type TokenSelectorProps = {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  chainId: ChainId | undefined
  tokenMap: Record<string, Token>
  customTokenMap: Record<string, Token>
  onClose(): void
  onSelect(currency: Type): void
  onAddToken(token: Token): void
  onRemoveToken({ chainId, address }: { chainId: ChainId; address: string }): void
  fundSource?: FundSource
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  variant,
  tokenMap,
  chainId,
  fundSource = FundSource.WALLET,
  ...props
}) => {
  const { address } = useAccount()
  const _tokenMap: Record<string, Token> = useMemo(
    () => ({ ...tokenMap, ...props.customTokenMap }),
    [tokenMap, props.customTokenMap]
  )

  const { data: balances } = useBalances({
    account: address,
    chainId,
    tokens: Object.values(_tokenMap),
    fundSource,
  })

  const { data: pricesMap } = usePrices({ chainId })

  if (variant === 'overlay') {
    return (
      <TokenSelectorOverlay
        balancesMap={balances}
        tokenMap={_tokenMap}
        pricesMap={pricesMap}
        chainId={chainId}
        {...props}
      />
    )
  }

  return (
    <TokenSelectorDialog
      balancesMap={balances}
      tokenMap={_tokenMap}
      pricesMap={pricesMap}
      chainId={chainId}
      {...props}
    />
  )
}
