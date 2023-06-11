import { ChevronDownIcon, SearchIcon, StarIcon } from '@heroicons/react-v1/solid'
import chains, { ChainId, chainShortName } from '@sushiswap/chain'
import { Native, Token, Type } from '@sushiswap/currency'
import { useDebounce, useOnClickOutside } from '@sushiswap/hooks'
import { classNames, Currency, DEFAULT_INPUT_UNSTYLED, NetworkIcon, Skeleton, Typography } from '@sushiswap/ui'
import type { TokenList } from '@uniswap/token-lists'
import { isAddress } from 'ethers/lib/utils'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useToken } from '@sushiswap/wagmi'

import { SUPPORTED_CHAIN_IDS } from '../../../config'

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
  const [chainId, setChainId] = useState<ChainId>(ChainId.ETHEREUM)
  const debouncedQuery = useDebounce(query, 500)
  const [selectNetwork, setSelectNetwork] = useState(false)
  const [open, setOpen] = useState(false)

  useOnClickOutside(ref, () => {
    setOpen(false)
    setSelectNetwork(false)
  })

  const { data: web3Token, isLoading: web3Loading } = useToken({
    address: query as `0x${string}`,
    chainId,
    enabled: isAddress(query),
  })

  const { data: tokenList } = useQuery<TokenList>(
    ['https://token-list.sushi.com'],
    () => fetch('https://token-list.sushi.com').then((response) => response.json()),
    {
      enabled: debouncedQuery.length > 2 && !isAddress(debouncedQuery),
    }
  )

  const filteredTokens = useMemo(() => {
    return tokenList?.tokens?.filter(
      (el) => el.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()) && el.chainId === chainId
    )
  }, [chainId, debouncedQuery, tokenList?.tokens])

  const skeleton = useMemo(() => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700">
          <div className="w-[36px] h-[36px]">
            <Skeleton.Circle radius={36} className="bg-neutral-600" />
          </div>
          <div className="flex flex-col space-y-1">
            <Skeleton.Box className="h-4 w-[120px] my-0.5 bg-neutral-600" />
            <Skeleton.Box className="h-4 w-[60px] my-0.5 bg-neutral-700" />
          </div>
        </div>
      </div>
    )
  }, [])

  useEffect(() => {
    if (selectNetwork) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [selectNetwork])
  return (
    <div className="relative flex flex-col gap-3">
      <div className="absolute z-10 flex w-full gap-4">
        <div ref={ref} onFocus={() => setOpen(true)} className="relative w-full bg-neutral-800 rounded-xl">
          <div className="flex items-center gap-2 pl-4 pr-3 h-14">
            <div
              className={classNames(
                selectNetwork ? 'opacity-40 pointer-events-none' : '',
                'flex gap-2 items-center w-full'
              )}
            >
              <div className="w-6 h-6">
                <SearchIcon width={24} height={24} className="text-neutral-500" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by token or address"
                className={classNames('!text-lg w-full placeholder:text-neutral-500', DEFAULT_INPUT_UNSTYLED)}
                autoComplete="new-password"
                autoCorrect="off"
              />
            </div>
            <Typography
              onClick={() => setSelectNetwork((prev) => !prev)}
              as="button"
              weight={600}
              variant="sm"
              className="flex items-center gap-1 py-2 pl-3 pr-2 rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-neutral-200"
            >
              {chainShortName[chainId].toUpperCase()} <ChevronDownIcon width={16} height={16} />
            </Typography>
          </div>
          <div
            className={classNames(
              open ? 'max-h-[335px] py-2' : 'max-h-[0px]',
              'z-[100] bg-neutral-800 rounded-b-xl flex flex-col gap-2 overflow-hidden transition-all scroll overflow-y-auto'
            )}
          >
            {selectNetwork ? (
              <>
                <Typography variant="sm" weight={600} className="px-4 text-neutral-400">
                  Networks
                </Typography>
                {SUPPORTED_CHAIN_IDS.map((el) => (
                  <Row
                    key={el}
                    isNetwork={true}
                    currency={Native.onChain(el)}
                    onClick={() => {
                      setSelectNetwork(false)
                      setChainId(el)
                    }}
                  />
                ))}
              </>
            ) : query.length > 2 ? (
              <>
                <Typography variant="sm" weight={600} className="px-4 text-neutral-400">
                  Tokens
                </Typography>
                {isAddress(query) && web3Loading ? (
                  skeleton
                ) : web3Token ? (
                  <Row
                    currency={
                      new Token({
                        address: web3Token.address,
                        name: web3Token.name,
                        symbol: web3Token.symbol,
                        chainId: ChainId.ETHEREUM,
                        decimals: web3Token.decimals,
                      })
                    }
                  />
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
                <Typography variant="sm" weight={600} className="flex items-center gap-2 px-4 text-neutral-400">
                  <StarIcon width={16} height={16} /> Popular Tokens
                </Typography>
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
    </div>
  )
}

const Row: FC<{ currency: Type; onClick?(): void; isNetwork?: boolean }> = ({
  currency,
  onClick,
  isNetwork = false,
}) => {
  const content = (
    <div
      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-neutral-700"
      key={currency.wrapped.address}
    >
      <div className="w-[36px] h-[36px]">
        {isNetwork ? (
          <NetworkIcon chainId={currency.chainId} width={36} height={36} />
        ) : (
          <Currency.Icon disableLink currency={currency} width={36} height={36} />
        )}
      </div>
      <div className="flex flex-col">
        <Typography weight={600}>{isNetwork ? chains[currency.chainId].name : currency.name}</Typography>
        <Typography variant="sm" weight={600} className="text-left text-neutral-400">
          {currency.symbol}
        </Typography>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <a href={`https://www.sushi.com/swap?token0=NATIVE&token1=${currency.wrapped.address}&chainId=${currency.chainId}`}>
      {content}
    </a>
  )
}
