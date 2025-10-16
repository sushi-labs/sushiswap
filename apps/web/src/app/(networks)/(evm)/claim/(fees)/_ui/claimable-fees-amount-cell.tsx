import {
  Currency,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import { type FC, useMemo } from 'react'
import { formatUSD } from 'sushi'
import type { ClaimableFees } from './claimable-fees-tab'

export const ClaimableFeesAmountCell: FC<Row<ClaimableFees>> = ({
  original,
}) => {
  const { card, trigger } = useMemo(() => {
    const card = (
      <div className="flex flex-col gap-5 p-5 w-80">
        <span className="text-muted-foreground font-medium text-xs">
          Fees Breakdown
        </span>
        <div className="flex flex-col gap-5 p-4 bg-background rounded-xl">
          <div className="flex flex-col gap-4">
            {Object.values(original.feeAmounts).map((amount) => {
              return (
                <div
                  key={amount.currency.id}
                  className="flex justify-between text-sm"
                >
                  <div className="flex gap-1.5 items-center">
                    <Currency.Icon
                      currency={amount.currency}
                      width={16}
                      height={16}
                    />
                    <span className="font-medium">
                      {amount.toSignificant(4)} {amount.currency.symbol}
                    </span>
                  </div>

                  <span className="font-semibold text-muted-foreground">
                    {original.feeAmountsUSD[amount.currency.id]
                      ? formatUSD(original.feeAmountsUSD[amount.currency.id])
                      : '-'}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total</span>
            <span className="font-semibold">
              {formatUSD(original.totalFeesUSD)}
            </span>
          </div>
        </div>
      </div>
    )

    const rewardTokens = Object.values(original.feeAmounts)
      .slice(0, 3)
      .map((amount) => amount.currency)

    const additionalRewardTokens =
      Object.values(original.feeAmounts).length - rewardTokens.length

    const trigger = (
      <div className="flex gap-2 items-center w-fit">
        <span className="font-medium text-sm underline decoration-dotted underline-offset-2">
          {formatUSD(original.totalFeesUSD)}
        </span>
        <div className="flex gap-0.5 items-center">
          {rewardTokens.map((token) => (
            <Currency.Icon
              key={token.id}
              currency={token}
              width={16}
              height={16}
            />
          ))}
          {additionalRewardTokens > 0 ? (
            <div className="h-4 px-0.5 flex items-center rounded-full bg-[rgba(256,256,256,.04)] border border-[rgba(256,256,256,0.08)]">
              <span className="text-[8px] leading-4 font-semibold text-muted-foreground">
                +{additionalRewardTokens}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    )

    return { card, trigger }
  }, [original])

  return (
    <>
      <div className="hidden sm:block">
        <HoverCard openDelay={300} closeDelay={0}>
          <HoverCardTrigger asChild className="cursor-pointer">
            {trigger}
          </HoverCardTrigger>
          <HoverCardContent side="right" className="!p-0">
            {card}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="block sm:hidden">
        <Popover>
          <PopoverTrigger
            onClick={(e) => e.stopPropagation()}
            asChild
            className="cursor-pointer"
          >
            {trigger}
          </PopoverTrigger>
          <PopoverContent side="right" className="!p-0">
            {card}
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
