import type { PortfolioV2PositionPoolType } from '@sushiswap/graph-client/data-api-portfolio'
import { useIsSmScreen } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { useState } from 'react'
import { useClaimableRewards } from 'src/lib/hooks/react-query'
import {
  type EvmChainId,
  type MerklChainId,
  SushiSwapProtocol,
  isMerklChainId,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
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
    return <PriceRangeSparklineAmm />
  }
  return <PriceRangeSparklineCLMM />
}
