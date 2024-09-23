'use client'

import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { gtagEvent } from '@sushiswap/ui'
import { ChainId } from 'sushi/chain'
import { publicTransports } from 'sushi/config'
import {
  http,
  type Storage,
  cookieStorage,
  createConfig,
  createStorage,
} from 'wagmi'
import { Writeable } from 'zod'
import { publicWagmiConfig } from './public'

export const DEFAULT_POLLING_INTERVAL = 4_000

// Allow for custom polling intervals for each chain with a default
const pollingInterval = new Proxy(
  {
    [ChainId.ETHEREUM]: 8000, // BT is 12s
    [ChainId.POLYGON_ZKEVM]: 8000, // BT is 13s
    [ChainId.FILECOIN]: 20000, // BT is 30s
  } as Partial<Record<ChainId, number>>,
  {
    get: (target, name) => {
      return Object.hasOwn(target, name)
        ? target[Number(name) as keyof typeof target]
        : DEFAULT_POLLING_INTERVAL
    },
  },
)

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, coinbaseWallet, trustWallet],
    },
    {
      groupName: 'Others',
      wallets: [injectedWallet, walletConnectWallet, argentWallet, safeWallet],
    },
  ],
  {
    appName: 'Sushi',
    projectId: '3f44629277b155ef0caebf3dc705c4ba',
  },
)

export const createProductionConfig = ({
  useCookies,
}: { useCookies: boolean }) => {
  const transports = Object.entries(publicTransports).reduce(
    (acc, [chainId, transport]) => {
      const transportUrl = transport({ chain: undefined }).value?.url!

      acc[Number(chainId) as ChainId] = http(transportUrl, {
        onFetchResponse(_res) {
          if (typeof window !== 'undefined' && transportUrl.includes('drpc')) {
            gtagEvent('drpc-response', {
              pathname: window.location.pathname,
              href: window.location.href,
              chainId,
            })
          }
        },
      })
      return acc
    },
    {} as Writeable<typeof publicTransports>,
  )

  let storage: Storage | undefined = undefined
  if (useCookies) {
    storage = createStorage({
      storage: cookieStorage,
    })
  } else if (typeof window !== 'undefined') {
    storage = createStorage({ storage: window.localStorage })
  }

  return createConfig({
    ...publicWagmiConfig,
    transports,
    pollingInterval,
    connectors,
    storage,
    ssr: true,
  })
}
