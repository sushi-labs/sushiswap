'use client'

import { OrderStatus } from '@cowprotocol/cow-sdk'
import {
  Button,
  List,
  Message,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { isCowOrderOpen } from 'src/lib/swap/cow/order'
import { getCowOrdersPage } from 'src/lib/swap/cow/order-history'
import { getCowOrdersQueryKey } from 'src/lib/swap/cow/query-keys'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import type { EvmAddress } from 'sushi/evm'
import { CowOrderCard } from './cow-order-card'

type CowOrderFilter =
  | 'all'
  | 'open'
  | OrderStatus.FULFILLED
  | OrderStatus.CANCELLED
  | OrderStatus.EXPIRED

const FILTERS: { value: CowOrderFilter; label: string }[] = [
  { value: 'all', label: 'All orders' },
  { value: 'open', label: 'Open' },
  { value: OrderStatus.FULFILLED, label: 'Filled' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled' },
  { value: OrderStatus.EXPIRED, label: 'Expired' },
]

function matchesFilter(order: CowOrder, filter: CowOrderFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'open') return isCowOrderOpen(order)
  return order.status === filter
}

function useCowOrders({
  chainId,
  owner,
}: {
  chainId: CowLimitChainId
  owner?: EvmAddress
}) {
  return useInfiniteQuery({
    queryKey: getCowOrdersQueryKey(chainId, owner),
    queryFn: ({ pageParam, signal }) => {
      if (!owner) throw new Error('Connect a wallet to view orders')
      return getCowOrdersPage({ chainId, owner, offset: pageParam, signal })
    },
    initialPageParam: 0,
    getNextPageParam: (page) => page.nextOffset,
    enabled: Boolean(owner),
    refetchInterval: 20_000,
    retry: 1,
  })
}

export function CowOrders({
  chainId,
  owner,
  onEdit,
  disabled,
}: {
  chainId: CowLimitChainId
  owner?: EvmAddress
  onEdit(order: CowOrder): void
  disabled: boolean
}): React.JSX.Element {
  const [filter, setFilter] = useState<CowOrderFilter>('all')

  const history = useCowOrders({ chainId, owner })
  const orders = history.data?.pages.flatMap((page) => page.orders) ?? []

  const visible = orders.filter((order) => matchesFilter(order, filter))

  return (
    <List className="!pt-0">
      <div className="flex items-center justify-between gap-2">
        <List.Label>Your CoW orders on Sushi</List.Label>
        <Select
          value={filter}
          onValueChange={(value) =>
            setFilter(
              FILTERS.find((option) => option.value === value)?.value ?? 'all',
            )
          }
        >
          <SelectTrigger aria-label="Filter orders" className="w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        {!owner ? (
          <List.Control className="p-4 text-sm text-muted-foreground">
            Connect your wallet to view orders.
          </List.Control>
        ) : history.isPending ? (
          <List.Control>
            <List.KeyValue skeleton />
            <List.KeyValue skeleton />
          </List.Control>
        ) : (
          <>
            {history.isError && (
              <Message variant="destructive" size="sm" role="alert">
                Unable to refresh CoW orders. Displayed statuses may be out of
                date.{' '}
                <Button
                  variant="link"
                  size="xs"
                  onClick={() => void history.refetch()}
                >
                  Retry
                </Button>
              </Message>
            )}
            {!history.isError && !visible.length && (
              <List.Control className="p-4 text-sm text-muted-foreground">
                No {filter === 'all' ? '' : `${filter} `}orders found.
              </List.Control>
            )}
            {visible.map((order) => (
              <CowOrderCard
                key={order.uid}
                chainId={chainId}
                order={order}
                onEdit={onEdit}
                disabled={disabled}
              />
            ))}
            {history.hasNextPage && (
              <Button
                variant="secondary"
                loading={history.isFetchingNextPage}
                onClick={() => void history.fetchNextPage()}
              >
                Load more orders
              </Button>
            )}
          </>
        )}
      </div>
    </List>
  )
}
