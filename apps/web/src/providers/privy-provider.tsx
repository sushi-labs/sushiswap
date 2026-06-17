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
import {
  apeChain,
  arbitrum,
  arbitrumNova,
  avalanche,
  base,
  berachain,
  blast,
  boba,
  bsc,
  celo,
  cronos,
  fantom,
  filecoin,
  gnosis,
  hemi,
  hyperEvm,
  katana,
  linea,
  mainnet,
  manta,
  mantle,
  mode,
  monad,
  optimism,
  plasma,
  polygon,
  rootstock,
  scroll,
  skaleEuropa,
  taiko,
  xLayer,
  zkLinkNova,
  zksync,
} from 'viem/chains'

const supportChains = [
  apeChain,
  arbitrum,
  arbitrumNova,
  avalanche,
  base,
  berachain,
  blast,
  boba,
  bsc,
  celo,
  cronos,
  fantom,
  filecoin,
  gnosis,
  hemi,
  hyperEvm,
  katana,
  linea,
  mainnet,
  manta,
  mantle,
  mode,
  monad,
  optimism,
  plasma,
  polygon,
  rootstock,
  scroll,
  skaleEuropa,
  taiko,
  xLayer,
  zkLinkNova,
  zksync,
]

export const PrivyProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme()
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set')
  }
  return (
    <PrivyIoProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        supportedChains: supportChains,
        defaultChain: mainnet,
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
