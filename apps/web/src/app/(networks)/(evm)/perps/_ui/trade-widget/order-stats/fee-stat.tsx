import { formatSize } from '@nktkas/hyperliquid/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useUserFees } from 'src/lib/perps/info/use-user-fees'
import { useAccount } from 'src/lib/wallet'
import { StatItem } from '../../_common/stat-item'

export const FeeStat = () => {
  const address = useAccount('evm')
  const { data: feeData } = useUserFees({ address })

  const { takerFee, makerFee } = useMemo(() => {
    if (!feeData) return { takerFee: '0', makerFee: '0' }
    return {
      takerFee: `${formatSize(Number(feeData.userCrossRate) * 100, 5)}%`,
      makerFee: `${formatSize(Number(feeData.userAddRate) * 100, 5)}%`,
    }
  }, [feeData])

  return (
    <StatItem
      title={
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger asChild tabIndex={0}>
            <span className="underline">Fees</span>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              Taker orders pay a {takerFee} fee. Maker orders pay a {makerFee}{' '}
              fee.
            </p>
          </HoverCardContent>
        </HoverCard>
      }
      value={`${takerFee} / ${makerFee}`}
    />
  )
}
