import { Button } from '@sushiswap/ui/future/components/button'
import { FC } from 'react'
import { Tooltip } from '@sushiswap/ui/future/components/Tooltip'
import NonSSRWrapper from 'NonSSRWrapper'

export const SwitchAppType: FC = () => {
  return (
    <div className="flex">
      <Button size="sm" variant="outlined" color="default">
        Swap
      </Button>
      <NonSSRWrapper>
        <Tooltip description="Coming soon!">
          <Button className="pointer-events-none opacity-40" size="sm" variant="empty" color="default">
            Limit
          </Button>
        </Tooltip>
      </NonSSRWrapper>
    </div>
  )
}
