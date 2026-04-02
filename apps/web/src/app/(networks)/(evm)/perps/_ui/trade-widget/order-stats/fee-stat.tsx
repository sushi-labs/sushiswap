import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { formatPerpsPercent, useUserFees } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { StatItem } from '../../_common'
import { useAssetState } from '../asset-state-provider'

export const FeeStat = () => {
  const address = useAccount('evm')
  const { data: feeData } = useUserFees({ address })
  const {
    state: { asset },
  } = useAssetState()

  const { takerFee, makerFee } = useMemo(() => {
    if (!feeData) return { takerFee: '0', makerFee: '0' }
    const discount = 1 - Number(feeData.activeReferralDiscount || '0')
    return {
      takerFee:
        asset?.marketType === 'perp'
          ? Number(feeData.userCrossRate) * discount
          : Number(feeData.userSpotCrossRate) * discount,
      makerFee:
        asset?.marketType === 'perp'
          ? Number(feeData.userAddRate) * discount
          : Number(feeData.userSpotAddRate) * discount,
    }
  }, [feeData, asset?.marketType])

  return (
    <StatItem
      title={
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <span className="underline">Fees</span>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="bottom"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              Taker orders pay a {formatPerpsPercent(takerFee, 4)} fee. Maker
              orders pay a {formatPerpsPercent(makerFee, 4)} fee.
            </p>
          </HoverCardContent>
        </HoverCard>
      }
      value={`${formatPerpsPercent(takerFee, 4)} / ${formatPerpsPercent(makerFee, 4)}`}
    />
  )
}
