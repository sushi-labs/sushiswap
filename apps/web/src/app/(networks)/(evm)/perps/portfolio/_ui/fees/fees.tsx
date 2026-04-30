'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangle'
import { useState } from 'react'
import { formatPerpsPercent, useFees } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '~evm/perps/_ui/_common'

const FEE_TYPES = ['perps', 'spot'] as const

export const Fees = () => {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<(typeof FEE_TYPES)[number]>('perps')
  const address = useAccount('evm')
  const { takerFee, makerFee } = useFees({
    address,
    marketType: side === 'perps' ? 'perp' : 'spot',
  })
  const isLoading = takerFee === '0' || makerFee === '0'

  return (
    <PerpsCard className="p-2 gap-2 flex justify-between flex-col" fullWidth>
      <div className="flex items-start justify-between gap-2 text-xs lg:text-sm">
        <div className="text-perps-muted-50">Fees (Taker / Maker)</div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="capitalize flex items-center text-perps-muted-50">
            {side}{' '}
            <DownTriangleIcon
              className={classNames(
                'w-1.5 h-1.5 min-w-1.5 ml-1 transition-transform',
                open ? 'rotate-180' : '',
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="paper !rounded-md !bg-black/10">
            {FEE_TYPES.map((type) => (
              <DropdownMenuItem
                key={type}
                className="capitalize"
                onClick={() => {
                  setSide(type)
                }}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : (
        <div className="font-medium text-lg md:text-2xl ">{`${formatPerpsPercent(takerFee, 4)} / ${formatPerpsPercent(makerFee, 4)}`}</div>
      )}
      <div className="h-[16px] lg:h-[20px]" />
    </PerpsCard>
  )
}
