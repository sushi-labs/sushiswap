import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { FC, memo, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { useBalances, usePrices } from '../../hooks'
import { TokenSelectorDialog } from './TokenSelectorDialog'
import { TokenSelectorOverlay } from './TokenSelectorOverlay'

export type TokenSelectorProps = {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  chainId: ChainId | undefined
  tokenMap: Record<string, Token>
  customTokenMap?: Record<string, Token>
  onClose(): void
  onSelect?(currency: Type): void
  onAddToken?(token: Token): void
  onRemoveToken?({ chainId, address }: { chainId: ChainId; address: string }): void
  fundSource?: FundSource
  includeNative?: boolean
}

export const TokenSelector: FC<TokenSelectorProps> = memo(
  ({
    variant,
    tokenMap,
    chainId,
    fundSource = FundSource.WALLET,
    onSelect,
    open,
    customTokenMap = {},
    includeNative,
    ...props
  }) => {
    const { address } = useAccount()
    const isMounted = useIsMounted()

    const _tokenMap: Record<string, Token> = useMemo(
      () => ({ ...tokenMap, ...customTokenMap }),
      [tokenMap, customTokenMap]
    )

    const _tokenMapValues = useMemo(() => {
      // Optimism token list is dumb, have to remove random weird addresses
      delete _tokenMap['0x0000000000000000000000000000000000000000']
      delete _tokenMap['0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000']
      return Object.values(_tokenMap)
    }, [_tokenMap])

    const { data: balances } = useBalances({
      account: address,
      chainId,
      currencies: _tokenMapValues,
      loadBentobox: false,
      enabled: open,
    })

    const { data: pricesMap } = usePrices({ chainId })

    return useMemo(() => {
      if (!isMounted) return <></>

      if (variant === 'overlay') {
        return (
          <TokenSelectorOverlay
            open={open}
            account={address}
            balancesMap={balances}
            tokenMap={_tokenMap}
            pricesMap={pricesMap}
            chainId={chainId}
            fundSource={fundSource}
            onSelect={onSelect}
            includeNative={includeNative}
            {...props}
          />
        )
      }

      return (
        <TokenSelectorDialog
          open={open}
          account={address}
          balancesMap={balances}
          tokenMap={_tokenMap}
          pricesMap={pricesMap}
          chainId={chainId}
          fundSource={fundSource}
          onSelect={onSelect}
          includeNative={includeNative}
          {...props}
        />
      )
    }, [_tokenMap, address, balances, chainId, fundSource, isMounted, onSelect, open, pricesMap, props, variant])
  },
  (prevProps, nextProps) => {
    return (
      prevProps.variant === nextProps.variant &&
      prevProps.currency === nextProps.currency &&
      prevProps.open === nextProps.open &&
      prevProps.tokenMap === nextProps.tokenMap &&
      prevProps.customTokenMap === nextProps.customTokenMap &&
      prevProps.fundSource === nextProps.fundSource
    )
  }
)
