'use client'

import {
  useConnectOrCreateWallet,
  useCreateWallet as useCreateEvmWallet,
  useExportWallet as useExportEvmWallet,
  useLogin,
  usePrivy,
  useSendTransaction,
  useWallets,
} from '@privy-io/react-auth'
import {
  useCreateWallet as useCreateSvmWallet,
  useExportWallet as useExportSvmWallet,
  useSignAndSendTransaction,
  useSignTransaction,
  useWallets as useSolanaWallets,
} from '@privy-io/react-auth/solana'
import { getBase58Decoder } from '@solana/kit'
import { getConnections } from '@wagmi/core'
import { useEffect, useMemo, useRef } from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import {
  clearPrivySessionMarker,
  ensurePrivySessionMarker,
} from 'src/lib/wallet/privy-session-marker'
import { privyRuntimeStore } from 'src/lib/wallet/privy/privy-runtime-store'
import { provisionPrivyWallet } from 'src/lib/wallet/privy/provision-wallet'
import type {
  PrivyEvmWallet,
  PrivyRuntimeOperationHandlers,
  PrivySvmWallet,
} from 'src/lib/wallet/privy/types'
import { reconnectPrivyEvmWallet } from 'src/lib/wallet/privy/use-privy-runtime'
import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { SvmAddress, SvmTxHash } from 'sushi/svm'
import type { EIP1193Provider } from 'viem'
import { PrivyProvider } from './privy-provider'

type PendingOperation = {
  reject(error: Error): void
  resolve(): void
}

function createPendingOperation(): {
  operation: PendingOperation
  promise: Promise<void>
} {
  let operation!: PendingOperation
  const promise = new Promise<void>((resolve, reject) => {
    operation = {
      resolve,
      reject: (error) => reject(error),
    }
  })
  return { operation, promise }
}

export function PrivyRuntime() {
  return (
    <PrivyProvider>
      <PrivyRuntimeEffects />
    </PrivyProvider>
  )
}

function PrivyRuntimeEffects() {
  const { ready, authenticated, logout } = usePrivy()
  const { wallets: evmWallets } = useWallets()
  const { ready: svmReady, wallets: svmWallets } = useSolanaWallets()
  const { sendTransaction } = useSendTransaction()
  const { createWallet: createEvmWallet } = useCreateEvmWallet()
  const { createWallet: createSvmWallet } = useCreateSvmWallet()
  const { exportWallet: exportEvmWallet } = useExportEvmWallet()
  const { exportWallet: exportSvmWallet } = useExportSvmWallet()
  const { signTransaction } = useSignTransaction()
  const { signAndSendTransaction } = useSignAndSendTransaction()
  const connectPendingRef = useRef<PendingOperation | undefined>(undefined)
  const loginPendingRef = useRef<PendingOperation | undefined>(undefined)

  const { connectOrCreateWallet } = useConnectOrCreateWallet({
    onSuccess: () => {
      connectPendingRef.current?.resolve()
      connectPendingRef.current = undefined
    },
    onError: (error) => {
      connectPendingRef.current?.reject(
        new Error(typeof error === 'string' ? error : 'Privy EVM login failed'),
      )
      connectPendingRef.current = undefined
    },
  })

  const { login } = useLogin({
    onComplete: () => {
      loginPendingRef.current?.resolve()
      loginPendingRef.current = undefined
    },
    onError: (error) => {
      loginPendingRef.current?.reject(
        new Error(typeof error === 'string' ? error : 'Privy SVM login failed'),
      )
      loginPendingRef.current = undefined
    },
  })

  const embeddedEvmWallet = useMemo(
    () =>
      evmWallets.find(
        (wallet) =>
          wallet.connectorType === 'embedded' &&
          wallet.walletClientType === 'privy',
      ),
    [evmWallets],
  )
  const embeddedSvmWallet = useMemo(
    () => svmWallets.find((wallet) => wallet.standardWallet?.name === 'Privy'),
    [svmWallets],
  )

  // Privy hook handles are not referentially stable across renders. Keep the
  // latest handles behind a ref so the published runtime snapshot keeps a
  // stable identity unless real wallet state changes.
  const latestHandlesRef = useRef({
    authenticated,
    connectOrCreateWallet,
    createEvmWallet,
    createSvmWallet,
    embeddedEvmWallet,
    embeddedSvmWallet,
    exportEvmWallet,
    exportSvmWallet,
    login,
    logout,
    sendTransaction,
    signAndSendTransaction,
    signTransaction,
  })
  useEffect(() => {
    latestHandlesRef.current = {
      authenticated,
      connectOrCreateWallet,
      createEvmWallet,
      createSvmWallet,
      embeddedEvmWallet,
      embeddedSvmWallet,
      exportEvmWallet,
      exportSvmWallet,
      login,
      logout,
      sendTransaction,
      signAndSendTransaction,
      signTransaction,
    }
  })

  const operations = useMemo<PrivyRuntimeOperationHandlers>(
    () => ({
      async connectOrCreateEvmWallet() {
        await provisionPrivyWallet({
          authenticated: latestHandlesRef.current.authenticated,
          createWallet: latestHandlesRef.current.createEvmWallet,
          login: () => {
            const pending = createPendingOperation()
            connectPendingRef.current?.reject(
              new Error('A newer Privy EVM login replaced this request'),
            )
            connectPendingRef.current = pending.operation
            latestHandlesRef.current.connectOrCreateWallet()
            return pending.promise
          },
        })
      },
      exportEvmWallet: (address) =>
        latestHandlesRef.current.exportEvmWallet({ address }),
      exportSvmWallet: (address) =>
        latestHandlesRef.current.exportSvmWallet({ address }),
      async loginSvm() {
        await provisionPrivyWallet({
          authenticated: latestHandlesRef.current.authenticated,
          createWallet: latestHandlesRef.current.createSvmWallet,
          login: () => {
            const pending = createPendingOperation()
            loginPendingRef.current?.reject(
              new Error('A newer Privy SVM login replaced this request'),
            )
            loginPendingRef.current = pending.operation
            latestHandlesRef.current.login({ walletChainType: 'solana-only' })
            return pending.promise
          },
        })
      },
      logout: () => latestHandlesRef.current.logout(),
      async sendEvmTransaction({ address, transaction, uiOptions }) {
        const result = await latestHandlesRef.current.sendTransaction(
          transaction,
          { address, uiOptions },
        )
        return { hash: result.hash as EvmTxHash }
      },
      async signAndSendSvmTransaction({ address, transaction, uiOptions }) {
        const wallet = latestHandlesRef.current.embeddedSvmWallet
        if (wallet?.address !== address) {
          throw new Error('Privy SVM wallet is not active')
        }
        const result = await latestHandlesRef.current.signAndSendTransaction({
          transaction,
          wallet,
          options: { uiOptions },
        })
        return {
          signature: getBase58Decoder().decode(
            new Uint8Array(Object.values(result.signature)),
          ) as SvmTxHash,
        }
      },
      async signSvmTransaction({ address, transaction }) {
        const wallet = latestHandlesRef.current.embeddedSvmWallet
        if (wallet?.address !== address) {
          throw new Error('Privy SVM wallet is not active')
        }
        return latestHandlesRef.current.signTransaction({
          transaction,
          wallet,
        })
      },
    }),
    [],
  )

  useEffect(() => {
    return () => {
      connectPendingRef.current?.reject(new Error('Privy runtime unloaded'))
      loginPendingRef.current?.reject(new Error('Privy runtime unloaded'))
      privyRuntimeStore.setUnavailable()
    }
  }, [])

  const evmWalletAddress = embeddedEvmWallet?.address
  const svmWalletAddress = embeddedSvmWallet?.address
  const runtimeEvmWallet = useMemo<PrivyEvmWallet | undefined>(() => {
    if (!evmWalletAddress) return undefined
    return {
      address: evmWalletAddress as EvmAddress,
      async getProvider() {
        const wallet = latestHandlesRef.current.embeddedEvmWallet
        if (
          !wallet ||
          wallet.address.toLowerCase() !== evmWalletAddress.toLowerCase()
        ) {
          throw new Error('Privy EVM wallet is not active')
        }
        return (await wallet.getEthereumProvider()) as unknown as EIP1193Provider
      },
    }
  }, [evmWalletAddress])

  useEffect(() => {
    if (!ready) return
    const svmWallet = svmReady
      ? latestHandlesRef.current.embeddedSvmWallet
      : undefined
    const runtimeSvmWallet: PrivySvmWallet | undefined =
      svmWalletAddress && svmWallet
        ? {
            address: svmWalletAddress as SvmAddress,
            standardWallet: svmWallet.standardWallet,
          }
        : undefined
    if (authenticated) {
      privyRuntimeStore.publishRuntime({
        authenticated: true,
        evmWallet: runtimeEvmWallet,
        operations,
        svmWallet: runtimeSvmWallet,
      })
    } else {
      privyRuntimeStore.publishRuntime({
        authenticated: false,
        operations,
      })
    }

    if (!authenticated) {
      clearPrivySessionMarker()
      return
    }

    ensurePrivySessionMarker()

    if (
      privyRuntimeStore.getSnapshot().evmReconnect &&
      runtimeEvmWallet &&
      getConnections(getWagmiConfig()).length === 0
    ) {
      reconnectPrivyEvmWallet(getWagmiConfig()).catch((error) => {
        console.warn('Privy EVM auto-connect failed', error)
      })
    }
  }, [
    authenticated,
    operations,
    ready,
    runtimeEvmWallet,
    svmReady,
    svmWalletAddress,
  ])

  return null
}
