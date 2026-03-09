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
import { useCancelOpenOrders } from 'src/lib/perps/exchange/use-cancel-open-orders'
import { useUserOpenOrders } from 'src/lib/perps/use-user-open-orders'
import { TableButton } from '../_common/table-button'

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

  const { cancelOrdersAsync, isPending } = useCancelOpenOrders()

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel All Open Orders</DialogTitle>
          <DialogDescription>Cancel all your open orders.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col mt-6">
          <Button
            onClick={async () =>
              await cancelOrdersAsync(
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
