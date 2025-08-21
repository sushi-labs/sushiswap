import { Currency } from '@sushiswap/ui'
import { SUSHI } from 'sushi/currency'

export const TotalClaimableRewards = () => {
  return (
    <div className="flex items-center py-1 px-2 rounded-lg gap-2 text-xs bg-gradient-to-r whitespace-nowrap from-blue/[0.08] to-skyblue/[0.08]">
      <p className="font-medium text-slate-450 dark:text-pink-200">
        Total Claimable Rewards:{' '}
      </p>
      <div className="flex items-center gap-1">
        <p className="font-bold">123.3 SUSHI</p>
        <Currency.Icon
          className="!border-0"
          disableLink
          currency={SUSHI[1]}
          width={16}
          height={16}
        />
      </div>
    </div>
  )
}
