import { useMemo } from 'react'
import { useCancelOpenOrders } from 'src/lib/perps'
import { TableButton } from '../_common'

export const CancelOpenOrder = ({
  orderId,
  coin,
}: {
  orderId: number
  coin: string
}) => {
  const { cancelOrdersAsync, isPending } = useCancelOpenOrders()
  const cancelData = useMemo(() => {
    if (!orderId || !coin) return undefined
    return [
      {
        orderId,
        asset: coin,
      },
    ]
  }, [orderId, coin])
  return (
    <TableButton
      onClick={async () => {
        if (!cancelData) return
        await cancelOrdersAsync({ cancelData })
      }}
      disabled={isPending || !cancelData}
    >
      Cancel
    </TableButton>
  )
}
