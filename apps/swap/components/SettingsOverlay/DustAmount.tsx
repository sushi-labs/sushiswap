import { CashIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { Popover, Switch, Typography } from '@sushiswap/ui'
import { useState } from 'react'

export const DustAmount = () => {
  const [dustAmount, setDustAmount] = useState(0)
  return (
    <div className="h-[52px] flex items-center">
      <div className="relative flex items-center justify-between w-full gap-3 group rounded-xl">
        <div className="flex items-center justify-center w-5 h-5">
          <CashIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
        </div>
        <div className="flex items-center justify-between w-full gap-1">
          <div className="flex gap-1">
            <Typography variant="sm" weight={500}>
              Dust Amount
            </Typography>
            <Popover
              tabIndex={-1}
              hover
              button={<InformationCircleIcon width={14} height={14} />}
              panel={
                <Typography variant="xs" weight={700} className="bg-slate-600 !rounded-lg w-40 p-3">
                  Native token to be received on destination chain
                </Typography>
              }
            />
          </div>
          <div className="flex gap-1">
            <Switch checked={dustAmount > 0} onChange={() => setDustAmount(dustAmount > 0 ? 0 : 1000)} size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
