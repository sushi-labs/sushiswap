import { Transition } from '@headlessui/react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { useDebounce } from '@sushiswap/hooks'
import { Currency } from '@sushiswap/ui13/components/currency'
import { HEADER_HEIGHT } from '@sushiswap/ui13/constants'
import type { TokenList } from '@uniswap/token-lists'
import React, { FC, Fragment, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { useSearchContext } from './SearchProvider'

const EXAMPLE_CURRENCIES = [
  new Token({
    chainId: ChainId.ETHEREUM,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
    symbol: 'ETH',
    name: 'Ether',
  }),
  new Token({
    chainId: ChainId.ETHEREUM,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 18,
    symbol: 'WBTC',
    name: 'Wrapped BTC',
  }),
  new Token({
    chainId: ChainId.ETHEREUM,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 18,
    symbol: 'USDT',
    name: 'Tether USD',
  }),
  new Token({
    chainId: ChainId.BSC,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    decimals: 18,
    symbol: 'BNB',
    name: 'Binance',
  }),
]

export const SearchPanel: FC = () => {
  const [query, setQuery] = useState<string>('')
  const { open, setOpen } = useSearchContext()
  const debouncedQuery = useDebounce(query, 250)

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.querySelector('html')?.classList?.add('overflow-hidden')
    } else {
      document.querySelector('html')?.classList?.remove('overflow-hidden')
    }
  }, [open])

  const onClose = useCallback(
    (e: MouseEvent<HTMLDivElement> | MouseEvent<SVGSVGElement>) => {
      e.stopPropagation()
      setOpen(false)

      setTimeout(() => {
        setQuery('')
      }, 1500)
    },
    [setOpen]
  )

  const { data: tokenList } = useQuery<TokenList>(['https://token-list.sushi.com'], () =>
    fetch(`https://token-list.sushi.com`).then((response) => response.json())
  )

  const filteredTokens = useMemo(() => {
    if (debouncedQuery.length <= 2) return []

    return tokenList?.tokens
      ?.filter((el) => el.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()))
      .map(({ address, name, symbol, chainId, decimals }) => new Token({ address, name, symbol, chainId, decimals }))
  }, [debouncedQuery, tokenList?.tokens])

  return (
    <Transition.Root
      show={open}
      className="fixed top-0 left-0 right-0 z-[1080] flex items-center"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="max-w-2xl mx-auto flex flex-grow justify-center relative h-[38px]">
        <div className="absolute inset-0">
          <Transition.Child
            as={Fragment}
            enter="transition duration-300 ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div onClick={onClose} className="z-[1080] fixed inset-0 bg-black/[0.5]" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition duration-300 ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div className="z-[1081] fixed left-0 right-0 top-0 h-[55px] bg-slate-900" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition duration-[400ms] delay-300 ease-out"
            enterFrom="transform translate-x-[200px] opacity-0"
            enterTo="transform translate-x-0 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div className="z-[1082] flex gap-2 absolute inset-0 items-center">
              <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-slate-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by token or address"
                className="without-ring w-full placeholder:text-slate-500 bg-transparent mx-11"
                autoComplete="new-password"
                autoCorrect="off"
              />
              <XMarkIcon
                onClick={onClose}
                className="absolute right-3 w-4 h-4 text-slate-300 hover:text-white cursor-pointer"
              />
            </div>
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition duration-[1000] ease-out"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-600 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div
              className="z-[1083] relative h-[320px] w-full bg-slate-200 rounded-b-2xl py-2 overflow-y-scroll scroll"
              style={{ marginTop: HEADER_HEIGHT - 8 }}
            >
              {query ? (
                <>
                  <p className="text-[10px] flex items-center gap-2 pl-11 pt-3 text-slate-600">SEARCH RESULTS</p>
                  <div className="flex flex-col gap-2 p-2">
                    {filteredTokens?.map((el, i) => (
                      <Row currency={el} key={`example-${i}-${el.address}`} />
                    ))}
                  </div>
                  <div className="my-3 mx-8">
                    <div className="h-px bg-slate-300 w-full" />
                  </div>
                  <p className="text-[10px] flex items-center gap-2 pl-11 pt-3 text-slate-600">POPULAR TOKENS</p>
                  <div className="flex flex-col gap-2 p-2">
                    {EXAMPLE_CURRENCIES.map((el) => (
                      <Row currency={el} key={`example-${el.address}`} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/*TODO RAMIN REACT_QUERY*/}
                  <p className="text-[10px] flex items-center gap-2 pl-11 pt-3 text-slate-600">RECENT SEARCHES</p>
                  <div className="flex flex-col gap-2 p-2">
                    {EXAMPLE_CURRENCIES.map((el) => (
                      <Row currency={el} key={`example-${el.address}`} />
                    ))}
                  </div>
                  <div className="my-3 mx-8">
                    <div className="h-px bg-slate-300 w-full" />
                  </div>
                  <p className="text-[10px] flex items-center gap-2 pl-11 pt-3 text-slate-600">POPULAR TOKENS</p>
                  <div className="flex flex-col gap-2 p-2">
                    {EXAMPLE_CURRENCIES.map((el) => (
                      <Row currency={el} key={`example-${el.address}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition.Root>
  )
}

const Row: FC<{ currency: Type; onClick?(): void }> = ({ currency, onClick }) => {
  const content = (
    <div
      className="flex items-center gap-2 cursor-pointer py-1 hover:bg-slate-300 px-10"
      key={currency.wrapped.address}
    >
      <div className="w-5 h-5">
        <Currency.Icon disableLink currency={currency} width={20} height={20} />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold text-slate-900">
          {currency.name} <span className="text-xs text-slate-600">{currency.symbol}</span>
        </p>
      </div>
    </div>
  )

  if (onClick) {
    return <button onClick={onClick}>{content}</button>
  }

  return (
    <a
      href={`https://sushi.com/swap?token1=${currency.wrapped.address}&token0=0x0000000000000000000000000000000000000000&chainId=${currency.chainId}`}
    >
      {content}
    </a>
  )
}
