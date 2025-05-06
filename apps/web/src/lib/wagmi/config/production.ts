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
import { EvmChainId } from 'sushi/chain'
import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
import type { Writeable } from 'zod'
import { publicWagmiConfig } from './public'
import { publicTransports } from './viem'

export const DEFAULT_POLLING_INTERVAL = 4_000

// Allow for custom polling intervals for each chain with a default
const pollingInterval = new Proxy(
  {
    [EvmChainId.ETHEREUM]: 8000, // BT is 12s
    [EvmChainId.POLYGON_ZKEVM]: 8000, // BT is 13s
    [EvmChainId.FILECOIN]: 20000, // BT is 30s
  } as Partial<Record<EvmChainId, number>>,
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
      if (transportUrl.startsWith('https://lb.drpc.org/') && drpcJwt) {
        fetchOptions = {
          headers: {
            Authorization: drpcJwt,
          },
        }
      }

      acc[Number(chainId) as EvmChainId] = http(transportUrl, {
        fetchOptions,
        onFetchRequest(_req) {
          if (typeof window !== 'undefined' && transportUrl.includes('drpc')) {
            drpcJwt && _req.headers.set('Authorization', drpcJwt)
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
