import { ChainId, chainName } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { useBalances, usePrices, useTokens } from '@sushiswap/react-query'
import { SlideIn } from '@sushiswap/ui/future/components/animation'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { Input } from '@sushiswap/ui/future/components/input'
import { Search } from '@sushiswap/ui/future/components/input/Search'
import { List } from '@sushiswap/ui/future/components/list/List'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useState } from 'react'

import { TokenSelectorCurrencyList } from './TokenSelectorCurrencyList'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { useAccount } from 'wagmi'
import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'
import { Button } from '@sushiswap/ui/future/components/button'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { COMMON_BASES } from '@sushiswap/router-config'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useCustomTokens } from '@sushiswap/hooks'
import { useSortedTokenList } from './hooks/useSortedTokenList'
import { useTokenWithCache } from '../../hooks'
import { isAddress } from '@ethersproject/address'

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

  const _onSelect = useCallback(
    (currency: Type) => {
      if (onSelect) {
        onSelect(currency)
      }

      setOpen(false)
    },
    [onSelect]
  )

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
              <Search id={id} input={Input.Address} value={query} loading={isQueryTokenLoading} onChange={setQuery} />
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_BASES[chainId].map((base) => (
                <Button
                  startIcon={<Currency.Icon currency={base} width={16} height={16} disableLink={true} />}
                  color="default"
                  variant="outlined"
                  key={base.id}
                  onClick={() => _onSelect(base)}
                >
                  {base.symbol}
                </Button>
              ))}
            </div>

            <List.Control className="relative flex flex-col flex-grow gap-3 p-1">
              {isQueryTokenLoading ? (
                <div className="py-0.5 h-[64px] -mb-3">
                  <div className="flex items-center w-full h-full px-3 rounded-lg">
                    <div className="flex items-center justify-between flex-grow gap-2 rounded">
                      <div className="flex flex-row items-center flex-grow gap-4">
                        <Skeleton.Circle radius={40} />
                        <div className="flex flex-col items-start">
                          <Skeleton.Text fontSize="text-base" className="w-full bg-gray-300 w-[100px]" />
                          <Skeleton.Text fontSize="text-sm" className="w-full bg-gray-100 w-[60px]" />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <Skeleton.Text fontSize="text-base" className="bg-gray-300 w-[80px]" />
                        <Skeleton.Text fontSize="text-sm" align="right" className="bg-gray-200 w-[40px]" />
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
