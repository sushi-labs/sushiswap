import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@sushiswap/ui'
import type { TimeInForceType } from 'src/lib/perps'
import { TIME_IN_FORCE, useAssetState } from '../../asset-state-provider'

export const TifSelector = () => {
  const {
    state: { timeInForce },
    mutate: { setTimeInForce },
  } = useAssetState()
  return (
    <div className="flex items-center gap-1">
      <HoverCard>
        <HoverCardTrigger tabIndex={0} asChild>
          <span className="text-muted-foreground underline decoration-dotted text-xs">
            TIF
          </span>
        </HoverCardTrigger>
        <HoverCardContent
          forceMount
          side="top"
          className="!px-3 !py-2 max-w-[320px] whitespace-normal flex flex-col gap-2 text-left text-xs"
        >
          <p>Time In Force</p>
          <p>
            GTC (Good Til Cancel): Order will rest until filled or canceled.
          </p>
          <p>
            IOC (Immediate Or Cancel): Any portion that is not immediately
            filled will be canceled.
          </p>
          <p>
            ALO (Add Liquidity Only): Order will exist only as a limit order on
            the book. Also known as post-only.
          </p>
        </HoverCardContent>
      </HoverCard>
      <Select
        value={timeInForce}
        onValueChange={(value) => setTimeInForce(value as TimeInForceType)}
      >
        <SelectTrigger className="uppercase whitespace-nowrap max-w-fit text-xs !px-2 !gap-1">
          {timeInForce}
        </SelectTrigger>
        <SelectContent>
          {TIME_IN_FORCE.map((tif) => (
            <SelectItem key={tif} value={tif} className="uppercase text-xs">
              {tif}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
