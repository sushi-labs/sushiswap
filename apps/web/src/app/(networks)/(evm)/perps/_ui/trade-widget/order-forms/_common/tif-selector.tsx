import { Select, SelectContent, SelectItem, SelectTrigger } from '@sushiswap/ui'
import type { TimeInForceType } from 'src/lib/perps'
import { TIME_IN_FORCE, useAssetState } from '../../asset-state-provider'

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
      <SelectTrigger className="uppercase whitespace-nowrap max-w-fit text-xs !px-2 !gap-1">
        <span className="text-muted-foreground">TIF</span>
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
  )
}
