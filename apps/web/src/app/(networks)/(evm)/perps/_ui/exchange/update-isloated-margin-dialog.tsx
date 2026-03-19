'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  type UserPositionsItemType,
  formatSize,
  perpsNumberFormatter,
  useUpdateIsolatedMargin,
} from 'src/lib/perps'
import { IsolatedMarginInput, SideToggle, StatItem } from '../_common'
import { PerpsChecker } from '../perps-checker'

export const UpdateIsolatedMarginDialog = ({
  trigger,
  position,
  isOpen,
  onOpenChange,
}: {
  trigger: ReactNode
  position: UserPositionsItemType
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('')
  const { updateIsolatedMargin, isPending } = useUpdateIsolatedMargin()

  const currentMargin = useMemo(() => {
    return position.position.marginUsed
  }, [position])

  const maxValue = useMemo(() => {
    if (type === 'add') {
      const val = position.clearingHouseDataForDex?.withdrawable ?? '0'
      if (Number(val) < 0.01) return '0'
      return val
    }
    return maxRemovableIsolatedMargin({
      marginUsed: currentMargin,
      szi: position.position.szi,
      markPrice: position.markPrice,
      leverage: position.position.leverage.value,
    })
  }, [position, currentMargin, type])

  const handleMaxAmount = useCallback(() => {
    setAmount(maxValue)
  }, [maxValue])

  const updateData = useMemo(() => {
    if (Number(amount) <= 0) return null
    try {
      const data = {
        assetString: position.position.coin,
        side: position.side === 'B' ? ('long' as const) : ('short' as const),
        amount: formatSize(amount, 2),
        isAdd: type === 'add',
      }
      return data
    } catch {
      return null
    }
  }, [type, position.position.coin, position.side, amount])

  const isControlled = isOpen !== undefined
  const resolvedOpen = isControlled ? isOpen : open

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader>
          <DialogTitle>Adjust Margin</DialogTitle>
          <DialogDescription>
            Decrease the chance of liquidation by adding more margin or remove
            excess margin to use for other positions.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-2">
              <IsolatedMarginInput
                value={amount}
                onChange={setAmount}
                setMax={handleMaxAmount}
                className="!py-0 px-2"
              />

              <SideToggle
                options={['add', 'remove']}
                side={type}
                setSide={setType}
                baseSymbol="Add"
                quoteSymbol="Remove"
              />
            </div>
            <div className="flex flex-col gap-2">
              <StatItem
                title={`Current Margin for ${position.assetSymbol}`}
                value={`${perpsNumberFormatter({ value: currentMargin ?? '0', minFraxDigits: 2, maxFraxDigits: 2 })} USDC`}
              />
              <StatItem
                title={`Margin available to ${type}`}
                value={`${perpsNumberFormatter({ value: maxValue ?? '0', minFraxDigits: 2, maxFraxDigits: 2 })} USDC`}
              />
            </div>
            <PerpsChecker.Legal variant="perps-default">
              <PerpsChecker.EnableTrading variant="perps-default">
                <PerpsChecker.BuilderFee variant="perps-default">
                  <PerpsChecker.Referral variant="perps-default">
                    <Button
                      variant="perps-default"
                      onClick={() => {
                        if (!updateData) return
                        updateIsolatedMargin(updateData, {
                          onSuccess: () => {
                            handleOpenChange(false)
                            setAmount('')
                          },
                        })
                      }}
                      loading={isPending}
                      disabled={
                        !updateData || Number(amount) > Number(maxValue)
                      }
                    >
                      Confirm
                    </Button>
                  </PerpsChecker.Referral>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function maxRemovableIsolatedMargin({
  marginUsed,
  szi,
  markPrice,
  leverage,
  decimals = 6,
}: {
  marginUsed: string
  szi: string
  markPrice: string
  leverage: number
  decimals?: number
}) {
  const m = Number(marginUsed)
  const Q = Math.abs(Number(szi))
  const P = Number(markPrice)

  if (
    !Number.isFinite(m) ||
    !Number.isFinite(Q) ||
    !Number.isFinite(P) ||
    leverage <= 0
  )
    return '0'

  const notional = Q * P
  const minKeep = notional / leverage
  const raw = Math.max(0, m - minKeep)

  const factor = 10 ** decimals

  return (Math.floor(raw * factor) / factor).toString()
}
