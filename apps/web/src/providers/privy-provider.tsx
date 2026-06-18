import { PrivyProvider as PrivyIoProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'

import {
  SVM_RPC_HEADERS,
  SVM_RPC_URL,
  SVM_WS_RPC_URL,
} from 'src/lib/svm/config'
import { testChains } from 'src/lib/wagmi/config/test/constants'
import { publicChains } from 'src/lib/wagmi/config/viem'
import { mainnet } from 'viem/chains'

const supportedChains =
  process.env.NEXT_PUBLIC_APP_ENV === 'test'
    ? [...testChains]
    : [...publicChains]
const defaultChain =
  process.env.NEXT_PUBLIC_APP_ENV === 'test' ? undefined : mainnet

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme()
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set')
  }
  return (
    <PrivyIoProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        supportedChains,
        defaultChain,
        appearance: {
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
          walletChainType: 'ethereum-and-solana',
        },
        loginMethods: ['email'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors({
              shouldAutoConnect: true,
            }),
          },
        },
        solana: {
          rpcs: {
            'solana:mainnet': {
              rpc: createSolanaRpc(SVM_RPC_URL, {
                headers: SVM_RPC_HEADERS,
              }),
              rpcSubscriptions: createSolanaRpcSubscriptions(SVM_WS_RPC_URL),
            },
          },
        },
      }}
    >
      {children}
    </PrivyIoProvider>
  )
}
