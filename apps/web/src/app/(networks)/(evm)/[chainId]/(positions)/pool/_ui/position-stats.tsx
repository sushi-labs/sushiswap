'use client'
import type { PoolChainId } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Card, CardContent } from '@sushiswap/ui'
import { LinkInternal } from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { DataItem } from 'src/app/(networks)/(evm)/_common/ui/data-item'
import { useSushiV2UserPositions } from 'src/lib/hooks'
import { isV3MigrateChainId } from 'src/lib/wagmi/hooks/migrate/types'
import { useConcentratedLiquidityPositions } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-liquidity-positions'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { formatUSD, getChainById } from 'sushi'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/evm'
import { SushiSwapV3ChainIds, isEvmTestnetChainId } from 'sushi/evm'
import { ClaimableFeesDialog } from './claim-fees/claimable-fees-dialog'
import { usePositionFilters } from './position-filters-provider'

const CLAIM_SUPPORTED_CHAIN_IDS = SushiSwapV3ChainIds.filter(
  (chainId) => !isEvmTestnetChainId(chainId),
)

export const PositionStats = ({
  chainId,
}: {
  chainId: PoolChainId
}) => {
  const searchParams = useSearchParams()
  const canMigrate = isV3MigrateChainId(chainId)
  const address = useAccount('evm')
  const isMounted = useIsMounted()
  const {
    state: { tab, hideClosedPositions },
  } = usePositionFilters()
  const {
    data: v3Positions,
    isInitialLoading: isV3PositionsLoading,
    isError: isV3PositionsError,
  } = useConcentratedLiquidityPositions({
    account: address,
    chainIds: isSushiSwapV3ChainId(chainId) ? [chainId] : [],
  })
  const {
    data: allV3Positions,
    isInitialLoading: isAllV3PositionsLoading,
    isError: isAllV3PositionsError,
  } = useConcentratedLiquidityPositions({
    account: address,
    chainIds: CLAIM_SUPPORTED_CHAIN_IDS,
  })
  const {
    data: v2Positions,
    isLoading: isV2PositionsLoading,
    isError: isV2PositionsError,
  } = useSushiV2UserPositions({
    user: address,
    chainId: isSushiSwapV2ChainId(chainId) ? chainId : undefined,
  })
  const isLoading =
    isV2PositionsLoading ||
    isV3PositionsLoading ||
    isAllV3PositionsLoading ||
    !isMounted
  const isError =
    isV2PositionsError || isV3PositionsError || isAllV3PositionsError

  const { totalPosValue, totalPosCount } = useMemo(() => {
    const _v3Positions = v3Positions?.filter((pos) =>
      hideClosedPositions ? pos.liquidity !== 0n : true,
    )
    const totalV2PosValue =
      v2Positions?.reduce((acc, pos) => acc + pos.value, 0) ?? 0
    const totalV3PosValue =
      _v3Positions?.reduce((acc, pos) => acc + pos.position.positionUSD, 0) ?? 0
    const totalPosCount =
      tab === 'v2' ? (v2Positions?.length ?? 0) : (_v3Positions?.length ?? 0)
    return {
      totalPosValue: tab === 'v2' ? totalV2PosValue : totalV3PosValue,
      totalPosCount,
    }
  }, [tab, v2Positions, v3Positions, hideClosedPositions])

  const totalUnclaimedFees = useMemo(
    () =>
      allV3Positions?.reduce(
        (acc, pos) => acc + pos.position.unclaimedUSD,
        0,
      ) ?? 0,
    [allV3Positions],
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <div className="col-span-1">
        <Card>
          <CardContent className="pt-5">
            <DataItem
              label="Position Value"
              value={formatUSD(totalPosValue)}
              isLoading={isLoading}
              isError={isError}
              subLabel={getChainById(chainId).name}
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardContent className="pt-5">
            <DataItem
              label={
                canMigrate &&
                tab === 'v2' &&
                v2Positions &&
                v2Positions?.length > 0 ? (
                  <LinkInternal
                    href={`/${getChainById(chainId).key}/migrate?${searchParams.toString()}`}
                    className="text-pink"
                  >
                    Migrate V2 Positions
                  </LinkInternal>
                ) : (
                  <div>Positions</div>
                )
              }
              value={totalPosCount}
              isLoading={isLoading}
              isError={isError}
              subLabel={`SushiSwap${tab === 'v2' ? ' V2' : ' V3'}`}
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        <Card>
          <CardContent className="pt-5">
            <DataItem
              label={
                <div className="relative">
                  <div>Total unclaimed fees</div>
                  <div className="absolute top-0 right-0 z-[1]">
                    <ClaimableFeesDialog />
                  </div>
                </div>
              }
              value={formatUSD(totalUnclaimedFees)}
              isLoading={isLoading}
              isError={isError}
              subLabel={`Fees earned`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
