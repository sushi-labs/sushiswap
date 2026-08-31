'use client'

import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  LinkExternal,
} from '@sushiswap/ui'
import { type ReactNode, useMemo, useState } from 'react'
import { useCrossmintOrders } from 'src/lib/crossmint'
import { useAccounts } from 'src/lib/wallet/hooks/use-accounts'
import { getFiatOrderHistoryRow } from './fiat-order-history'
import { FiatOrdersTable } from './fiat-orders-table'

export function FiatOrdersDialog() {
  const [open, setOpen] = useState(false)
  const { evm, svm, stellar } = useAccounts()

  const recipientAddress = useMemo(
    () =>
      [evm.address, stellar.address, svm.address].flatMap((address) =>
        address ? [String(address)] : [],
      ),
    [evm.address, stellar.address, svm.address],
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
            Connect a wallet to view its orders.
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
              <div className="flex">
                <Button
                  className="mx-auto"
                  loading={orders.isFetchingNextPage}
                  onClick={() => void orders.fetchNextPage()}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Load more orders
                </Button>
              </div>
            ) : null}

            {orders.isError && rows.length > 0 ? (
              <p className="text-center text-xs text-red">
                More orders could not be loaded. Please try again.
              </p>
            ) : null}
          </div>
        )}
        <div className="self-end flex text-[10px] ml-auto">
          <LinkExternal href="https://crossmint.portal.usepylon.com/forms/contact-support">
            Contact Support{' '}
            <ExternalLinkIcon className="inline-block w-2.5 h-2.5" />
          </LinkExternal>
        </div>
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
