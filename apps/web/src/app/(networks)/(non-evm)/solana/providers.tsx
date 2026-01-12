'use client'

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'

export function Providers({ children }: { children: React.ReactNode }) {
  const drpcId = process.env['DRPC_ID'] || process.env['NEXT_PUBLIC_DRPC_ID']

  return (
    <ConnectionProvider
      endpoint={`https://lb.drpc.live/ogrpc?network=solana&dkey=${drpcId}`}
    >
      <WalletProvider wallets={[]} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}
