import { isAddress } from '@ethersproject/address'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChainId, chainName } from '@sushiswap/chain'
import { Native, Token, Type } from '@sushiswap/currency'
import { useCustomTokens, usePinnedTokens } from '@sushiswap/hooks'
import { useBalances, usePrices, useTokens } from '@sushiswap/react-query'
import { IconButton } from '@sushiswap/ui'
import { TextField } from '@sushiswap/ui'
import { SlideIn } from '@sushiswap/ui/components/animation'
import { Button, buttonIconVariants } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Dialog } from '@sushiswap/ui/components/dialog'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { List } from '@sushiswap/ui/components/list/List'
import { SkeletonCircle, SkeletonText } from '@sushiswap/ui/components/skeleton'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { useTokenWithCache } from '../../hooks'
import { useSortedTokenList } from './hooks/useSortedTokenList'
import { TokenSelectorCurrencyList } from './TokenSelectorCurrencyList'
import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'

interface TokenSelectorProps {
  id: string
  selected: Type | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  children({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
  currencies?: Record<string, Token>
  includeNative?: boolean
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  includeNative = true,
  id,
  selected,
  onSelect,
  chainId,
  children,
  currencies,
}) => {
  const { address } = useAccount()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const handleClose = useCallback(() => setOpen(false), [])

  const { data: customTokenMap, mutate: customTokenMutate } = useCustomTokens()
  const { data: pinnedTokenMap, mutate: pinnedTokenMutate, hasToken: isTokenPinned } = usePinnedTokens()
  const { data: tokenMap } = useTokens({ chainId })
  const { data: pricesMap } = usePrices({ chainId })
  const { data: balancesMap } = useBalances({ chainId, account: address })

  const { data: queryToken, isInitialLoading: isQueryTokenLoading } = useTokenWithCache({
    chainId,
    address: query,
    withStatus: false,
    enabled: isAddress(query),
    keepPreviousData: false,
  })

  const { data: sortedTokenList } = useSortedTokenList({
    query,
    customTokenMap: currencies ? {} : customTokenMap,
    tokenMap: currencies ? currencies : tokenMap,
    pricesMap,
    balancesMap,
    chainId,
    includeNative,
  })

  const pinnedTokens = useMemo(() => {
    return pinnedTokenMap[chainId]
      .map((id) => {
        const [, address] = id.split(':')
        if (address === 'NATIVE') return Native.onChain(chainId)
        return tokenMap?.[address] || customTokenMap?.[address]
      })
      .filter((token): token is Token => !!token)
  }, [pinnedTokenMap, tokenMap])

  const _onSelect = useCallback(
    (currency: Type) => {
      if (onSelect) {
        onSelect(currency)
      }

      setOpen(false)
    },
    [onSelect]
  )

  const _onPin = useCallback((currencyId: string) => {
    console.log('onPin', currencyId, isTokenPinned(currencyId))
    if (isTokenPinned(currencyId)) {
      pinnedTokenMutate('remove', currencyId)
    } else {
      pinnedTokenMutate('add', currencyId)
    }
  }, [])

  const handleImport = useCallback(
    (currency: Token) => {
      customTokenMutate('add', [currency])
      _onSelect(currency)
    },
    [_onSelect, customTokenMutate]
  )

  return (
    <>
      {children({ open, setOpen })}
      <Dialog open={open} onClose={handleClose} unmount={false}>
        <Dialog.Content className="flex flex-col gap-3 !pb-1 min-h-[75vh] sm:min-h-[60vh] px-4 sm:!rounded-[24px]">
          <SlideIn>
            <div className="flex justify-between py-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">Tokens</span>
              <TokenSelectorCustomTokensOverlay />
            </div>
            <div className="flex gap-2">
              <TextField
                placeholder="Search by token or address"
                icon={MagnifyingGlassIcon}
                type="text"
                testdata-id={`${id}-address-input`}
                value={query}
                onValueChange={setQuery}
              />
            </div>

            {pinnedTokens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pinnedTokens.map((token) => (
                  <div key={token.id} className="group">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="group"
                      key={token.id}
                      onClick={() => _onSelect(token)}
                    >
                      <Currency.Icon
                        width={20}
                        height={20}
                        className={buttonIconVariants({ size: 'default' })}
                        currency={token}
                        disableLink
                      />
                      {token.symbol}
                      <IconButton
                        size="xs"
                        name="remove"
                        icon={XMarkIcon}
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          _onPin(token.id)
                        }}
                      />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            <List.Control className="relative flex flex-col flex-grow gap-3 p-1">
              {isQueryTokenLoading ? (
                <div className="py-0.5 h-[64px] -mb-3">
                  <div className="flex items-center w-full h-full px-3 rounded-lg">
                    <div className="flex items-center justify-between flex-grow gap-2 rounded">
                      <div className="flex flex-row items-center flex-grow gap-4">
                        <SkeletonCircle radius={40} />
                        <div className="flex flex-col items-start">
                          <SkeletonText className="w-full bg-gray-300 w-[100px]" />
                          <SkeletonText fontSize="sm" className="w-full bg-gray-100 w-[60px]" />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <SkeletonText className="bg-gray-300 w-[80px]" />
                        <SkeletonText fontSize="sm" align="right" className="bg-gray-200 w-[40px]" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {queryToken &&
                    !customTokenMap[`${queryToken.chainId}:${queryToken.wrapped.address}`] &&
                    !tokenMap?.[`${queryToken.wrapped.address}`] && (
                      <TokenSelectorImportRow
                        currencies={[queryToken]}
                        onImport={() => queryToken && handleImport(queryToken)}
                      />
                    )}
                  <TokenSelectorCurrencyList
                    selected={selected}
                    onSelect={_onSelect}
                    id={id}
                    pin={{ onPin: _onPin, isPinned: isTokenPinned }}
                    currencies={sortedTokenList}
                    chainId={chainId}
                  />
                  {sortedTokenList?.length === 0 && !queryToken && chainId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="flex items-center text-xs text-gray-500 dark:text-slate-500">
                          No tokens found on <NetworkIcon type="naked" width={20} height={20} chainId={chainId} />{' '}
                          <span className="font-medium">{chainName[chainId]}</span>.
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-500">
                          Did you try searching with the token address?
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </List.Control>
          </SlideIn>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
