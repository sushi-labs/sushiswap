'use client'
import {
  Button,
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
} from '@sushiswap/ui'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import {
  currencyFormatter,
  useMarginTable,
  useUpdateLeverage,
} from 'src/lib/perps'
import { PercentageSlider, PerpsCard } from '../_common'
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
  const { updateLeverage, isPending } = useUpdateLeverage()
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
      if (nextOpen) {
        setNewLeverage(currentLeverage)
      }
    },
    [isControlled, onOpenChange, currentLeverage],
  )

  const percentage = useMemo(() => {
    if (newLeverage === 0) return 0
    return ((newLeverage / maxLeverage) * 100).toFixed(0)
  }, [newLeverage, maxLeverage])

  return (
    <PerpsDialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <PerpsDialogTrigger asChild>{trigger}</PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Adjust Leverage</PerpsDialogTitle>
          <PerpsDialogDescription>
            Adjust your leverage for {asset?.name} positions. The maximum
            leverage is {maxLeverage}x. Max position size decreases the higher
            your leverage.{' '}
            {lastTier &&
            newLeverage > lastTier?.maxLeverage &&
            Number(lastTier.lowerBound) > 0
              ? `The max position size for ${newLeverage}x leverage on ${asset?.name} is ${currencyFormatter.format(Number(lastTier.lowerBound))}.`
              : ''}
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4 text-sm">
            <PerpsCard className="flex flex-col items-center justify-center gap-3 p-6">
              <p className="text-5xl font-medium text-perps-muted">
                {newLeverage}x
              </p>
              <p className="text-perps-muted-5">{percentage}%</p>
            </PerpsCard>
            <PercentageSlider
              value={newLeverage}
              onChange={(val) => {
                handleLeverageChange(val)
              }}
              disabled={isLoading || isError || isPending}
              maxValue={maxLeverage}
              unit="x"
              variant="white"
              hideInput={true}
            />
            <PerpsChecker.Legal size="default" variant="perps-tertiary">
              <PerpsChecker.EnableTrading
                size="default"
                variant="perps-tertiary"
              >
                <PerpsChecker.BuilderFee
                  size="default"
                  variant="perps-tertiary"
                >
                  <PerpsChecker.HyperReferral
                    size="default"
                    variant="perps-tertiary"
                  >
                    <Button
                      size="default"
                      variant="perps-tertiary"
                      onClick={() =>
                        updateLeverage(
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
                  </PerpsChecker.HyperReferral>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
            <p className="text-center text-xs text-perps-muted-50">
              Setting a higher leverage increases the risk of liquidation.
            </p>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
