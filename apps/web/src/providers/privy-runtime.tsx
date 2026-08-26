'use client'

import type { User as PrivyUser } from '@privy-io/react-auth'
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
  useStandardWallets as useSolanaStandardWallets,
  useWallets as useSolanaWallets,
} from '@privy-io/react-auth/solana'
import { getBase58Decoder } from '@solana/kit'
import { getConnections } from '@wagmi/core'
import type { Wallet as StandardWallet } from '@wallet-standard/base'
import { useEffect, useMemo, useRef } from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import {
  clearPrivySessionMarker,
  ensurePrivySessionMarker,
} from 'src/lib/wallet/privy-session-marker'
import { PRIVY_EVM_CONNECTOR_ID } from 'src/lib/wallet/privy/privy-evm-connector'
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

type PrivyChainType = 'ethereum' | 'solana'

/**
 * Mirrors Privy's own embedded-wallet lookup, which reads `linkedAccounts`
 * rather than the wallet hooks. `createWallet()` throws for a user who already
 * has a wallet for the chain type, so this is what must gate provisioning.
 */
function hasPrivyEmbeddedAccount(
  user: PrivyUser | null,
  chainType: PrivyChainType,
): boolean {
  return Boolean(
    user?.linkedAccounts.some(
      (account) =>
        account.type === 'wallet' &&
        account.walletClientType === 'privy' &&
        account.chainType === chainType,
    ),
  )
}

function isPrivySvmStandardWallet(wallet: StandardWallet): boolean {
  return wallet.name === 'Privy' && 'privy:' in wallet.features
}

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
  const { ready, authenticated, logout, user } = usePrivy()
  const { wallets: evmWallets } = useWallets()
  const { ready: svmReady, wallets: svmWallets } = useSolanaWallets()
  const { wallets: svmStandardWallets } = useSolanaStandardWallets()
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
  // `useSolanaWallets` only yields a wallet once Privy has propagated a
  // connected account, which is far later than registration needs to happen.
  const svmStandardWallet = useMemo(
    () => svmStandardWallets.find(isPrivySvmStandardWallet) ?? null,
    [svmStandardWallets],
  )
  const hasEvmAccount = hasPrivyEmbeddedAccount(user, 'ethereum')
  const hasSvmAccount = hasPrivyEmbeddedAccount(user, 'solana')

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
        hasEvmAccount,
        hasSvmAccount,
        operations,
        svmStandardWallet,
        svmWallet: runtimeSvmWallet,
      })
    } else {
      privyRuntimeStore.publishRuntime({
        authenticated: false,
        operations,
        svmStandardWallet,
      })
    }

    if (!authenticated) {
      clearPrivySessionMarker()
      privyRuntimeStore.clearEvmReconnect()
      return
    }

    ensurePrivySessionMarker()

    // Safety net for a runtime that is requested after Wagmi's one-shot
    // `reconnect()` has already run - a login in another tab, say. While that
    // reconnect is still in flight the bridge is already feeding it, so firing
    // here too would race it into `ConnectorAlreadyConnectedError`.
    const config = getWagmiConfig()
    const wagmiReconnecting =
      config.state.status === 'reconnecting' ||
      config.state.status === 'connecting'
    const hasPrivyConnection = getConnections(config).some(
      (connection) => connection.connector.id === PRIVY_EVM_CONNECTOR_ID,
    )
    if (
      privyRuntimeStore.getSnapshot().evmReconnect &&
      runtimeEvmWallet &&
      !wagmiReconnecting &&
      !hasPrivyConnection
    ) {
      // One-shot: consume the request before reconnecting so a later publish
      // cannot resurrect a connection the user has since dropped.
      privyRuntimeStore.clearEvmReconnect()
      reconnectPrivyEvmWallet(config).catch((error) => {
        console.warn('Privy EVM auto-connect failed', error)
      })
    }
  }, [
    authenticated,
    hasEvmAccount,
    hasSvmAccount,
    operations,
    ready,
    runtimeEvmWallet,
    svmReady,
    svmStandardWallet,
    svmWalletAddress,
  ])

  return null
}
