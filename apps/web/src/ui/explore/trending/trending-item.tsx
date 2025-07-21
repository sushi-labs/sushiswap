import { Currency } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { NativeAddress } from 'src/lib/constants'
import type { ChainId, EvmChainId } from 'sushi/chain'
import { Native, Token } from 'sushi/currency'

type TokenType = {
  symbol: string
  name: string
  decimals: number
  chainId: unknown
  approved: boolean
  address: `0x${string}`
}

export const TrendingItem = ({
  position,
  chainId,
  token0,
  token1,
  fee,
  tvl,
  volume,
  apr,
}: {
  position: number
  chainId: ChainId
  token0: TokenType
  token1: TokenType
  fee: string
  tvl: string
  volume: string
  apr: string
}) => {
  const pairName = `${token0.symbol}-${token1.symbol}`
  return (
    <div className="flex justify-between items-center p-3 w-full rounded-lg bg-background">
      <div className="flex gap-5 items-center whitespace-nowrap basis-1/2">
        <div className="rounded-lg dark:bg-slate-800 dark:border-[#222137] w-8 flex items-center justify-center text-xs font-medium aspect-1 border">
          {position}
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Currency.IconList
              iconWidth={32}
              iconHeight={32}
              className="border-none"
            >
              <Currency.Icon
                disableLink
                currency={
                  token0.address === NativeAddress
                    ? // @TODO remove typecast once chainId type is resolved
                      Native.onChain(chainId as EvmChainId)
                    : new Token({
                        address: token0.address,
                        name: token0.name,
                        symbol: token0.symbol,
                        chainId: token0.chainId as EvmChainId,
                        decimals: token0.decimals,
                        approved: token0.approved,
                      })
                }
                width={32}
                height={32}
              />
              <Currency.Icon
                disableLink
                currency={
                  token1.address === NativeAddress
                    ? Native.onChain(token1.chainId as EvmChainId)
                    : new Token({
                        address: token1.address,
                        name: token1.name,
                        symbol: token1.symbol,
                        chainId: token1.chainId as EvmChainId,
                        decimals: token1.decimals,
                        approved: token1.approved,
                      })
                }
                width={32}
                height={32}
              />
            </Currency.IconList>
            <div className="border-background dark:bg-[] border rounded-[4px] overflow-hidden z-10 absolute -bottom-[1px] -right-1.5">
              <NetworkIcon
                type="square"
                chainId={chainId}
                className="w-3 h-3"
              />
            </div>
          </div>
          <div className="flex flex-col font-medium">
            <div className="text-sm">{pairName}</div>
            <div className="flex gap-2 items-center">
              <div className="text-xs p-1 px-2 rounded-lg bg-[#3B7EF61A] text-[#3B7EF6] leading-3">
                V3
              </div>
              <div className="text-xs text-muted-foreground">{fee}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pr-3 mx-auto basis-1/2">
        <div className="flex flex-col">
          <div className="text-xs dark:text-slate-450">TVL</div>
          <div className="text-sm font-medium">{tvl}</div>
        </div>
        <div className="text-sm font-medium">
          <div className="text-xs dark:text-slate-450">1d vol</div>
          <div className="text-sm font-medium">{volume}</div>
        </div>
        <div className="text-sm font-medium">
          <div className="text-xs dark:text-slate-450">APR</div>
          <div className="text-sm font-medium">{apr}</div>
        </div>
      </div>
    </div>
  )
}

export const TrendingItemMobile = ({
  position,
  chainId,
  token0,
  token1,
  fee,
}: {
  position: number
  chainId: ChainId
  token0: TokenType
  token1: TokenType
  fee: string
}) => {
  const pairName = `${token0.symbol}-${token1.symbol}`
  return (
    <div
      key={`${token0.symbol}-${token1.symbol}-${position}`}
      className="shrink-0 min-w-[160px] p-2 dark:bg-slate-750 bg-slate-200 rounded-full flex items-center gap-2"
    >
      <div className="relative">
        <Currency.IconList iconWidth={24} iconHeight={24} className="!border-0">
          <Currency.Icon
            className="!border-0"
            disableLink
            currency={
              token0.address === NativeAddress
                ? Native.onChain(chainId as EvmChainId)
                : new Token({
                    address: token0.address,
                    name: token0.name,
                    symbol: token0.symbol,
                    chainId: token0.chainId as EvmChainId,
                    decimals: token0.decimals,
                    approved: token0.approved,
                  })
            }
            width={24}
            height={24}
          />
          <Currency.Icon
            className="!border-0"
            disableLink
            currency={
              token1.address === NativeAddress
                ? Native.onChain(token1.chainId as EvmChainId)
                : new Token({
                    address: token1.address,
                    name: token1.name,
                    symbol: token1.symbol,
                    chainId: token1.chainId as EvmChainId,
                    decimals: token1.decimals,
                    approved: token1.approved,
                  })
            }
            width={24}
            height={24}
          />
        </Currency.IconList>
        <div className="border-background dark:bg-[] border rounded-[4px] overflow-hidden  z-10 absolute -bottom-[1px] -right-1.5">
          <NetworkIcon
            type="square"
            chainId={chainId}
            className="w-3 h-3 lg:w-5 lg:h-5"
          />
        </div>
      </div>
      <div className="flex text-sm font-medium leading-5">
        <div>{pairName}-V3-</div>
        <div>{fee}</div>
      </div>
    </div>
  )
}
