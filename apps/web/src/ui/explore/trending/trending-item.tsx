import type { TrendingPool } from '@sushiswap/graph-client/data-api-181'
import { useIsMounted } from '@sushiswap/hooks'
import { Currency } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Link from 'next/link'
import { NativeAddress } from 'src/lib/constants'
import { ProtocolBadge } from 'src/ui/pool/PoolNameCell'
import { SushiSwapProtocol, formatPercent, formatUSD } from 'sushi'
import type { EvmChainId } from 'sushi/chain'
import { Native, Token } from 'sushi/currency'

export const TrendingItem = ({
  pool,
  position,
  href,
}: {
  pool: TrendingPool
  position: number
  href: string
}) => {
  const {
    chainId,
    token0,
    token1,
    protocol,
    totalApr1d,
    volumeUSD1d,
    liquidityUSD,
  } = pool
  const pairName = `${token0.symbol}-${token1.symbol}`
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <Link
      className="flex justify-between items-center p-3 w-full rounded-lg bg-background"
      href={href}
    >
      <div className="flex gap-5 items-center whitespace-nowrap basis-1/2">
        <div className="rounded-lg dark:bg-slate-800 bg-slate-50 dark:border-[#222137] w-8 flex items-center justify-center text-xs font-medium aspect-1 border">
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
              <ProtocolBadge protocol={protocol as SushiSwapProtocol} />
              <div className="text-xs text-muted-foreground">
                {formatPercent(pool.swapFee)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pr-3 mx-auto basis-1/2">
        <div className="flex flex-col">
          <div className="text-xs dark:text-slate-450 text-slate-450">TVL</div>
          <div className="text-sm font-medium">{formatUSD(liquidityUSD)}</div>
        </div>
        <div className="text-sm font-medium">
          <div className="text-xs dark:text-slate-450 text-slate-450">
            1d vol
          </div>
          <div className="text-sm font-medium">{formatUSD(volumeUSD1d)}</div>
        </div>
        <div className="text-sm font-medium">
          <div className="text-xs dark:text-slate-450 text-slate-450">APR</div>
          <div className="text-sm font-medium">{formatPercent(totalApr1d)}</div>
        </div>
      </div>
    </Link>
  )
}

export const TrendingItemMobile = ({
  pool,
  position,
  href,
}: {
  pool: TrendingPool
  position: number
  href: string
}) => {
  const { chainId, token0, token1, protocol, swapFee } = pool
  const pairName = `${token0.symbol}-${token1.symbol}`
  const protocolUi = SushiSwapProtocol.SUSHISWAP_V2 === protocol ? 'V2' : 'V3'
  return (
    <Link
      href={href}
      key={`${token0.symbol}-${token1.symbol}-${position}`}
      className="shrink-0 min-w-[160px] p-2 dark:bg-slate-750 bg-slate-200 rounded-full flex items-center gap-2 snap-start"
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
                  })
            }
            width={24}
            height={24}
          />
        </Currency.IconList>
        <div className="border-background border rounded-[4px] overflow-hidden  z-10 absolute -bottom-[1px] -right-1.5">
          <NetworkIcon
            type="square"
            chainId={chainId}
            className="w-3 h-3 lg:w-5 lg:h-5"
          />
        </div>
      </div>
      <div className="flex text-sm font-medium leading-5">
        <div>
          {pairName}-{protocolUi}-{formatPercent(swapFee)}
        </div>
      </div>
    </Link>
  )
}
