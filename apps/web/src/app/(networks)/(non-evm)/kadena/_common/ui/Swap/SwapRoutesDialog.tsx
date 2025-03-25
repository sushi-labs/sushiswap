import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'
import { KADENA } from '~kadena/_common/constants/token-list'
import { useSwapState } from '~kadena/swap/swap-provider'
import { Icon } from '../General/Icon'

export const SwapRoutesDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const { route } = useSwapState()

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Route</DialogTitle>
          <DialogDescription>
            Our routing system automatically splits your trade across various
            pools to get you the best price.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="bg-secondary border border-accent rounded-xl">
          <div className="flex flex-col max-h-[300px] divide-y divide-accent">
            <div className="flex items-center w-full gap-3 justify-between bg-secondary p-3">
              {route?.map((_, idx) => (
                <SwapItem key={idx} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const SwapItem = () => {
  return (
    <div className="flex items-center gap-2">
      <Icon width={16} height={16} currency={KADENA} />
      <span className="text-sm font-medium">{KADENA?.symbol}</span>
    </div>
  )
}
