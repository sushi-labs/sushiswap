'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from '@sushiswap/ui'
import { useDerivedStateSimpleSwap } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { TradeWidget } from 'src/ui/swap/trade/trade-widget'
import type { Type } from 'sushi/currency'

interface TradeModalProps {
  token: Type
  side: 'buy' | 'sell'
}

export const TradeModal = ({ token, side }: TradeModalProps) => {
  const { mutate } = useDerivedStateSimpleSwap()

  const isBuy = side === 'buy'
  const label = isBuy ? 'BUY' : 'SELL'

  const buttonClasses = isBuy
    ? 'text-slate-50 !rounded-full !bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500'
    : 'text-slate-50 !rounded-full !bg-[#EA3830] font-semibold hover:bg-[#EA3830] active:bg-[#EA3830]/95 focus:bg-[#EA3830]'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className={`w-full ${buttonClasses} md:w-[64px] h-[32px] min-h-[32px]`}
          onClick={() => {
            if (isBuy) {
              mutate.setToken0(token)
            } else {
              mutate.setToken1?.(token)
            }
          }}
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="!pb-0" hideClose>
        <DialogHeader className="flex !flex-row justify-between items-center w-full">
          <DialogTitle className="!text-[20px]">Trade</DialogTitle>
          <DialogClose>
            <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
          </DialogClose>
        </DialogHeader>
        <TradeWidget _tradeMode="swap" wrapperClassName="!p-0" />
      </DialogContent>
    </Dialog>
  )
}
