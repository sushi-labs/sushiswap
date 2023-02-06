import { useDebounce } from '@sushiswap/hooks'
import { Search } from '@sushiswap/ui13/components/input/Search'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { useSearchContext } from './SearchProvider'
import { List } from '@sushiswap/ui13/components/list/List'
import { usePrice, useTokenList } from '@sushiswap/react-query'
import { Badge } from '@sushiswap/ui13/components/Badge'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { classNames } from '@sushiswap/ui13'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { Token } from '@sushiswap/currency'
import { Chain } from '@sushiswap/chain'
import { Currency } from '@sushiswap/ui13/components/currency'
import { AppType } from '@sushiswap/ui13/types'

const POPULAR_TOKENS = [
  '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
]

export const SearchPanel: FC = () => {
  const { network1 } = useSwapState()
  const [query, setQuery] = useState<string>()
  const debouncedQuery = useDebounce(query, 500)
  const filter = useMemo(() => (debouncedQuery ? [debouncedQuery] : 'showNone'), [debouncedQuery])

  const { data: tokenList } = useTokenList(filter)
  const { data: popularTokensList } = useTokenList(POPULAR_TOKENS)
  const { open, setOpen } = useSearchContext()

  const onClose = useCallback(() => setOpen(false), [setOpen])
  const isLoading = Boolean(query !== debouncedQuery && query && query?.length > 2)

  return (
    <Dialog variant="opaque" open={open} onClose={onClose} className="fixed inset-0 z-[1080]">
      <div>
        <Search id="search-input" loading={isLoading} onChange={setQuery} value={query ?? ''} />
        <div className="scroll relative">
          {query && query.length > 2 && (
            <List className="pt-6">
              <List.Label className="text-sm">{Chain.from(network1).name}</List.Label>
              <List.Control className="scroll max-h-[368px] !p-1">
                {isLoading ? (
                  <RowSkeleton />
                ) : tokenList && Object.keys(tokenList).length > 0 ? (
                  Object.values(tokenList)
                    .filter((el) => el.chainId === network1)
                    .map((el, i) => <Row currency={el} key={`example-${i}-${el.address}`} />)
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
                ) : tokenList && Object.keys(tokenList).length > 0 ? (
                  Object.values(tokenList)
                    .filter((el) => el.chainId !== network1)
                    .map((el, i) => <Row currency={el} key={`example-${i}-${el.address}`} />)
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
              {popularTokensList &&
                Object.values(popularTokensList)?.map((el) => <Row currency={el} key={`example-${el.address}`} />)}
            </List.Control>
          </List>
        </div>
      </div>
    </Dialog>
  )
}

const Row: FC<{ currency: Token }> = ({ currency }) => {
  const { setToken1 } = useSwapActions()
  const { setOpen } = useSearchContext()
  const { data: price, isLoading } = usePrice({ address: currency.address, chainId: currency.chainId })

  const handleClick = useCallback(() => {
    setToken1(currency)
    setOpen(false)
  }, [currency, setOpen, setToken1])

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
          <span className="font-medium text-gray-900 dark:text-slate-100">{currency.name}</span>
          <div className="flex gap-1 items-center">
            <span className="font-medium text-sm text-gray-500 dark:text-slate-400">{currency.symbol}</span>
          </div>
        </div>
      </div>
      {price && (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-slate-100 text-right">${price?.toFixed(2)}</span>
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
