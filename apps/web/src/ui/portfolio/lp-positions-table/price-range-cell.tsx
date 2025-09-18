import { useIsSmScreen } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { useState } from 'react'
import { useClaimableRewards } from 'src/lib/hooks/react-query'
import { useConcentratedPositionOwner } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionOwner'
import { ClaimRewardsButton } from 'src/ui/pool/ClaimRewardsButton'
import { SushiSwapProtocol } from 'sushi'
import { type MerklChainId, isMerklChainId } from 'sushi/config'
import { ManageDialog } from './manage-dialog/manage-dialog'
import { PriceRangeSparklineAmm } from './price-range-sparkline-amm'
import { PriceRangeSparklineCLMM } from './price-range-sparkline-clmm'

//@DEV @TODO - typed as any until real type is known
export const PriceRangeCell = ({
  data,
  isHovered,
}: { data: any; isHovered: boolean }) => {
  const isSmallScreen = useIsSmScreen()
  const [isManageOpen, setIsManageOpen] = useState(false)

  const { data: owner } = useConcentratedPositionOwner({
    chainId: data.chainId,
    tokenId: data.tokenId,
  })
  const { data: rewardsData } = useClaimableRewards({
    chainIds: [data.chainId],
    account: owner,
    enabled: isMerklChainId(data.chainId),
  })

  const rewardsForChain = rewardsData?.[data.chainId as MerklChainId]

  if ((isHovered || isManageOpen) && !isSmallScreen) {
    return (
      <div className="flex gap-2 justify-between items-center w-full">
        {data.protocol === SushiSwapProtocol.SUSHISWAP_V3 ? (
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
  if (data.protocol === SushiSwapProtocol.SUSHISWAP_V2) {
    return <PriceRangeSparklineAmm />
  }
  return <PriceRangeSparklineCLMM />
}
