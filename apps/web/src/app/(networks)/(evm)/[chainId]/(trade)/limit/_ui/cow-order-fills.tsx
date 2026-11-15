'use client'

import { OrderStatus } from '@cowprotocol/cow-sdk'
import { Button, LinkExternal, List, Message } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { getCowTrades } from 'src/lib/swap/cow/orderbook'
import { getCowFillsQueryKey } from 'src/lib/swap/cow/query-keys'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import { getEvmChainById } from 'sushi/evm'
import { formatCowTokenAmount } from './cow-format'
import { useCowTokens } from './use-cow-tokens'

export function CowOrderFills({
  chainId,
  order,
}: { chainId: CowLimitChainId; order: CowOrder }): React.JSX.Element {
  const { sell, buy } = useCowTokens(chainId, order.sellToken, order.buyToken)
  const fills = useQuery({
    queryKey: getCowFillsQueryKey(chainId, order),
    queryFn: () => getCowTrades(chainId, order.uid),
    refetchInterval: order.status === OrderStatus.OPEN ? 20_000 : false,
  })

  if (fills.isError)
    return (
      <Message variant="destructive" size="xs" role="alert">
        Unable to load fills.{' '}
        <Button variant="link" size="xs" onClick={() => void fills.refetch()}>
          Retry
        </Button>
      </Message>
    )

  if (fills.isPending || !sell || !buy) return <List.KeyValue skeleton />
  if (!fills.data.length)
    return <List.KeyValue title="Fills">No fills yet</List.KeyValue>

  return (
    <>
      {fills.data.map((fill, index) => (
        <List.KeyValue
          key={`${fill.txHash}:${fill.logIndex}`}
          title={`Fill ${index + 1}`}
        >
          {fill.txHash ? (
            <LinkExternal
              className="text-blue hover:underline"
              href={getEvmChainById(chainId).getTransactionUrl(fill.txHash)}
            >
              {formatCowTokenAmount(sell, fill.sellAmount)} →{' '}
              {formatCowTokenAmount(buy, fill.buyAmount)}
            </LinkExternal>
          ) : (
            `${formatCowTokenAmount(sell, fill.sellAmount)} → ${formatCowTokenAmount(buy, fill.buyAmount)}`
          )}
        </List.KeyValue>
      ))}
    </>
  )
}
