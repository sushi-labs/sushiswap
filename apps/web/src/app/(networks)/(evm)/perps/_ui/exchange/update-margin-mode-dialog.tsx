import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useMemo, useState } from 'react'
import { useUpdateLeverage } from 'src/lib/perps/exchange'
import { CheckboxSetting } from '../_common/checkbox-setting'
import { useAssetListState } from '../asset-selector/asset-list-provider'

export const UpdateMarginModeDialog = ({
  trigger,
  assetString,
  currentLeverage,
  currentLeverageType,
}: {
  trigger: ReactNode
  assetString: string
  currentLeverage: number
  currentLeverageType: 'isolated' | 'cross'
}) => {
  const [newLeverageType, setNewLeverageType] = useState<'isolated' | 'cross'>(
    currentLeverageType,
  )
  const [open, setOpen] = useState(false)
  const {
    state: {
      assetListQuery: { data, isLoading, isError },
    },
  } = useAssetListState()
  const { updateLeverageAsync, isPending } = useUpdateLeverage()
  const asset = useMemo(() => data?.get?.(assetString), [data, assetString])

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
          <DialogTitle>Adjust Marging Mode</DialogTitle>
          <DialogDescription className="capitalize">
            Adjust your {asset?.symbol} margin mode. Currently set to{' '}
            {currentLeverageType}.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
          <div className="flex flex-col gap-4 text-sm">
            <div
              onKeyDown={() => {
                setNewLeverageType('cross')
              }}
              onClick={() => {
                setNewLeverageType('cross')
              }}
              className={classNames(
                'p-2 flex text-left flex-col transition-colors gap-2 border border-accent cursor-pointer rounded',
                newLeverageType === 'cross' ? 'bg-white dark:bg-slate-700' : '',
              )}
            >
              <CheckboxSetting
                label="Cross Margin"
                value={newLeverageType === 'cross'}
                onChange={(value) =>
                  setNewLeverageType(value ? 'cross' : 'isolated')
                }
              />
              <p className="text-xs text-muted-foreground">
                All cross positions share the same cross margin as collateral.
                In the event of liquidation, your cross margin balance and any
                remaining open positions under assets in this mode may be
                forfeited.
              </p>
            </div>
            <div
              onKeyDown={() => {
                setNewLeverageType('isolated')
              }}
              onClick={() => {
                setNewLeverageType('isolated')
              }}
              className={classNames(
                'p-2 flex text-left flex-col transition-colors gap-2 border border-accent cursor-pointer rounded',
                newLeverageType === 'isolated'
                  ? 'bg-white dark:bg-slate-700'
                  : '',
              )}
            >
              <CheckboxSetting
                label="Isolated Margin"
                value={newLeverageType === 'isolated'}
                onChange={(value) =>
                  setNewLeverageType(value ? 'isolated' : 'cross')
                }
              />
              <p className="text-xs text-muted-foreground">
                Manage your risk on individual positions by restricting the
                amount of margin allocated to each. If the margin ratio of an
                isolated position reaches 100%, the position will be liquidated.
                Margin can be added or removed to individual positions in this
                mode.
              </p>
            </div>

            <Button
              onClick={async () => {
                await updateLeverageAsync(
                  {
                    assetString,
                    isCross: newLeverageType === 'cross',
                    newLeverage: currentLeverage,
                  },
                  {
                    onSuccess: () => {
                      setOpen(false)
                    },
                  },
                )
              }}
              disabled={
                isLoading ||
                isError ||
                isPending ||
                newLeverageType === currentLeverageType
              }
              loading={isPending}
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
