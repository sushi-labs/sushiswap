import { PrivyProvider as PrivyIoProvider } from '@privy-io/react-auth'
import { useTheme } from 'next-themes'
import type { ReactNode } from 'react'
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
  return (
    <PrivyIoProvider
      appId="cmq14gqpd00lb0cl52zln4q4z"
      config={{
        supportedChains: supportChains,
        defaultChain: mainnet,
        appearance: {
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
          walletChainType: 'ethereum-only',
        },
        loginMethods: ['email'],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyIoProvider>
  )
}
