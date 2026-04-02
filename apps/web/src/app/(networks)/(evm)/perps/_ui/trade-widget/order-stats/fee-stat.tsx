import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { formatPerpsPercent, useFees } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { StatItem } from '../../_common'
import { useAssetState } from '../asset-state-provider'

export const FeeStat = () => {
  const address = useAccount('evm')
  const {
    state: { asset },
  } = useAssetState()
  const { takerFee, makerFee } = useFees({
    address,
    marketType: asset?.marketType,
  })

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
