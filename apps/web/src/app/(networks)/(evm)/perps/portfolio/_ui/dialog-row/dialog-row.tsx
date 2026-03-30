'use client'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import { useCallback, useState } from 'react'
import {
  DepositDialog,
  EvmCoreTransferDialog,
  PerpSpotTransferDialog,
  SendDialog,
  WithdrawDialog,
  useUserSettingsState,
} from '~evm/perps/_ui/account-management'
import { SwapStablesDialog } from '~evm/perps/_ui/account-management/swap-stables-dialog'

type DialogAction =
  | 'send'
  | 'perp-spot-transfer'
  | 'evm-core-transfer'
  | 'withdraw'
  | 'deposit'
  | 'swap-stables'

export const DialogRow = () => {
  const [activeModal, setActiveModal] = useState<ActiveModalState>({
    open: false,
    action: null,
  })

  const openModal = useCallback((action: DialogAction) => {
    setActiveModal({
      open: true,
      action,
    })
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal({
      open: false,
      action: null,
    })
  }, [])
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="perps-secondary"
        onClick={() => openModal('swap-stables')}
      >
        Swap Stablecoins
      </Button>
      {isUnifiedAccountModeEnabled ? (
        <HoverCard openDelay={0}>
          <HoverCardTrigger
            asChild
            tabIndex={0}
            className="opacity-50 cursor-not-allowed"
          >
            <Button variant="perps-secondary">
              Perps
              <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Spot
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            forceMount
            side="top"
            className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
          >
            <p>
              When unified account is enabled, trading is from a single unified
              account.
            </p>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <Button
          variant="perps-secondary"
          onClick={() => openModal('perp-spot-transfer')}
        >
          Perps
          <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Spot
        </Button>
      )}

      <Button
        variant="perps-secondary"
        onClick={() => openModal('evm-core-transfer')}
      >
        EVM
        <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Core
      </Button>

      <Button variant="perps-secondary" onClick={() => openModal('send')}>
        Send
      </Button>
      <Button variant="perps-secondary" onClick={() => openModal('withdraw')}>
        Withdraw
      </Button>
      <Button variant="perps-default" onClick={() => openModal('deposit')}>
        Deposit
      </Button>
      <SharedPositionModal activeModal={activeModal} onClose={closeModal} />
    </div>
  )
}

type ActiveModalState = {
  open: boolean
  action: DialogAction | null
}

const SharedPositionModal = ({
  activeModal,
  onClose,
}: {
  activeModal: ActiveModalState
  onClose: () => void
}) => {
  const { open, action } = activeModal

  if (!open || !action) return null

  switch (action) {
    case 'deposit':
      return (
        <DepositDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          trigger={<div />}
        />
      )
    case 'withdraw':
      return (
        <WithdrawDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          trigger={<div />}
        />
      )
    case 'send':
      return (
        <SendDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          trigger={<div />}
        />
      )
    case 'perp-spot-transfer':
      return (
        <PerpSpotTransferDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          trigger={<div />}
          defaultDex=""
        />
      )
    case 'evm-core-transfer':
      return (
        <EvmCoreTransferDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          trigger={<div />}
        />
      )
    case 'swap-stables':
      return (
        <SwapStablesDialog
          isOpen={open}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) onClose()
          }}
          trigger={<div />}
        />
      )

    default:
      return null
  }
}
