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
import { useUserFees } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatPercent } from 'sushi'

const FEE_TYPES = ['perps', 'spot'] as const

export const Fees = () => {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<(typeof FEE_TYPES)[number]>('perps')
  const address = useAccount('evm')
  const { data: feeData, isLoading, error } = useUserFees({ address })

  const { takerFee, makerFee } = useMemo(() => {
    if (!feeData) return { takerFee: '0', makerFee: '0' }
    return {
      takerFee:
        side === 'perps' ? feeData.userCrossRate : feeData.userSpotCrossRate,
      makerFee:
        side === 'perps' ? feeData.userAddRate : feeData.userSpotAddRate,
    }
  }, [feeData, side])

  return (
    <Card className="p-2 !rounded-md gap-6 flex !bg-[#18223B] border-transparent justify-between flex-col w-full">
      <div className="flex items-center justify-between gap-2 lg:text-base text-sm">
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
        <div className="w-24">
          <SkeletonText fontSize="2xl" />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading fees</div>
      ) : (
        <div className="font-medium text-lg md:text-2xl">{`${formatPercent(takerFee)} / ${formatPercent(makerFee)}`}</div>
      )}
      <div className="h-2" />
    </Card>
  )
}
