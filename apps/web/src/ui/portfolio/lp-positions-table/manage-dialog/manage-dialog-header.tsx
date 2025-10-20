import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api-portfolio'
import { Currency } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import { formatNumber, formatPercent } from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  EvmToken,
  type SushiSwapProtocol,
  type SushiSwapV3ChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import {
  APRHoverCard,
  type RequiredPool,
} from '~evm/[chainId]/_ui/apr-hover-card'
import { ProtocolBadge } from '~evm/[chainId]/_ui/protocol-badge'
import type { PortfolioV2PositionV3PoolType } from '../../../../../../../packages/graph-client/dist/subgraphs/data-api-portfolio/queries/portfolio/lp-positions'
import { RangeBadge } from './range-badge'

export const ManageDialogHeader = ({
  data,
  hideApr,
}: {
  data: PortfolioV2PositionPoolType
  hideApr?: boolean
}) => {
  const [token0, token1] = useMemo(() => {
    return [
      unwrapEvmToken(
        new EvmToken({
          chainId: data.position.token0.chainId as EvmChainId,
          address: data.position.token0.address as EvmAddress,
          decimals: data.position.token0.decimals,
          symbol: data.position.token0.symbol,
          name: data.position.token0.name,
        }),
      ),
      unwrapEvmToken(
        new EvmToken({
          chainId: data.position.token1.chainId as EvmChainId,
          address: data.position.token1.address as EvmAddress,
          decimals: data.position.token1.decimals,
          symbol: data.position.token1.symbol,
          name: data.position.token1.name,
        }),
      ),
    ]
  }, [data])

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Currency.IconList
            iconWidth={32}
            iconHeight={32}
            className="!border-0"
          >
            <Currency.Icon currency={token0} />
            <Currency.Icon currency={token1} />
          </Currency.IconList>
          <div className="border-[#E8E7EB] dark:border-[#252A3C] border rounded-[4px] overflow-hidden z-10 absolute -bottom-0.5 -right-1.5">
            <NetworkIcon
              type="square"
              chainId={data?.pool?.chainId}
              className="w-3 h-3"
            />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{`${token0.symbol}-${token1.symbol}`}</span>
          <div className="flex items-center gap-1">
            {ProtocolBadge[data.pool.protocol as SushiSwapProtocol]}
            <div className="bg-[#F4F5F6] text-muted-foreground dark:bg-[#1E293B] dark:text-pink-200 text-xs px-2.5 py-1 rounded-full">
              {formatNumber(data.pool.swapFee * 100)}%
            </div>
          </div>
        </div>
      </div>
      {data?.pool?.protocol === 'SUSHISWAP_V3' ? (
        <RangeBadge
          token0={token0}
          token1={token1}
          tokenId={
            (data.position as PortfolioV2PositionV3PoolType['position'])
              ?.tokenId
          }
          chainId={data.pool.chainId as SushiSwapV3ChainId}
        />
      ) : null}
      {hideApr ? null : (
        <div
          className={
            'bg-skyblue/10 font-medium dark:bg-[#8A80FF08] px-2 py-1 text-xs flex items-center gap-1 rounded-full'
          }
        >
          <APRHoverCard pool={data.pool as unknown as RequiredPool}>
            <div className="flex items-center gap-1">
              <span>APR: </span>
              <span className="underline decoration-dotted underline-offset-2">
                {formatPercent(data.pool.feeApr1d)}
              </span>
              {data?.pool.incentives?.map((i, idx) => (
                <Currency.Icon
                  key={idx}
                  currency={
                    new EvmToken({
                      chainId: i.rewardToken.chainId as EvmChainId,
                      address: i.rewardToken.address as EvmAddress,
                      decimals: i.rewardToken.decimals,
                      symbol: i.rewardToken.symbol,
                      name: i.rewardToken.name,
                    })
                  }
                  width={14}
                  height={14}
                />
              ))}
            </div>
          </APRHoverCard>
        </div>
      )}
    </div>
  )
}
