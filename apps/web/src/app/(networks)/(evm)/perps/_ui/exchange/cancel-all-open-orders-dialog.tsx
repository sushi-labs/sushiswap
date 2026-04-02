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
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <TableButton disabled={isPending || allCancelData?.length === 0}>
          Cancel All
        </TableButton>
      </DialogTrigger>
      <DialogContent variant="perps-default">
        <DialogHeader>
          <DialogTitle>Cancel All Open Orders</DialogTitle>
          <DialogDescription>Cancel all your open orders.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col mt-6">
          <PerpsChecker.Legal size="default" variant="perps-default">
            <PerpsChecker.EnableTrading size="default" variant="perps-default">
              <PerpsChecker.BuilderFee size="default" variant="perps-default">
                <PerpsChecker.Referral size="default" variant="perps-default">
                  <Button
                    size="default"
                    variant="perps-default"
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
                </PerpsChecker.Referral>
              </PerpsChecker.BuilderFee>
            </PerpsChecker.EnableTrading>
          </PerpsChecker.Legal>
        </div>
      </DialogContent>
    </Dialog>
  )
}
