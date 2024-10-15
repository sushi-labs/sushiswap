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
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
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

const drpcJwt = process.env['NEXT_PUBLIC_DRPC_JWT']

export const createProductionConfig = () => {
  const transports = Object.entries(publicTransports).reduce(
    (acc, [chainId, transport]) => {
      const transportUrl = transport({ chain: undefined }).value?.url!

      let fetchOptions = {}
      if (drpcJwt) {
        fetchOptions = {
          headers: {
            Authorization: drpcJwt,
          },
        }
      }

      acc[Number(chainId) as ChainId] = http(transportUrl, {
        fetchOptions,
        onFetchRequest(_req) {
          if (typeof window !== 'undefined' && transportUrl.includes('drpc')) {
            try {
              _req.json().then((json) => {
                gtagEvent('drpc-request', {
                  pathname: window.location.pathname,
                  href: window.location.href,
                  method: json.method,
                  chainId,
                })
              })
            } catch {}
          }
        },
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

  const storage = createStorage({
    storage: cookieStorage,
  })

  return createConfig({
    ...publicWagmiConfig,
    transports,
    pollingInterval,
    connectors,
    storage,
    ssr: true,
  })
}
