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
import { type ReactNode, useMemo, useState } from 'react'
import { useCrossmintOrders } from 'src/lib/crossmint'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { getFiatOrderHistoryRow } from './fiat-order-history'
import { FiatOrdersTable } from './fiat-orders-table'

export function FiatOrdersDialog() {
  const [open, setOpen] = useState(false)
  const evmAddress = useAccount('evm')
  const stellarAddress = useAccount('stellar')
  const svmAddress = useAccount('svm')

  const recipientAddress = useMemo(
    () =>
      [evmAddress, stellarAddress, svmAddress].flatMap((address) =>
        address ? [String(address)] : [],
      ),
    [evmAddress, stellarAddress, svmAddress],
  )
  const orders = useCrossmintOrders({
    enabled: open,
    recipientAddress,
  })
  const rows = useMemo(
    () =>
      (orders.data ?? []).map((order) =>
        getFiatOrderHistoryRow(order, orders.environment),
      ),
    [orders.data, orders.environment],
  )
  const hasConnectedWallet = recipientAddress.length > 0
  const showInitialError = orders.isError && rows.length === 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button fullWidth size="lg" type="button" variant="secondary">
          View orders
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-16px)] overflow-y-auto md:!max-w-6xl">
        <DialogHeader className="!text-left">
          <DialogTitle>Order history</DialogTitle>
          <DialogDescription>
            Purchases sent to your currently connected wallets.
          </DialogDescription>
        </DialogHeader>

        {!hasConnectedWallet ? (
          <OrderHistoryMessage>
            Connect a wallet to view its Crossmint orders.
          </OrderHistoryMessage>
        ) : showInitialError ? (
          <OrderHistoryMessage>
            <span>We couldn&apos;t load your orders.</span>
            <Button
              onClick={() => void orders.refetch()}
              size="sm"
              type="button"
              variant="secondary"
            >
              Try again
            </Button>
          </OrderHistoryMessage>
        ) : (
          <div className="min-w-0 space-y-4">
            <FiatOrdersTable
              data={rows}
              isLoading={orders.isLoading && rows.length === 0}
            />

            {orders.hasNextPage ? (
              <Button
                className="mx-auto flex"
                loading={orders.isFetchingNextPage}
                onClick={() => void orders.fetchNextPage()}
                size="sm"
                type="button"
                variant="secondary"
              >
                Load more orders
              </Button>
            ) : null}

            {orders.isError && rows.length > 0 ? (
              <p className="text-center text-xs text-red">
                More orders could not be loaded. Please try again.
              </p>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function OrderHistoryMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-accent bg-secondary p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}
