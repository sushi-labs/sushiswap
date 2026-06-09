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
import { useMemo, useState } from 'react'
import { useCancelOpenOrders, useUserOpenOrders } from 'src/lib/perps'
import { TableButton } from '../_common'
import { PerpsChecker } from '../perps-checker'

export const CancelAllOpenOrdersDialog = () => {
  const [open, setOpen] = useState(false)
  const { data: openOrders } = useUserOpenOrders({})
  const allCancelData = useMemo(
    () =>
      openOrders?.map((i) => ({
        orderId: i.oid,
        asset: i.coin,
      })),
    [openOrders],
  )

  const { cancelOrders, isPending } = useCancelOpenOrders()

  return (
    <PerpsDialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <PerpsDialogTrigger asChild>
        <TableButton disabled={isPending || allCancelData?.length === 0}>
          Cancel All
        </TableButton>
      </PerpsDialogTrigger>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Cancel All Open Orders</PerpsDialogTitle>
          <PerpsDialogDescription>
            Cancel all your open orders.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <PerpsDialogInnerContent>
          <div className="flex flex-col mt-6">
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
                        cancelOrders(
                          { cancelData: allCancelData },
                          {
                            onSuccess: () => {
                              setOpen(false)
                            },
                          },
                        )
                      }
                      loading={isPending}
                    >
                      Confirm Cancel All
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
