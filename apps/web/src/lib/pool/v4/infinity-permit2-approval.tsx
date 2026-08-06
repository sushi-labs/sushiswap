'use client'

import { Button, Dots } from '@sushiswap/ui'
import { type ReactNode, useEffect } from 'react'
import type { Amount } from 'sushi'
import type { EvmAddress, EvmChainId, EvmCurrency } from 'sushi/evm'
import {
  useConnection,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import {
  INFINITY_PERMIT2_ABI,
  MAX_PERMIT2_ALLOWANCE,
  MAX_PERMIT2_EXPIRATION,
} from './contract-abi'

export function InfinityPermit2Approval({
  amount,
  chainId,
  permit2,
  spender,
  children,
}: {
  amount: Amount<EvmCurrency> | undefined
  chainId: EvmChainId
  permit2: EvmAddress
  spender: EvmAddress
  children: ReactNode
}) {
  const { address } = useConnection()
  const isNative = amount?.currency.type === 'native'
  const token = amount?.currency.type === 'token' ? amount.currency : undefined
  const allowance = useReadContract({
    address: permit2,
    abi: INFINITY_PERMIT2_ABI,
    functionName: 'allowance',
    args: address && token ? [address, token.address, spender] : undefined,
    chainId,
    query: {
      enabled: Boolean(address && token && amount && amount.amount > 0n),
    },
  })
  const { data: hash, isPending, writeContract } = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ chainId, hash })

  useEffect(() => {
    if (receipt.isSuccess) {
      void allowance.refetch()
    }
  }, [allowance.refetch, receipt.isSuccess])

  if (!amount || amount.amount === 0n || isNative) return children

  const hasAllowance =
    allowance.data !== undefined &&
    allowance.data[0] >= amount.amount &&
    allowance.data[1] > Math.floor(Date.now() / 1000)

  if (hasAllowance) return children

  return (
    <Button
      fullWidth
      size="xl"
      loading={allowance.isPending || isPending || receipt.isLoading}
      disabled={!token || allowance.isError}
      onClick={() => {
        if (!token) return
        writeContract({
          address: permit2,
          abi: INFINITY_PERMIT2_ABI,
          functionName: 'approve',
          args: [
            token.address,
            spender,
            MAX_PERMIT2_ALLOWANCE,
            MAX_PERMIT2_EXPIRATION,
          ],
          chainId,
        })
      }}
    >
      {isPending || receipt.isLoading ? (
        <Dots>Confirm Permit2 Approval</Dots>
      ) : (
        `Approve ${token?.symbol ?? 'token'} for V4`
      )}
    </Button>
  )
}
