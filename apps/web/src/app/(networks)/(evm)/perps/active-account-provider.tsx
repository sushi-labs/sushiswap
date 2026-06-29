'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import { useAccount } from 'src/lib/wallet'
import type { EvmAddress } from 'sushi/evm'
import {
  type AccountType,
  type ActiveAccount,
  reconcileActiveAccountWithWallet,
} from './active-account-state'

interface State {
  state: {
    activeAccount: ActiveAccount | null
    activeAddress: EvmAddress | undefined
  }
  mutate: {
    setActiveAccount: (
      account: EvmAddress | null,
      accountType: AccountType,
      name: string,
    ) => void
  }
}

const ActiveAccountContext = createContext<State>({} as State)

interface ActiveAccountProviderProps {
  children: React.ReactNode
}

const ActiveAccountProvider: FC<ActiveAccountProviderProps> = ({
  children,
}) => {
  const address = useAccount('evm')
  // select between master account and vault accounts for trading, default to master account
  const [activeAccount, _setActiveAccount] =
    useLocalStorage<ActiveAccount | null>('sushi.perps.active-account', null)
  const activeAddress = activeAccount?.address || undefined

  const setActiveAccount = useCallback(
    (account: EvmAddress | null, accountType: AccountType, name: string) => {
      if (account === null || !address) {
        _setActiveAccount(null)
      } else {
        _setActiveAccount({
          address: account,
          type: accountType,
          walletAddress: address,
          name,
        })
      }
    },
    [_setActiveAccount, address],
  )

  useEffect(() => {
    const nextActiveAccount = reconcileActiveAccountWithWallet(
      activeAccount,
      address,
    )

    if (nextActiveAccount !== activeAccount) {
      setActiveAccount(
        nextActiveAccount?.address ?? null,
        nextActiveAccount?.type ?? 'master',
        nextActiveAccount?.name ?? '',
      )
    }
  }, [address, activeAccount, setActiveAccount])

  return (
    <ActiveAccountContext.Provider
      value={useMemo(() => {
        return {
          state: {
            activeAccount,
            activeAddress,
          },
          mutate: {
            setActiveAccount,
          },
        }
      }, [setActiveAccount, activeAccount, activeAddress])}
    >
      {children}
    </ActiveAccountContext.Provider>
  )
}

const useActiveAccountState = () => {
  const context = useContext(ActiveAccountContext)
  if (!context) {
    throw new Error('Hook can only be used inside ActiveAccount Context')
  }

  return context
}

export { ActiveAccountProvider, useActiveAccountState }
