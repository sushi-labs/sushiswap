'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Message,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  currencyFormatter,
  useMarginTable,
  useUpdateLeverage,
} from 'src/lib/perps'
import { PercentageSlider } from '../_common'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'

export const UpdateLeverageDialog = ({
  trigger,
  assetString,
  currentLeverage,
  isCross,
  isOpen,
  onOpenChange,
}: {
  trigger: ReactNode
  assetString: string
  currentLeverage: number
  isCross: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [open, setOpen] = useState(false)
  const [newLeverage, setNewLeverage] = useState<number>(currentLeverage)
  const {
    state: {
      assetListQuery: { data, isLoading, isError },
    },
  } = useAssetListState()
  const { updateLeverageAsync, isPending } = useUpdateLeverage()
  const asset = useMemo(() => data?.get?.(assetString), [data, assetString])
  const maxLeverage = useMemo(
    () => asset?.maxLeverage ?? 1,
    [asset?.maxLeverage],
  )

  const { data: marginTable } = useMarginTable({
    marginTableId: asset?.marginTableId,
  })
  const lastTier = useMemo(
    () => marginTable?.marginTiers?.[marginTable.marginTiers.length - 1],
    [marginTable],
  )

  const handleLeverageChange = useCallback(
    (value: number) => {
      const val = value
      if (val < 1) {
        setNewLeverage(1)
      } else if (val > maxLeverage) {
        setNewLeverage(maxLeverage)
      } else {
        setNewLeverage(val)
      }
    },
    [maxLeverage],
  )

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
          <DialogTitle>Adjust Leverage</DialogTitle>
          <DialogDescription>
            Adjust your leverage for {asset?.name} positions. The maximum
            leverage is {maxLeverage}x.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <p>
              Max position size decreases the higher your leverage.{' '}
              {lastTier && newLeverage > lastTier?.maxLeverage
                ? `The max position size for ${newLeverage}x leverage on ${asset?.name} is ${currencyFormatter.format(Number(lastTier.lowerBound))}.`
                : ''}
            </p>
            <PercentageSlider
              value={newLeverage}
              onChange={(val) => {
                handleLeverageChange(val)
              }}
              disabled={isLoading || isError || isPending}
              maxValue={maxLeverage}
            />
            <PerpsChecker.Legal variant="perps-default">
              <PerpsChecker.EnableTrading variant="perps-default">
                <PerpsChecker.BuilderFee variant="perps-default">
                  <PerpsChecker.Referral variant="perps-default">
                    <Button
                      variant="perps-default"
                      onClick={async () =>
                        await updateLeverageAsync(
                          { assetString, isCross, newLeverage },
                          {
                            onSuccess: () => {
                              handleOpenChange(false)
                              setNewLeverage(newLeverage)
                            },
                          },
                        )
                      }
                      disabled={isLoading || isError || isPending}
                      loading={isPending}
                    >
                      Confirm
                    </Button>
                  </PerpsChecker.Referral>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
            <div className="bg-accent w-full h-[1px]" />
            <Message variant="warning" size="xs" className="!p-3 text-center">
              Setting a higher leverage increases the risk of liquidation.
            </Message>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
