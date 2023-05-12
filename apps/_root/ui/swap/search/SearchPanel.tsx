import { useDebounce } from '@sushiswap/hooks'
import { Search } from '@sushiswap/ui/future/components/input/Search'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { useSearchContext } from './SearchProvider'
import { List } from '@sushiswap/ui/future/components/list/List'
import { usePrice, useTokenList, useTokenSearch } from '@sushiswap/react-query'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { Button, classNames } from '@sushiswap/ui'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { Token } from '@sushiswap/currency'
import { Chain } from '@sushiswap/chain'
import { Currency } from '@sushiswap/ui/future/components/currency'
import { COMMON_BASES } from '@sushiswap/router-config'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@sushiswap/ui/future/components/Tooltip'

export const SearchPanel: FC = () => {
  const { network1 } = useSwapState()
  const [query, setQuery] = useState<string>()
  const debouncedQuery = useDebounce(query, 500)
  const filter = useMemo(() => (debouncedQuery ? [debouncedQuery] : 'showNone'), [debouncedQuery])

  const { data: tokenSearch } = useTokenSearch({ address: debouncedQuery })
  const { data: tokenList } = useTokenList(filter)
  const { data: popularTokensList, isLoading: isPopularListLoading } = useTokenList(
    // TODO: we should have ETH as an option...
    useMemo(() => [...COMMON_BASES[network1].map((t) => t.wrapped.address)], [network1])
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
          <Search id="search-input" loading={isLoading} onChange={setQuery} value={query ?? ''} />
          <Button variant="empty" onClick={onClose} size="md" className="px-0">
            Cancel
          </Button>
        </div>
        <div className="scroll relative">
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
      className="w-full cursor-pointer flex justify-between px-3 py-2 rounded-lg hover:bg-blue/10 dark:hover:bg-slate-700"
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
          <div className="flex gap-1 items-center">
            <span className="font-medium text-gray-900 dark:text-slate-100">{currency.name}</span>

            {!supported && (
              <Tooltip description="Not in official tokenlist" className="z-[2000]">
                <ExclamationTriangleIcon width={18} height={18} />
              </Tooltip>
            )}
          </div>
          <div className="flex gap-1 items-center">
            <span className="font-medium text-sm text-gray-500 dark:text-slate-400">{currency.symbol}</span>
          </div>
        </div>
      </div>
      {price && (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-slate-100 text-right">${price?.toSignificant(2)}</span>
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
      <div className="flex w-2/4 items-center gap-5">
        <div className="w-9 h-9">
          <Badge position="bottom-right" badgeContent={<Skeleton.Circle radius={20} />}>
            <Skeleton.Circle radius={36} />
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5 flex-grow">
          <Skeleton.Text />
          <Skeleton.Text fontSize="text-sm" className="w-1/2" />
        </div>
      </div>
      <div className="flex flex-col w-1/4 items-center">
        <Skeleton.Text className="w-1/2" align="right" />
        <Skeleton.Text fontSize="text-sm" className="w-1/3" align="right" />
      </div>
    </div>
  )
}
