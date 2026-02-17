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
import { useUpdateLeverage } from 'src/lib/perps/exchange/use-update-leverage'
import { useMarginTable } from 'src/lib/perps/info/use-margin-table'
import { currencyFormatter } from 'src/lib/perps/utils'
import { PercentageSlider } from '../_common/percentage-slider'
import { useAssetListState } from '../asset-list-provider'

export const UpdateLeverageDialog = ({
  trigger,
  assetString,
  currentLeverage,
  isCross,
}: {
  trigger: ReactNode
  assetString: string
  currentLeverage: number
  isCross: boolean
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

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Leverage</DialogTitle>
          <DialogDescription>
            Adjust your leverage for {asset?.name} positions. The maximum
            leverge is {maxLeverage}x.
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
            <Button
              onClick={async () =>
                await updateLeverageAsync(
                  { assetString, isCross, newLeverage },
                  {
                    onSuccess: () => {
                      setOpen(false)
                    },
                  },
                )
              }
              disabled={isLoading || isError || isPending}
              loading={isPending}
            >
              Confirm
            </Button>
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
