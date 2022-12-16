import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline'
import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { useDebounce, useOnClickOutside } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui13'
import { Currency } from '@sushiswap/ui13/components/currency'
import { Skeleton } from '@sushiswap/ui13/components/skeleton'
import type { TokenList } from '@uniswap/token-lists'
import { isAddress } from 'ethers/lib/utils'
import { FC, useMemo, useRef, useState } from 'react'
import { useQuery } from 'wagmi'

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

export const Search: FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState<string>('')
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 500)

  useOnClickOutside(ref, () => {
    setOpen(false)
  })

  const { data: tokenList } = useQuery<TokenList>(
    ['https://token-list.sushi.com'],
    () => fetch(`https://token-list.sushi.com`).then((response) => response.json()),
    {
      enabled: debouncedQuery.length > 2 && !isAddress(debouncedQuery),
    }
  )

  const filteredTokens = useMemo(() => {
    return tokenList?.tokens?.filter((el) => el.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()))
  }, [debouncedQuery, tokenList?.tokens])

  const skeleton = useMemo(() => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700">
          <div className="w-[36px] h-[36px]">
            <Skeleton.Circle radius={36} className="bg-slate-600" />
          </div>
          <div className="flex flex-col space-y-1">
            <Skeleton.Box className="h-4 w-[120px] my-0.5 bg-slate-600" />
            <Skeleton.Box className="h-4 w-[60px] my-0.5 bg-slate-700" />
          </div>
        </div>
      </div>
    )
  }, [])

  return (
    <>
      <div className={classNames(open ? 'fixed' : 'hidden', 'inset-0 bg-black/[0.32] z-0')} />
      <div className={classNames(open ? 'h-[320px]' : 'h-[46px]', 'absolute w-[320px] overflow-hidden')}>
        <div
          ref={ref}
          onFocus={() => setOpen(true)}
          className="absolute inset-0 ring-2 ring-white border border-slate-200/20 rounded-xl z-[10] bg-white"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-2 items-center w-full">
              <div className="w-6 h-6">
                <MagnifyingGlassIcon className="w-6 h-6 text-slate-500" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by token or address"
                className="without-ring !text-lg w-full placeholder:text-slate-500 bg-transparent"
                autoComplete="new-password"
                autoCorrect="off"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 scroll overflow-y-auto">
            {query.length > 2 ? (
              <>
                <p className="text-sm font-semibold px-4 text-slate-400">Tokens</p>
                {isAddress(query) ? (
                  skeleton
                ) : query.length > 2 && query !== debouncedQuery ? (
                  skeleton
                ) : filteredTokens ? (
                  <>
                    {filteredTokens.map(({ address, name, symbol, chainId, decimals }) => (
                      <Row
                        key={address}
                        currency={
                          new Token({
                            address,
                            name,
                            symbol,
                            chainId,
                            decimals,
                          })
                        }
                      />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-semibold flex items-center gap-2 px-4 text-slate-400">
                  <StarIcon className="w-4 h-4" /> Popular Tokens
                </p>
                <div className="flex flex-col gap-2">
                  {EXAMPLE_CURRENCIES.map((el) => (
                    <Row currency={el} key={`example-${el.address}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const Row: FC<{ currency: Type; onClick?(): void }> = ({ currency, onClick }) => {
  const content = (
    <div className="flex items-center gap-2 px-4 py-2 cursor-pointer" key={currency.wrapped.address}>
      <div className="w-6 h-6">
        <Currency.Icon disableLink currency={currency} width={24} height={24} />
      </div>
      <div className="flex flex-col">
        <p className="font-semibold">{currency.name}</p>
        <p className="text-sm font-semibold text-left text-slate-400">{currency.symbol}</p>
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
