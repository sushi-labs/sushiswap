import { Button } from '@sushiswap/ui'
import { useState } from 'react'
import { ManageDialog } from './manage-dialog/manage-dialog'
import { PriceRangeSparklineAmm } from './price-range-sparkline-amm'
import { PriceRangeSparklineCLMM } from './price-range-sparkline-clmm'

//@DEV @TODO - typed as any until real type is known
export const PriceRangeCell = ({
  data,
  isHovered,
}: { data: any; isHovered: boolean }) => {
  const [isManageOpen, setIsManageOpen] = useState(false)
  if (isHovered || isManageOpen) {
    return (
      <div className="flex items-center justify-between gap-2 w-full">
        {/* make claim into new comp */}
        {data.protocol === 'SUSHISWAP_V3' ? (
          <Button className="w-full !rounded-full">Claim</Button>
        ) : null}
        <ManageDialog
          data={data}
          isOpen={isManageOpen}
          setIsOpen={setIsManageOpen}
          triggerChildren={
            <Button variant="networks" className="w-full !rounded-full">
              Manage
            </Button>
          }
        />
      </div>
    )
  }
  if (data.protocol === 'SUSHISWAP_V2') {
    return <PriceRangeSparklineAmm />
  }
  return <PriceRangeSparklineCLMM />
}
