'use client'

import { useMemo } from 'react'
import { WalletConfig } from '../../config'
import type { WalletWithState } from '../../types'
import { ConnectWalletButton } from './connect-wallet-button'
import { useWallets } from './use-wallets'

export default function ConnectModalOptions() {
  const wallets = useWallets()

  const { installed, recommended, others } = useMemo(() => {
    const installed: WalletWithState[] = []
    const recommended: WalletWithState[] = []
    const others: WalletWithState[] = []

    wallets.forEach((w) => {
      if (w.installed) {
        installed.push(w)
      } else if (WalletConfig.recommended.some((r) => r.id === w.id)) {
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

  return (
    <div className="space-y-2">
      {installed.length > 0 ? (
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Installed</span>
          </div>
          {installed.map((w) => (
            <ConnectWalletButton key={w.id} wallet={w} />
          ))}
        </div>
      ) : null}

      {recommended.length > 0 ? (
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Recommended</span>
          </div>
          {recommended.map((w) => (
            <ConnectWalletButton key={w.id} wallet={w} />
          ))}
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Others</span>
          </div>
          {others.map((w) => (
            <ConnectWalletButton key={w.id} wallet={w} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
