import { SearchIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Button, classNames, Currency, DEFAULT_INPUT_UNSTYLED, Typography } from '@sushiswap/ui'
import { FC } from 'react'

const EXAMPLE_CURRENCIES = [
  new Token({
    chainId: ChainId.ETHEREUM,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
    symbol: 'ETH',
  }),
  new Token({
    chainId: ChainId.ETHEREUM,
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 18,
    symbol: 'BTC',
  }),
  new Token({
    chainId: ChainId.ETHEREUM,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 18,
    symbol: 'USDT',
  }),
  new Token({
    chainId: ChainId.BSC,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    decimals: 18,
    symbol: 'BNB',
  }),
]

export const Search: FC = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <div className="flex w-full gap-2 px-4 items-center h-14 bg-slate-800 rounded-xl">
          <SearchIcon width={24} height={24} className="text-slate-400" />
          <input
            placeholder="Search by token name or address"
            className={classNames('!text-lg w-full', DEFAULT_INPUT_UNSTYLED)}
          />
        </div>
        <Button className="h-14 px-5 whitespace-nowrap">Trade Now</Button>
      </div>
      <Typography variant="sm" weight={500} className="flex items-center gap-2 text-slate-500 px-4">
        Try{' '}
        {EXAMPLE_CURRENCIES.map((el) => (
          <div key={el.address} className="flex items-center gap-1">
            <div className="w-4 h-4">
              <Currency.Icon currency={el} width={16} height={16} />
            </div>
            {`'${el.symbol}'`}
          </div>
        ))}
      </Typography>
    </div>
  )
}
