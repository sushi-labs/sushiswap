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
import type { KvmToken } from 'sushi/kvm'
import { useSwapState } from '~kadena/swap/swap-provider'
import { Icon } from '../General/Icon'

export const SwapRoutesDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const { route, token0, token1 } = useSwapState()

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
        <ScrollArea className="border bg-secondary border-accent rounded-xl">
          <div className="flex flex-col max-h-[300px] divide-y divide-accent">
            <div className="flex items-center justify-between w-full gap-3 p-3 bg-secondary">
              {route?.length ? (
                <>
                  <SwapItem token={token0} />
                  <SwapItem token={token1} />
                </>
              ) : (
                'No route found'
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const SwapItem = ({ token }: { token?: KvmToken }) => {
  return (
    <div className="flex items-center gap-2">
      <Icon width={16} height={16} currency={token} />
      <span className="text-sm font-medium">{token?.symbol}</span>
    </div>
  )
}
