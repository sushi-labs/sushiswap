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
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useMemo, useState } from 'react'
import { useUpdateLeverage } from 'src/lib/perps'
import { CheckboxSetting } from '../_common'
import { useAssetListState } from '../asset-selector'
import { PerpsChecker } from '../perps-checker'

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
  const { updateLeverage, isPending } = useUpdateLeverage()
  const asset = useMemo(() => data?.get?.(assetString), [data, assetString])

  return (
    <PerpsDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <PerpsDialogTrigger asChild>{trigger}</PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Adjust Margin Mode</PerpsDialogTitle>
          <PerpsDialogDescription className="capitalize">
            Adjust your {asset?.symbol} margin mode. Currently set to{' '}
            <span className="font-medium text-white">
              {currentLeverageType}.
            </span>
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col gap-4 text-sm h-full">
            <div className="flex lg:flex-row flex-col lg:items-start gap-4 text-sm h-full">
              <div
                onKeyDown={() => {
                  setNewLeverageType('cross')
                }}
                onClick={() => {
                  setNewLeverageType('cross')
                }}
                className={classNames(
                  'p-2 flex text-left flex-col w-full h-full transition-colors gap-2 cursor-pointer rounded',
                  newLeverageType === 'cross' ? '' : 'bg-[#ffffff03]',
                )}
                style={{
                  background:
                    newLeverageType === 'cross'
                      ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)), radial-gradient(50% 45.68% at 50% 0.02%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)'
                      : '',
                }}
              >
                <CheckboxSetting
                  label=""
                  value={newLeverageType === 'cross'}
                  onChange={(value) =>
                    setNewLeverageType(value ? 'cross' : 'isolated')
                  }
                />
                <p
                  className={classNames(
                    'text-lg  font-semibold',
                    newLeverageType === 'cross'
                      ? 'text-perps-muted'
                      : 'text-perps-muted-50',
                  )}
                >
                  Cross Margin
                </p>
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
                  'p-2 flex text-left flex-col w-full h-full transition-colors gap-2 cursor-pointer rounded',
                  newLeverageType === 'isolated' ? '' : 'bg-[#ffffff03]',
                )}
                style={{
                  background:
                    newLeverageType === 'isolated'
                      ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)), radial-gradient(50% 45.68% at 50% 0.02%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)'
                      : '',
                }}
              >
                <CheckboxSetting
                  label=""
                  value={newLeverageType === 'isolated'}
                  onChange={(value) =>
                    setNewLeverageType(value ? 'isolated' : 'cross')
                  }
                />
                <p
                  className={classNames(
                    'text-lg  font-semibold',
                    newLeverageType === 'isolated'
                      ? 'text-perps-muted'
                      : 'text-perps-muted-50',
                  )}
                >
                  Isolated Margin
                </p>
                <p className="text-xs text-muted-foreground">
                  Manage your risk on individual positions by restricting the
                  amount of margin allocated to each. If the margin ratio of an
                  isolated position reaches 100%, the position will be
                  liquidated. Margin can be added or removed to individual
                  positions in this mode.
                </p>
              </div>
            </div>

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
                      onClick={() => {
                        updateLeverage(
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
                  </PerpsChecker.HyperReferral>
                </PerpsChecker.BuilderFee>
              </PerpsChecker.EnableTrading>
            </PerpsChecker.Legal>
          </div>
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}
