'use client'
import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { formatPerpsPercent, useUserFees } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'

const FEE_TYPES = ['perps', 'spot'] as const

export const Fees = () => {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<(typeof FEE_TYPES)[number]>('perps')
  const address = useAccount('evm')
  const { data: feeData, isLoading, error } = useUserFees({ address })

  const { takerFee, makerFee } = useMemo(() => {
    if (!address)
      return {
        takerFee: side === 'perps' ? 0.00045 : 0.0007,
        makerFee: side === 'perps' ? 0.00015 : 0.0004,
      }
    if (!feeData) return { takerFee: '0', makerFee: '0' }
    const discount = 1 - Number(feeData.activeReferralDiscount)
    return {
      takerFee:
        side === 'perps'
          ? Number(feeData.userCrossRate) * discount
          : Number(feeData.userSpotCrossRate) * discount,
      makerFee:
        side === 'perps'
          ? Number(feeData.userAddRate) * discount
          : Number(feeData.userSpotAddRate) * discount,
    }
  }, [feeData, side, address])

  return (
    <Card className="p-2 !rounded-md gap-2 flex !bg-[#18223B] border-transparent justify-between flex-col w-full">
      <div className="flex items-start justify-between gap-2 text-xs lg:text-sm">
        <div className="text-muted-foreground">Fees (Taker / Maker)</div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="capitalize flex items-center">
            {side}{' '}
            <ChevronDownIcon
              className={classNames(
                'w-4 h-4 min-w-4 ml-1 transition-transform',
                open ? 'rotate-180' : '',
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="paper !rounded-md !bg-[#18223B]">
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
      ) : error ? (
        <div className="text-red-500">Error loading fees</div>
      ) : (
        <div className="font-medium text-lg md:text-2xl ">{`${formatPerpsPercent(takerFee, 4)} / ${formatPerpsPercent(makerFee, 4)}`}</div>
      )}
      <div className="h-[16px] lg:h-[20px]" />
    </Card>
  )
}
