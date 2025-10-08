'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { useIsSmScreen } from '@sushiswap/hooks'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  classNames,
} from '@sushiswap/ui'
import { useState } from 'react'
import { QuickSelectProvider } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select-provider'
import type { EvmCurrency } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '~evm/[chainId]/[trade]/_ui/swap/derivedstate-simple-swap-provider'
import { TradeWidget } from '~evm/[chainId]/[trade]/_ui/swap/trade/trade-widget'

interface TradeModalProps {
  token: EvmCurrency
  side: 'buy' | 'sell'
  triggerClassName?: string
  setIsModalOpen?: (isOpen: boolean) => void
  isModalOpen?: boolean
}

export const TradeModal = ({
  token,
  side,
  triggerClassName = '',
  setIsModalOpen: externalSetIsModalOpen,
  isModalOpen: externalIsModalOpen,
}: TradeModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsModalOpen ?? internalIsOpen
  const setIsOpen = externalSetIsModalOpen ?? setInternalIsOpen

  const { mutate } = useDerivedStateSimpleSwap()
  const isSmallScreen = useIsSmScreen()

  const isBuy = side === 'buy'
  const label = isBuy ? 'Buy' : 'Sell'

  const buttonClasses = isBuy
    ? 'text-slate-50 !rounded-full font-semibold !bg-green-500/100 hover:!bg-green-500/90 focus:!bg-green-500/90 active:!bg-green-500/80'
    : 'text-slate-50 !rounded-full font-semibold !bg-red-100/100 dark:!bg-[#EA3830]/100 dark:hover:!bg-[#EA3830]/90 dark:focus:!bg-[#EA3830]/90 dark:active:!bg-[#EA3830]/80 hover:!bg-red-100/90 focus:!bg-red-100/90 active:!bg-red-100/80'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className={classNames(
            `w-full md:w-[64px] h-[32px] min-h-[32px]`,
            'transition-all',
            buttonClasses,
            triggerClassName,
          )}
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
      <DialogContent
        className={classNames(
          '!flex flex-col md:h-auto h-[100dvh] !rounded-none md:!rounded-xl bg-[#FDFCFD] !p-5 max-w-none md:!max-w-[500px] !pb-0',
        )}
        hideClose
      >
        <DialogHeader className="flex !flex-row justify-between items-center w-full h-auto">
          <DialogTitle className="!text-[20px]">Trade</DialogTitle>
          <DialogClose>
            <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
          </DialogClose>
        </DialogHeader>
        <QuickSelectProvider _isEnabled={!isSmallScreen}>
          <TradeWidget
            _tradeMode="swap"
            wrapperClassName="!p-0 !bg-transparent !border-none !shadow-none !pb-2"
            tradeModeRowClassName="pt-2 pb-4 md:pb-0 md:pt-0"
          />
        </QuickSelectProvider>
      </DialogContent>
    </Dialog>
  )
}
