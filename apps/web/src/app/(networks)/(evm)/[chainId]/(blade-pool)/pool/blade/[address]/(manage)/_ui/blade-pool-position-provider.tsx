'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import {
  type FC,
  type ReactNode,
  createContext,
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
  const { data: vestingDeposit, isLoading: isVestingDepositLoading } =
    useVestingDeposit({ pool, address })

  const isLoading = isBalanceLoading || isVestingDepositLoading

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          balance,
          vestingDeposit,
          liquidityToken,
          isLoading,
          isError,
        }),
        [balance, isError, isLoading, liquidityToken, vestingDeposit],
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
