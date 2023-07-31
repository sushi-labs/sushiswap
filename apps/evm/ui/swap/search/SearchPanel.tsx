'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Chain } from '@sushiswap/chain'
import { Native, Token } from '@sushiswap/currency'
import { useCustomTokens, useDebounce, usePinnedTokens } from '@sushiswap/hooks'
import { usePrice, useTokenList, useTokens, useTokenSearch } from '@sushiswap/react-query'
import { Badge, classNames, NetworkIcon, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Dialog } from '@sushiswap/ui/components/dialog'
import { Search } from '@sushiswap/ui/components/input/Search'
import { List } from '@sushiswap/ui/components/list/List'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sushiswap/ui/components/tooltip'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { useSearchContext } from './SearchProvider'

export const SearchPanel: FC = () => {
  const { network1 } = useSwapState()
  const [query, setQuery] = useState<string>()
  const debouncedQuery = useDebounce(query, 500)
  const filter = useMemo(() => (debouncedQuery ? [debouncedQuery] : 'showNone'), [debouncedQuery])

  const { data: tokenSearch } = useTokenSearch({ address: debouncedQuery })
  const { data: tokenList } = useTokenList(filter)
  const { data: pinnedTokenMap } = usePinnedTokens()
  const { data: tokenMap } = useTokens({ chainId: network1 })
  const { data: customTokenMap } = useCustomTokens()

  const pinnedTokens = useMemo(() => {
    if (!pinnedTokenMap[network1]) return []
    return pinnedTokenMap[network1]
      .map((id) => {
        const [, address] = id.split(':')
        if (address === 'NATIVE') return Native.onChain(network1)
        return tokenMap?.[address] || customTokenMap?.[address]
      })
      .filter((token): token is Token => !!token)
  }, [customTokenMap, network1, pinnedTokenMap, tokenMap])

  const { data: popularTokensList, isLoading: isPopularListLoading } = useTokenList(
    // TODO: we should have ETH as an option...
    useMemo(() => [...pinnedTokens.map((t) => t.wrapped.address)], [pinnedTokens])
  )
  const { open, setOpen } = useSearchContext()

  const onClose = useCallback(() => setOpen(false), [setOpen])
  const isLoading = Boolean(query !== debouncedQuery && query && query?.length > 2)

  const currentNetworkResults = useMemo(() => {
    return [
      ...(tokenList && Object.keys(tokenList).length > 0
        ? Object.values(tokenList)
            .filter((el) => el.chainId === network1)
            .map((el) => ({ token: el, official: true }))
        : []),
      ...(tokenSearch && Object.keys(tokenSearch).length > 0
        ? Object.values(tokenSearch).filter(
            (el) => el.token.chainId === network1 && !tokenList?.[`${el.token.chainId}:${el.token.address}`]
          )
        : []),
    ]
  }, [network1, tokenList, tokenSearch])

  const otherNetworkResults = useMemo(() => {
    return [
      ...(tokenList && Object.keys(tokenList).length > 0
        ? Object.values(tokenList)
            .filter((el) => el.chainId !== network1)
            .map((el) => ({ token: el, official: true }))
        : []),
      ...(tokenSearch && Object.keys(tokenSearch).length > 0
        ? Object.values(tokenSearch).filter(
            (el) => el.token.chainId !== network1 && !tokenList?.[`${el.token.chainId}:${el.token.address}`]
          )
        : []),
    ]
  }, [network1, tokenList, tokenSearch])

  return (
    <Dialog variant="opaque" open={open} onClose={onClose} className="fixed inset-0 z-[1080]">
      <div>
        <div className="flex items-center gap-4">
          <Search id="search-input" loading={isLoading} onValueChange={setQuery} value={query ?? ''} />
          <Button variant="ghost" onClick={onClose} className="text-blue">
            Cancel
          </Button>
        </div>
        <div className="relative scroll">
          {query && query.length > 2 && (
            <List className="pt-6">
              <List.Label className="text-sm">{Chain.from(network1).name}</List.Label>
              <List.Control className="scroll max-h-[368px] !p-1">
                {isLoading ? (
                  <RowSkeleton />
                ) : currentNetworkResults?.length > 0 ? (
                  currentNetworkResults.map((el, i) => (
                    <Row currency={el.token} key={`example-${i}-${el.token.address}`} supported={el.official} />
                  ))
                ) : (
                  <div className="h-[60px] flex items-center justify-center text-xs font-semibold text-gray-400 dark:text-slate-500">
                    No results found
                  </div>
                )}
              </List.Control>
            </List>
          )}
          {query && query.length > 2 && (
            <List className="pt-6">
              <List.Label className="text-sm">Other networks</List.Label>
              <List.Control className="scroll max-h-[368px] !p-1">
                {isLoading ? (
                  <RowSkeleton />
                ) : otherNetworkResults.length > 0 ? (
                  otherNetworkResults.map((el, i) => (
                    <Row currency={el.token} key={`example-${i}-${el.token.address}`} supported={el.official} />
                  ))
                ) : (
                  <div className="h-[60px] flex items-center justify-center text-xs font-semibold text-gray-400 dark:text-slate-500">
                    No results found
                  </div>
                )}
              </List.Control>
            </List>
          )}
          <List className="pt-6">
            <List.Label className="text-sm">Popular tokens</List.Label>
            <List.Control className="!p-1">
              {isPopularListLoading ? (
                <RowSkeleton />
              ) : (
                popularTokensList &&
                Object.values(popularTokensList)?.map((el) => (
                  <Row currency={el} key={`example-${el.address}`} supported={true} />
                ))
              )}
            </List.Control>
          </List>
        </div>
      </div>
    </Dialog>
  )
}

const Row: FC<{ currency: Token; supported?: boolean }> = ({ currency, supported = false }) => {
  const { setSearch } = useSwapActions()
  const { setOpen } = useSearchContext()
  const { data: price, isLoading } = usePrice({ address: currency.address, chainId: currency.chainId })

  const handleClick = useCallback(() => {
    setSearch(currency)
    setOpen(false)
  }, [currency, setOpen, setSearch])

  if (isLoading) return <RowSkeleton />

  return (
    <button
      onClick={handleClick}
      className="flex justify-between w-full px-3 py-2 rounded-lg cursor-pointer hover:bg-blue/10 dark:hover:bg-slate-700"
    >
      <div className="flex items-center gap-5">
        <div className="w-9 h-9">
          <Badge
            position="bottom-right"
            badgeContent={<NetworkIcon chainId={currency.chainId} width={20} height={20} />}
          >
            <Currency.Icon currency={currency} width={36} height={36} />
          </Badge>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900 dark:text-slate-100">{currency.name}</span>

            {!supported && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ExclamationTriangleIcon width={18} height={18} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Not in official tokenlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{currency.symbol}</span>
          </div>
        </div>
      </div>
      {price && (
        <div className="flex flex-col">
          <span className="font-medium text-right text-gray-900 dark:text-slate-100">${price?.toSignificant(2)}</span>
          <span
            className={classNames(
              // change > 0 ? 'text-green' : 'text-red',
              'font-medium text-sm text-gray-500 dark:text-slate-400 text-right'
            )}
          >
            {/*{change}%*/}{' '}
          </span>
        </div>
      )}
    </button>
  )
}

const RowSkeleton = () => {
  return (
    <div className="flex justify-between px-3 py-2 rounded-lg">
      <div className="flex items-center w-2/4 gap-5">
        <div className="w-9 h-9">
          <Badge position="bottom-right" badgeContent={<SkeletonCircle radius={20} />}>
            <SkeletonCircle radius={36} />
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5 flex-grow">
          <SkeletonText />
          <SkeletonText fontSize="sm" className="w-1/2" />
        </div>
      </div>
      <div className="flex flex-col items-center w-1/4">
        <SkeletonText className="w-1/2" align="right" />
        <SkeletonText fontSize="sm" className="w-1/3" align="right" />
      </div>
    </div>
  )
}
