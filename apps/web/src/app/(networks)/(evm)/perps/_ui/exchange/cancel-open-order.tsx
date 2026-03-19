import { useMemo } from 'react'
import { useCancelOpenOrders, useLegalCheck } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { TableButton } from '../_common'

export const CancelOpenOrder = ({
  orderId,
  coin,
}: {
  orderId: number
  coin: string
}) => {
  const address = useAccount('evm')
  const { data } = useLegalCheck({ address })
  const { cancelOrders, isPending } = useCancelOpenOrders()
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
      onClick={() => {
        if (!cancelData) return
        cancelOrders({ cancelData })
      }}
      disabled={isPending || !cancelData || !data?.ipAllowed}
    >
      Cancel
    </TableButton>
  )
}
