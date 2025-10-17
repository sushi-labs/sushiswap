'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { useVestingDeposit } from 'src/lib/pool/blade/useVestingDeposit'
import type { Amount } from 'sushi'
import { type EvmCurrency, EvmToken } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'

interface BladePoolPositionContext {
  balance: Amount<EvmCurrency> | null | undefined
  vestingDeposit?: {
    balance: bigint
    lockedUntil: Date | undefined
  }
  liquidityToken: EvmToken
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

const Context = createContext<BladePoolPositionContext | undefined>(undefined)

export const BladePoolPositionProvider: FC<{
  pool: BladePool
  children: ReactNode
  watch?: boolean
}> = ({ pool, children }) => {
  const { address } = useAccount()
  const liquidityToken = useMemo(() => {
    return new EvmToken({
      chainId: pool.chainId,
      address: pool.address,
      decimals: 18,
      symbol: 'ClipperLP',
      name: 'Clipper LP Token',
    })
  }, [pool])

  const {
    data: balance,
    isLoading: isBalanceLoading,
    isError,
  } = useAmountBalance(liquidityToken)
  const {
    data: vestingDeposit,
    isLoading: isVestingDepositLoading,
    refetch: refetchVestingDeposit,
  } = useVestingDeposit({ pool, address })

  const isLoading = isBalanceLoading || isVestingDepositLoading

  const refetch = useCallback(() => {
    refetchVestingDeposit()
  }, [refetchVestingDeposit])

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          balance,
          vestingDeposit,
          liquidityToken,
          isLoading,
          isError,
          refetch,
        }),
        [balance, isError, isLoading, liquidityToken, vestingDeposit, refetch],
      )}
    >
      {children}
    </Context.Provider>
  )
}

export const useBladePoolPosition = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Blade Pool Position Context')
  }

  return context
}
