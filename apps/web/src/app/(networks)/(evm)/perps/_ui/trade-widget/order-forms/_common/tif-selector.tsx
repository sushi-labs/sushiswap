import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangleIcon'
import type { TimeInForceType } from 'src/lib/perps'
import { TIME_IN_FORCE, useAssetState } from '../../asset-state-provider'

const TIF_DESCRIPTIONS = {
  Gtc: 'GTC (Good Til Cancel): Order will rest until filled or canceled.',
  Ioc: 'IOC (Immediate Or Cancel): Any portion that is not immediately filled will be canceled.',
  Alo: 'ALO (Add Liquidity Only): Order will exist only as a limit order on the book. Also known as post-only.',
}

export const TifSelector = () => {
  const {
    state: { timeInForce },
    mutate: { setTimeInForce },
  } = useAssetState()
  return (
    <Select
      value={timeInForce}
      onValueChange={(value) => setTimeInForce(value as TimeInForceType)}
    >
      <SelectTrigger
        className="uppercase whitespace-nowrap max-w-fit text-xs min-h-[25px] h-[25px] !px-2 !gap-1 !bg-transparent"
        asChild
      >
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="underline decoration-dotted">{timeInForce}</div>
          <div>
            <DownTriangleIcon width={6} height={6} />
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="!bg-black/10 backdrop-blur-2xl text-sm max-w-[250px]">
        <p className="p-2 font-semibold">Time In Force</p>
        {TIME_IN_FORCE.map((tif) => (
          <SelectItem key={tif} value={tif} className="text-xs">
            {TIF_DESCRIPTIONS[tif]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
