import { ChainId, chainName } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { useBalances, usePrices, useTokens } from '@sushiswap/react-query'
import { SlideIn } from '@sushiswap/ui/components/animation'
import { Dialog } from '@sushiswap/ui/components/dialog'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { Search } from '@sushiswap/ui/components/input/Search'
import { List } from '@sushiswap/ui/components/list/List'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useState } from 'react'

import { TokenSelectorCurrencyList } from './TokenSelectorCurrencyList'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { useAccount } from 'wagmi'
import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'
import { Button } from '@sushiswap/ui/components/button'
import { SkeletonText, SkeletonCircle } from '@sushiswap/ui/components/skeleton'
import { Currency } from '@sushiswap/ui/components/currency'
import { useCustomTokens, usePinnedTokens } from '@sushiswap/hooks'
import { useSortedTokenList } from './hooks/useSortedTokenList'
import { useTokenWithCache } from '../../hooks'
import { isAddress } from '@ethersproject/address'
import { buttonIconVariants } from '@sushiswap/ui/components/button'
import { useMemo } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'

interface TokenSelectorProps {
  id: string
  selected: Type | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  children({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
  currencies?: Record<string, Token>
}

export const TokenSelector: FC<TokenSelectorProps> = ({ id, selected, onSelect, chainId, children, currencies }) => {
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
    includeNative: true,
  })

  const pinnedTokens = useMemo(() => {
    return pinnedTokenMap[chainId]
      .map((address) => {
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
              <Search id={id} value={query} loading={isQueryTokenLoading} onValueChange={setQuery} />
            </div>

            <div className="flex flex-wrap gap-2">
              {pinnedTokens.map((token) => (
                <div key={token.id} className="group">
                  <div className="relative flex justify-end w-full">
                    <Button
                      color="default"
                      variant="default"
                      className="absolute hidden group-hover:flex items-center justify-center w-[18px] h-[18px] -mt-1 -mr-1 border-gray-300 rounded-full border dark:border-gray-800 hover:border-gray-600 dark:hover:border-gray-600"
                      size={null}
                      onClick={() => _onPin(token.id)}
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button variant="secondary" key={token.id} onClick={() => _onSelect(token)}>
                    <Currency.Icon
                      width={20}
                      height={20}
                      className={buttonIconVariants({ size: 'default' })}
                      currency={token}
                      disableLink
                    />
                    {token.symbol}
                  </Button>
                </div>
                // className="border border-gray-300 dark:border-transparent hover:border-gray-600 dark:hover:border-gray-600"
              ))}
            </div>

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
