'use client'

import {
  Chip,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LinkExternal,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import React, { useMemo, type FC } from 'react'
import { UnifiedWalletConfig } from '../config'
import { useWallets } from '../hooks'
import { useWallet } from '../provider/hooks'
import type { WalletWithState } from '../types'

type Props = {
  open: boolean
  onOpenChange(open: boolean): void
}

export const ConnectDialog: FC<Props> = ({ open, onOpenChange }) => {
  const { connect, pending } = useWallet()

  const wallets = useWallets()

  const { installed, recommended, others } = useMemo(() => {
    const installed: WalletWithState[] = []
    const recommended: WalletWithState[] = []
    const others: WalletWithState[] = []

    wallets.forEach((w) => {
      if (w.installed) {
        installed.push(w)
      } else if (UnifiedWalletConfig.recommended.some((r) => r.id === w.id)) {
        recommended.push(w)
      } else {
        others.push(w)
      }
    })

    return {
      installed,
      recommended,
      others,
    }
  }, [wallets])

  const renderRow = (wallet: WalletWithState) => {
    const rightChip = wallet.available
      ? wallet.installed
        ? 'Installed'
        : 'Connect'
      : wallet.url
        ? 'Get wallet'
        : 'Unavailable'

    return (
      <Button
        key={wallet.id}
        onClick={async () => {
          if (!wallet.available) {
            if (wallet.url) {
              window.open(wallet.url, '_blank', 'noopener,noreferrer')
            }
            return
          }

          try {
            await connect(wallet.id, { wallet })
            onOpenChange(false)
          } catch {}
        }}
        disabled={pending}
        fullWidth
        size="lg"
        variant="secondary"
        className="!justify-between gap-3"
      >
        <div className="flex flex-1 justify-between gap-3">
          <div className="flex gap-3">
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="h-6 w-6 shrink-0"
            />
            <span>{wallet.name}</span>
          </div>
        </div>
        <Chip variant="secondary">{rightChip}</Chip>
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect a Wallet</DialogTitle>
        </DialogHeader>

        {installed.length > 0 ? (
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Installed</span>
            </div>
            {installed.map((w) => renderRow(w))}
          </div>
        ) : null}

        {recommended.length > 0 ? (
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Recommended</span>
            </div>
            {recommended.map((w) => renderRow(w))}
          </div>
        ) : null}

        {others.length > 0 ? (
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Others</span>
            </div>
            {others.map((w) => renderRow(w))}
          </div>
        ) : null}

        <DialogFooter>
          <div className="text-sm text-center">
            By connecting your wallet, you agree to Sushi Labs&apos;{' '}
            <LinkExternal href="/legal/terms-of-service">
              Terms of Service
            </LinkExternal>{' '}
            and{' '}
            <LinkExternal href="/legal/privacy-policy">
              Privacy Policy
            </LinkExternal>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
