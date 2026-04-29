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
import { type ReactNode, useMemo, useState } from 'react'
import { useUpdateLeverage } from 'src/lib/perps'
import { CheckboxSelectItem } from '../_common'
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
              <CheckboxSelectItem
                valueToSet="cross"
                currentValue={newLeverageType}
                setValue={setNewLeverageType}
                title="Cross Margin"
                description="All cross positions share the same cross margin as collateral.
                  In the event of liquidation, your cross margin balance and any
                  remaining open positions under assets in this mode may be
                  forfeited."
              />
              <CheckboxSelectItem
                valueToSet="isolated"
                currentValue={newLeverageType}
                setValue={setNewLeverageType}
                title="Isolated Margin"
                description="Manage your risk on individual positions by restricting the
                  amount of margin allocated to each. If the margin ratio of an
                  isolated position reaches 100%, the position will be
                  liquidated. Margin can be added or removed to individual
                  positions in this mode."
              />
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
