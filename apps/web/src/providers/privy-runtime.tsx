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
  useStandardWallets as useSolanaStandardWallets,
} from '@privy-io/react-auth/solana'
import { getBase58Decoder } from '@solana/kit'
import type { Wallet as StandardWallet } from '@wallet-standard/base'
import { useEffect, useMemo, useRef } from 'react'
import { setPrivySvmReconnect } from 'src/lib/wallet/privy-storage'
import { createPrivySvmWallet } from 'src/lib/wallet/privy/create-privy-svm-wallet'
import { privyRuntimeStore } from 'src/lib/wallet/privy/privy-runtime-store'
import { signAndSendPrivySvmTransaction } from 'src/lib/wallet/privy/privy-svm-signing'
import { provisionPrivyWallet } from 'src/lib/wallet/privy/provision-wallet'
import { registerPrivySvmWallet } from 'src/lib/wallet/privy/register-privy-svm-wallet'
import type {
  PrivyEvmWallet,
  PrivyRuntimeOperationHandlers,
  PrivySvmWallet,
} from 'src/lib/wallet/privy/types'
import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { SvmAddress, SvmTxHash } from 'sushi/svm'
import type { EIP1193Provider } from 'viem'
import { PrivyProvider } from './privy-provider'

type PrivyChainType = 'ethereum' | 'solana'
type PrivyWalletAccount = Extract<
  PrivyUser['linkedAccounts'][number],
  { type: 'wallet' }
>

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
function getPrivyEmbeddedAccount(
  user: PrivyUser | null,
  chainType: PrivyChainType,
): PrivyWalletAccount | undefined {
  return user?.linkedAccounts.find(
    (account): account is PrivyWalletAccount =>
      account.type === 'wallet' &&
      account.walletClientType === 'privy' &&
      account.chainType === chainType,
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
  const { ready, authenticated, error, logout, user } = usePrivy()
  const { ready: evmWalletsReady, wallets: evmWallets } = useWallets()
  const { wallets: svmStandardWallets } = useSolanaStandardWallets()
  const { sendTransaction } = useSendTransaction()
  const { createWallet: createEvmWallet } = useCreateEvmWallet()
  const { createWallet: createSvmWallet } = useCreateSvmWallet()
  const { exportWallet: exportEvmWallet } = useExportEvmWallet()
  const { exportWallet: exportSvmWallet } = useExportSvmWallet()
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
  const svmStandardWallet = useMemo(
    () => svmStandardWallets.find(isPrivySvmStandardWallet) ?? null,
    [svmStandardWallets],
  )
  const evmWalletAddress = embeddedEvmWallet?.address
  const embeddedEvmAccount = getPrivyEmbeddedAccount(user, 'ethereum')
  const embeddedSvmAccount = getPrivyEmbeddedAccount(user, 'solana')
  const svmWalletAddress = embeddedSvmAccount?.address
  const hasEvmAccount = Boolean(embeddedEvmAccount)
  const hasSvmAccount = Boolean(embeddedSvmAccount)
  const registeredSvmWallet = useMemo(() => {
    if (!svmStandardWallet || !svmWalletAddress) return null
    return createPrivySvmWallet({
      address: svmWalletAddress as SvmAddress,
      wallet: svmStandardWallet,
    })
  }, [svmStandardWallet, svmWalletAddress])

  useEffect(() => {
    if (!registeredSvmWallet) return
    return registerPrivySvmWallet(registeredSvmWallet)
  }, [registeredSvmWallet])

  // Privy hook handles are not referentially stable across renders. Keep the
  // latest handles behind a ref so the published runtime snapshot keeps a
  // stable identity unless real wallet state changes.
  const latestHandlesRef = useRef({
    authenticated,
    connectOrCreateWallet,
    createEvmWallet,
    createSvmWallet,
    embeddedEvmWallet,
    exportEvmWallet,
    exportSvmWallet,
    login,
    logout,
    sendTransaction,
    svmStandardWallet,
    svmWalletAddress,
  })
  useEffect(() => {
    latestHandlesRef.current = {
      authenticated,
      connectOrCreateWallet,
      createEvmWallet,
      createSvmWallet,
      embeddedEvmWallet,
      exportEvmWallet,
      exportSvmWallet,
      login,
      logout,
      sendTransaction,
      svmStandardWallet,
      svmWalletAddress,
    }
  })

  const operations = useMemo<PrivyRuntimeOperationHandlers>(
    () => ({
      async connectOrCreateEvmWallet() {
        await provisionPrivyWallet({
          authenticated: latestHandlesRef.current.authenticated,
          createWallet: latestHandlesRef.current.createEvmWallet,
          login: () => {
            if (connectPendingRef.current) {
              throw new Error('A Privy EVM login is already in progress')
            }
            const pending = createPendingOperation()
            connectPendingRef.current = pending.operation
            try {
              latestHandlesRef.current.connectOrCreateWallet()
            } catch (error) {
              connectPendingRef.current = undefined
              pending.operation.reject(
                error instanceof Error
                  ? error
                  : new Error('Privy EVM login failed'),
              )
            }
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
            if (loginPendingRef.current) {
              throw new Error('A Privy SVM login is already in progress')
            }
            const pending = createPendingOperation()
            loginPendingRef.current = pending.operation
            try {
              latestHandlesRef.current.login({
                walletChainType: 'solana-only',
              })
            } catch (error) {
              loginPendingRef.current = undefined
              pending.operation.reject(
                error instanceof Error
                  ? error
                  : new Error('Privy SVM login failed'),
              )
            }
            return pending.promise
          },
        })
      },
      logout: () => latestHandlesRef.current.logout(),
      async sendEvmTransaction({ address, transaction, uiOptions }) {
        const wallet = latestHandlesRef.current.embeddedEvmWallet
        if (!wallet || wallet.address.toLowerCase() !== address.toLowerCase()) {
          throw new Error('Privy EVM wallet is not active')
        }
        const result = await latestHandlesRef.current.sendTransaction(
          transaction,
          { address, uiOptions },
        )
        return { hash: result.hash as EvmTxHash }
      },
      async signSvmTransaction({ address, transaction }) {
        const wallet = latestHandlesRef.current.svmStandardWallet
        if (!wallet || latestHandlesRef.current.svmWalletAddress !== address) {
          throw new Error('Privy SVM wallet is not active')
        }
        return wallet.features['privy:'].privy.signTransaction({
          transaction,
          address,
          chain: 'solana:mainnet',
        })
      },
      async signAndSendSvmTransaction({ address, transaction, uiOptions }) {
        const wallet = latestHandlesRef.current.svmStandardWallet
        if (!wallet || latestHandlesRef.current.svmWalletAddress !== address) {
          throw new Error('Privy SVM wallet is not active')
        }
        const privy = wallet.features['privy:'].privy
        const result = await signAndSendPrivySvmTransaction(privy, {
          transaction,
          address,
          chain: 'solana:mainnet',
          options: { uiOptions },
        })
        return {
          signature: getBase58Decoder().decode(result.signature) as SvmTxHash,
        }
      },
    }),
    [],
  )

  useEffect(() => {
    return () => {
      connectPendingRef.current?.reject(new Error('Privy runtime unloaded'))
      loginPendingRef.current?.reject(new Error('Privy runtime unloaded'))
      connectPendingRef.current = undefined
      loginPendingRef.current = undefined
      privyRuntimeStore.setUnavailable()
    }
  }, [])

  const runtimeEvmWallet = useMemo<PrivyEvmWallet | undefined>(() => {
    if (!embeddedEvmWallet || !evmWalletAddress) return undefined
    return {
      address: evmWalletAddress as EvmAddress,
      async getEthereumProvider() {
        const wallet = latestHandlesRef.current.embeddedEvmWallet
        if (
          !wallet ||
          wallet.address.toLowerCase() !== evmWalletAddress.toLowerCase()
        ) {
          throw new Error('Privy EVM wallet is not active')
        }
        return toViemProvider(await wallet.getEthereumProvider())
      },
      async switchChain(chainId) {
        const wallet = latestHandlesRef.current.embeddedEvmWallet
        if (
          !wallet ||
          wallet.address.toLowerCase() !== evmWalletAddress.toLowerCase()
        ) {
          throw new Error('Privy EVM wallet is not active')
        }
        await wallet.switchChain(chainId)
      },
    }
  }, [embeddedEvmWallet, evmWalletAddress])

  useEffect(() => {
    if (error) privyRuntimeStore.setError(error)
  }, [error])

  useEffect(() => {
    if (!ready || error) return
    const runtimeSvmWallet: PrivySvmWallet | undefined = svmWalletAddress
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
        walletsReady: evmWalletsReady,
      })
    } else {
      privyRuntimeStore.publishRuntime({
        authenticated: false,
        operations,
        walletsReady: evmWalletsReady,
      })
    }

    if (!authenticated) {
      setPrivySvmReconnect(false)
    }
  }, [
    authenticated,
    error,
    evmWalletsReady,
    hasEvmAccount,
    hasSvmAccount,
    operations,
    ready,
    runtimeEvmWallet,
    svmWalletAddress,
  ])

  return null
}
