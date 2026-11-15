'use client'

import {
  Button,
  List,
  Message,
  Tabs,
  TabsList,
  TabsTrigger,
  classNames,
} from '@sushiswap/ui'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useState } from 'react'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { isCowOrderOpen } from 'src/lib/swap/cow/order'
import {
  getCowOrdersPage,
  getOpenCowOrders,
} from 'src/lib/swap/cow/order-history'
import {
  getCowOpenOrdersQueryKey,
  getCowOrdersQueryKey,
} from 'src/lib/swap/cow/query-keys'
import type { CowOrder } from 'src/lib/swap/cow/schema'
import type { EvmAddress } from 'sushi/evm'
import { COW_ORDER_ROW_COLUMNS, CowOrderCard } from './cow-order-card'

type CowOrderFilter = 'open' | 'history'

// Every open order, so none hides behind unloaded history pages.
function useOpenCowOrders({
  chainId,
  owner,
}: {
  chainId: CowLimitChainId
  owner?: EvmAddress
}) {
  return useQuery({
    queryKey: getCowOpenOrdersQueryKey(chainId, owner),
    queryFn: () => {
      if (!owner) throw new Error('Connect a wallet to view orders')
      return getOpenCowOrders({ chainId, owner })
    },
    enabled: Boolean(owner),
    refetchInterval: ms('20s'),
    retry: 1,
  })
}

function useCowOrderHistory({
  chainId,
  owner,
  enabled,
}: {
  chainId: CowLimitChainId
  owner?: EvmAddress
  enabled: boolean
}) {
  return useInfiniteQuery({
    queryKey: getCowOrdersQueryKey(chainId, owner),
    queryFn: ({ pageParam }) => {
      if (!owner) throw new Error('Connect a wallet to view orders')
      return getCowOrdersPage({ chainId, owner, offset: pageParam })
    },
    initialPageParam: 0,
    getNextPageParam: (page) => page.nextOffset,
    enabled: Boolean(owner && enabled),
    refetchInterval: ms('20s'),
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
  const [filter, setFilter] = useState<CowOrderFilter>('open')

  const open = useOpenCowOrders({ chainId, owner })
  const history = useCowOrderHistory({
    chainId,
    owner,
    enabled: filter === 'history',
  })
  const query = filter === 'open' ? open : history

  const visible =
    filter === 'open'
      ? (open.data ?? [])
      : (history.data?.pages
          .flatMap((page) => page.orders)
          .filter((order) => !isCowOrderOpen(order)) ?? [])
  const openCount = open.data?.length ?? 0

  return (
    <List className="!pt-0">
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-sm font-medium">Your orders</span>
        <Tabs
          value={filter}
          onValueChange={(value) =>
            setFilter(value === 'history' ? 'history' : 'open')
          }
        >
          <TabsList aria-label="Filter orders">
            <TabsTrigger value="open">
              {openCount ? `Open (${openCount})` : 'Open'}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {owner && visible.length > 0 && (
        // Card padding + border (13px), plus the chevron and its gap on the right.
        <div
          aria-hidden
          className={classNames(
            COW_ORDER_ROW_COLUMNS,
            'hidden items-center pl-[13px] pr-[37px] text-xs text-muted-foreground lg:grid',
          )}
        >
          <span>Order</span>
          <span>Limit price</span>
          <span>{filter === 'open' ? 'Expires' : 'Placed'}</span>
          <span>Status</span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {!owner ? (
          <List.Control className="p-4 text-sm text-muted-foreground">
            Connect your wallet to view orders.
          </List.Control>
        ) : query.isPending ? (
          <List.Control>
            <List.KeyValue skeleton />
            <List.KeyValue skeleton />
          </List.Control>
        ) : (
          <>
            {query.isError && (
              <Message variant="destructive" size="sm" role="alert">
                Unable to refresh CoW orders. Displayed statuses may be out of
                date.{' '}
                <Button
                  variant="link"
                  size="xs"
                  onClick={() => void query.refetch()}
                >
                  Retry
                </Button>
              </Message>
            )}
            {!query.isError && !visible.length && (
              <List.Control className="p-4 text-sm text-muted-foreground">
                {filter === 'open'
                  ? 'No open orders found.'
                  : 'No past orders found.'}
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
            {filter === 'history' && history.hasNextPage && (
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
