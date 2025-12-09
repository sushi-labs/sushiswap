'use client'

import { Button } from '@sushiswap/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@sushiswap/ui'
import { LinkExternal } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useConnection, useDisconnect } from 'wagmi'

export const SanctionedAddressDialog = () => {
  const [open, setOpen] = useState<boolean>(false)

  const { disconnect } = useDisconnect()

  const { address, connector, status } = useConnection()

  const { data: isSanctioned } = useQuery({
    queryKey: ['trmlabs', address],
    queryFn: async () => {
      const resp = await fetch(
        'https://api.trmlabs.com/public/v1/sanctions/screening',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ address }]),
        },
      )
        .then((response) => response.json())
        .then(
          (
            data: {
              address: string
              isSanctioned: boolean
            }[],
          ) => data[0],
        )

      return resp.isSanctioned
    },
    enabled:
      status === 'connected' &&
      typeof address !== 'undefined' &&
      process.env.NODE_ENV === 'production',
    staleTime: 3_600_000, // 1 hour
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isSanctioned) {
      disconnect({ connector })
      setOpen(true)
    }
  }, [isSanctioned, disconnect, connector])

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sanctioned address detected</DialogTitle>
          <DialogDescription>
            Your address has been identified as sanctioned and cannot be
            supported.
          </DialogDescription>
          <div className="flex flex-col gap-4">
            <LinkExternal
              href="https://www.trmlabs.com/products/sanctions"
              className="text-blue underline text-sm"
            >
              What is this?
            </LinkExternal>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button fullWidth size="xl" onClick={() => setOpen(false)}>
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
