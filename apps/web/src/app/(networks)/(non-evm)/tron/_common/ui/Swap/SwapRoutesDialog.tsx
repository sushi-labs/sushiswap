import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@sushiswap/ui'
import { FC, ReactNode } from 'react'
import { useTokenInfo } from '~tron/_common/lib/hooks/useTokenInfo'
import { useSwapState } from '~tron/swap/swap-provider'
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
              {route?.map((tokenAddress, idx) => (
                <SwapItem tokenAddress={tokenAddress} key={idx} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const SwapItem = ({ tokenAddress }: { tokenAddress: string }) => {
  const { data } = useTokenInfo({ tokenAddress })

  return (
    <div className="flex items-center gap-2">
      <Icon width={16} height={16} currency={data} />
      <span className="text-sm font-medium">{data?.symbol}</span>
    </div>
  )
}
