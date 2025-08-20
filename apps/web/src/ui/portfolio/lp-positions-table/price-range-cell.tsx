import { Button } from '@sushiswap/ui'
import { PriceRangeSparklineAmm } from './price-range-sparkline-amm'
import { PriceRangeSparklineCLMM } from './price-range-sparkline-clmm'

//@DEV @TODO - typed as any until real type is known
export const PriceRangeCell = ({
  data,
  isHovered,
}: { data: any; isHovered: boolean }) => {
  if (isHovered) {
    return (
      <div className="flex items-center justify-between gap-2 w-full">
        {/* make claim into new comp */}
        {data.protocol === 'SUSHISWAP_V3' ? (
          <Button className="w-full !rounded-full">Claim</Button>
        ) : null}
        {/* make manage into new comp, it will be dialog trigger for position details and management */}
        <Button variant="networks" className="w-full !rounded-full">
          Manage
        </Button>
      </div>
    )
  }
  if (data.protocol === 'SUSHISWAP_V2') {
    return <PriceRangeSparklineAmm />
  }
  return <PriceRangeSparklineCLMM />
}
