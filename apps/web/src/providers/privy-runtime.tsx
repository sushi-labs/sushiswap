'use client'

import type {
  EIP1193Provider as PrivyEIP1193Provider,
  User as PrivyUser,
} from '@privy-io/react-auth'
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
  type PrivyStandardWallet,
  useCreateWallet as useCreateSvmWallet,
  useExportWallet as useExportSvmWallet,
  useSignAndSendTransaction,
  useStandardWallets as useSolanaStandardWallets,
  useWallets as useSolanaWallets,
} from '@privy-io/react-auth/solana'
import { getBase58Decoder } from '@solana/kit'
import type { Wallet as StandardWallet } from '@wallet-standard/base'
import { useEffect, useMemo, useRef } from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { setPrivySvmReconnect } from 'src/lib/wallet/privy-storage'
import {
  registerPrivyEvmConnector,
  unregisterPrivyEvmConnector,
} from 'src/lib/wallet/privy/privy-evm-connector'
import { privyRuntimeStore } from 'src/lib/wallet/privy/privy-runtime-store'
import { provisionPrivyWallet } from 'src/lib/wallet/privy/provision-wallet'
import { registerPrivySvmWallet } from 'src/lib/wallet/privy/register-privy-svm-wallet'
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

function toViemProvider(provider: PrivyEIP1193Provider): EIP1193Provider {
  // Privy and viem expose the same EIP-1193 surface with incompatible
  // event-listener overloads.
  return provider as unknown as EIP1193Provider
}

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

function isPrivySvmStandardWallet(
  wallet: StandardWallet,
): wallet is PrivyStandardWallet {
  return (
    'privy:' in wallet.features &&
    'isPrivyWallet' in wallet &&
    wallet.isPrivyWallet === true
  )
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
    () =>
      svmWallets.find((wallet) =>
        isPrivySvmStandardWallet(wallet.standardWallet),
      ),
    [svmWallets],
  )
  // `useSolanaWallets` only yields a wallet once Privy has propagated a
  // connected account, which is far later than registration needs to happen.
  const svmStandardWallet = useMemo(
    () => svmStandardWallets.find(isPrivySvmStandardWallet) ?? null,
    [svmStandardWallets],
  )
  const evmWalletAddress = embeddedEvmWallet?.address
  const svmWalletAddress = embeddedSvmWallet?.address
  const hasEvmAccount = hasPrivyEmbeddedAccount(user, 'ethereum')
  const hasSvmAccount = hasPrivyEmbeddedAccount(user, 'solana')

  useEffect(() => {
    if (!svmStandardWallet) return
    return registerPrivySvmWallet(svmStandardWallet)
  }, [svmStandardWallet])

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
    }),
    [],
  )

  useEffect(() => {
    return () => {
      connectPendingRef.current?.reject(new Error('Privy runtime unloaded'))
      loginPendingRef.current?.reject(new Error('Privy runtime unloaded'))
      unregisterPrivyEvmConnector(getWagmiConfig())
      privyRuntimeStore.setUnavailable()
    }
  }, [])

  const runtimeEvmWallet = useMemo<PrivyEvmWallet | undefined>(() => {
    if (!evmWalletAddress) return undefined
    return { address: evmWalletAddress as EvmAddress }
  }, [evmWalletAddress])

  useEffect(() => {
    const config = getWagmiConfig()
    if (!authenticated || !evmWalletAddress) {
      unregisterPrivyEvmConnector(config)
      return
    }

    const wallet = latestHandlesRef.current.embeddedEvmWallet
    if (!wallet) return
    let cancelled = false

    wallet
      .getEthereumProvider()
      .then((provider) => {
        if (cancelled) return
        registerPrivyEvmConnector({
          address: evmWalletAddress as EvmAddress,
          config,
          provider: toViemProvider(provider),
          async switchChain(chainId) {
            const activeWallet = latestHandlesRef.current.embeddedEvmWallet
            if (
              !activeWallet ||
              activeWallet.address.toLowerCase() !==
                evmWalletAddress.toLowerCase()
            ) {
              throw new Error('Privy EVM wallet is not active')
            }
            await activeWallet.switchChain(chainId)
            return toViemProvider(await activeWallet.getEthereumProvider())
          },
        })

        if (privyRuntimeStore.getSnapshot().evmReconnect) {
          reconnectPrivyEvmWallet(config)
            .catch((error) => {
              console.warn('Privy EVM auto-connect failed', error)
            })
            .finally(() => privyRuntimeStore.clearEvmReconnect())
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.warn('Privy EVM provider setup failed', error)
          privyRuntimeStore.clearEvmReconnect()
        }
      })

    return () => {
      cancelled = true
    }
  }, [authenticated, evmWalletAddress])

  useEffect(() => {
    if (!ready) return
    const svmWallet = svmReady
      ? latestHandlesRef.current.embeddedSvmWallet
      : undefined
    const runtimeSvmWallet: PrivySvmWallet | undefined =
      svmWalletAddress && svmWallet
        ? { address: svmWalletAddress as SvmAddress }
        : undefined
    if (authenticated) {
      privyRuntimeStore.publishRuntime({
        authenticated: true,
        evmWallet: runtimeEvmWallet,
        hasEvmAccount,
        hasSvmAccount,
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
      setPrivySvmReconnect(false)
      privyRuntimeStore.clearEvmReconnect()
    }
  }, [
    authenticated,
    hasEvmAccount,
    hasSvmAccount,
    operations,
    ready,
    runtimeEvmWallet,
    svmReady,
    svmWalletAddress,
  ])

  return null
}
