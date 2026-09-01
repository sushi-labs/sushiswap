'use client'

import { useEffect } from 'react'
import { privyRuntimeStore } from 'src/lib/wallet/privy/privy-runtime-store'
import {
  TEST_PRIVY_ADDRESS,
  TEST_PRIVY_CHAIN_ID_STORAGE_KEY,
  TEST_PRIVY_LAST_REQUEST_CHAIN_ID_STORAGE_KEY,
  TEST_PRIVY_RUNTIME_DELAY_STORAGE_KEY,
} from 'src/lib/wallet/privy/privy-test-constants'
import type { PrivyRuntimeOperationHandlers } from 'src/lib/wallet/privy/types'
import type { EvmAddress } from 'sushi/evm'
import type { EIP1193Provider } from 'viem'

const address = TEST_PRIVY_ADDRESS as EvmAddress

const operations: PrivyRuntimeOperationHandlers = {
  async connectOrCreateEvmWallet() {},
  async exportEvmWallet() {},
  async exportSvmWallet() {},
  async loginSvm() {},
  async logout() {},
  async sendEvmTransaction() {
    throw new Error('Privy test transactions are not implemented')
  },
  async signAndSendSvmTransaction() {
    throw new Error('Privy test transactions are not implemented')
  },
}

function getRuntimeDelay(): number {
  const delay = Number(
    window.localStorage.getItem(TEST_PRIVY_RUNTIME_DELAY_STORAGE_KEY),
  )
  return Number.isSafeInteger(delay) && delay >= 0 ? delay : 0
}

function getInitialChainId(): number {
  const chainId = Number(
    window.localStorage.getItem(TEST_PRIVY_CHAIN_ID_STORAGE_KEY),
  )
  return Number.isSafeInteger(chainId) && chainId > 0 ? chainId : 1
}

function createWallet(initialChainId: number) {
  let chainId = initialChainId
  const request = async ({
    method,
    params,
  }: {
    method: string
    params?: readonly unknown[]
  }) => {
    window.localStorage.setItem(
      TEST_PRIVY_LAST_REQUEST_CHAIN_ID_STORAGE_KEY,
      String(chainId),
    )
    if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
      return [address]
    }
    if (method === 'eth_chainId') return `0x${chainId.toString(16)}`
    if (method === 'wallet_revokePermissions') return null
    if (method === 'wallet_switchEthereumChain') {
      const parameter = params?.[0]
      if (
        parameter &&
        typeof parameter === 'object' &&
        'chainId' in parameter &&
        typeof parameter.chainId === 'string'
      ) {
        chainId = Number(parameter.chainId)
        window.localStorage.setItem(
          TEST_PRIVY_CHAIN_ID_STORAGE_KEY,
          String(chainId),
        )
      }
      return null
    }
    throw new Error(`Unexpected Privy test provider method: ${method}`)
  }

  const provider: EIP1193Provider = {
    on() {},
    removeListener() {},
    request: request as EIP1193Provider['request'],
  }

  return {
    address,
    chainId: `eip155:${initialChainId}`,
    async getEthereumProvider() {
      return provider
    },
    meta: {
      id: 'io.privy.wallet',
      name: 'Email',
    },
    async switchChain(targetChainId: number) {
      chainId = targetChainId
      window.localStorage.setItem(
        TEST_PRIVY_CHAIN_ID_STORAGE_KEY,
        String(chainId),
      )
    },
    walletClientType: 'privy',
  }
}

export function PrivyRuntime() {
  useEffect(() => {
    let cancelled = false

    const timeout = window.setTimeout(async () => {
      if (cancelled) return

      try {
        const initialChainId = getInitialChainId()
        window.localStorage.setItem(
          TEST_PRIVY_CHAIN_ID_STORAGE_KEY,
          String(initialChainId),
        )
        privyRuntimeStore.publishRuntime({
          authenticated: true,
          evmWallet: createWallet(initialChainId),
          hasEvmAccount: true,
          hasSvmAccount: false,
          operations,
          svmWallet: null,
          walletsReady: true,
        })
      } catch (error) {
        privyRuntimeStore.setError(error)
      }
    }, getRuntimeDelay())

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      privyRuntimeStore.setUnavailable()
    }
  }, [])

  return null
}
