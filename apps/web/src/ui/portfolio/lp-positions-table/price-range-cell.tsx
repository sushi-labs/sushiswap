import type {
  PortfolioV2PositionPoolType,
  PortfolioV2PositionV3PoolType,
} from '@sushiswap/graph-client/data-api-portfolio'
import { useIsSmScreen } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { getPriceOrderingFromPositionForUI } from 'src/lib/functions'
import { usePriceInverter } from 'src/lib/hooks'
import { useClaimableRewards } from 'src/lib/hooks/react-query'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import {
  type EvmAddress,
  type EvmChainId,
  EvmToken,
  type MerklChainId,
  SushiSwapProtocol,
  type SushiSwapV3ChainId,
  isMerklChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { ClaimRewardsButton } from '~evm/claim/rewards/_common/ui/claim-rewards-button'
import { ManageDialog } from './manage-dialog/manage-dialog'
import { PriceRangeSparklineAmm } from './price-range-sparkline-amm'
import { PriceRangeSparklineCLMM } from './price-range-sparkline-clmm'

export const PriceRangeCell = ({
  data,
  isHovered,
}: {
  data: PortfolioV2PositionPoolType
  isHovered: boolean
}) => {
  const isSmallScreen = useIsSmScreen()
  const [isManageOpen, setIsManageOpen] = useState(false)
  const { address } = useAccount()

  const { data: rewardsData } = useClaimableRewards({
    chainIds: isMerklChainId(data?.pool?.chainId) ? [data?.pool?.chainId] : [],
    account: address,
    enabled: isMerklChainId(data?.pool?.chainId as EvmChainId),
  })

  const rewardsForChain = rewardsData?.[data?.pool.chainId as MerklChainId]

  if ((isHovered || isManageOpen) && !isSmallScreen) {
    return (
      <div className="flex gap-2 justify-between items-center w-full">
        {data?.pool?.protocol === SushiSwapProtocol.SUSHISWAP_V3 ? (
          <ClaimRewardsButton
            rewards={rewardsForChain}
            className="!rounded-full flex-auto"
          />
        ) : null}
        <ManageDialog
          data={data}
          isOpen={isManageOpen}
          setIsOpen={setIsManageOpen}
          triggerChildren={
            <Button
              variant="networks"
              className="w-full !rounded-full dark:!bg-[#FFFFFF]/[.12] dark:hover:!bg-[#fff]/[.18] dark:active:!bg-[#fff]/[.24]"
            >
              Manage
            </Button>
          }
        />
      </div>
    )
  }
  if (data?.pool?.protocol === SushiSwapProtocol.SUSHISWAP_V2) {
    return <PriceRangeSparklineAmm data={data} />
  }
  return <CLMMSparkline data={data} />
}

const CLMMSparkline = ({ data }: { data: PortfolioV2PositionPoolType }) => {
  //@dev
  //@todo make this data into a resuable hook to avoid duplication
  const { address } = useAccount()
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
  const { data: v3Position } = useConcentratedPositionInfo({
    chainId: data.pool.chainId as SushiSwapV3ChainId,
    token0,
    tokenId: (data.position as PortfolioV2PositionV3PoolType['position'])
      ?.tokenId,
    token1,
  })
  const pricesFromPosition = v3Position
    ? getPriceOrderingFromPositionForUI(v3Position)
    : undefined
  const { priceLower, priceUpper } = usePriceInverter({
    priceLower: pricesFromPosition?.priceLower,
    priceUpper: pricesFromPosition?.priceUpper,
    quote: pricesFromPosition?.quote,
    base: pricesFromPosition?.base,
    invert: false,
  })
  const { data: positionDetails, isLoading: _isPositionDetailsLoading } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId: data.pool.chainId as SushiSwapV3ChainId,

      tokenId: (data.position as PortfolioV2PositionV3PoolType['position'])
        ?.tokenId,
    })

  const { pool, outOfRange } = useConcentratedDerivedMintInfo({
    chainId: data.pool.chainId as SushiSwapV3ChainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount: positionDetails?.fee,
    existingPosition: v3Position ?? undefined,
  })

  const below =
    pool && data && v3Position?.tickLower
      ? pool.tickCurrent < v3Position?.tickLower
      : undefined
  const above =
    pool && data && v3Position?.tickUpper
      ? pool.tickCurrent >= v3Position?.tickUpper
      : undefined
  const inRange =
    typeof below === 'boolean' && typeof above === 'boolean'
      ? !below && !above
      : false
  return (
    <PriceRangeSparklineCLMM
      poolAddress={data?.pool?.address as EvmAddress}
      chainId={data?.pool?.chainId as SushiSwapV3ChainId}
      protocol={data?.pool?.protocol as SushiSwapProtocol}
      strokeWidth={1.5}
      invert={false}
      priceLower={priceLower}
      priceUpper={priceUpper}
      outOfRange={outOfRange}
      range={
        below ? 'below' : above ? 'above' : inRange ? 'in-range' : 'in-range'
      }
    />
  )
}
