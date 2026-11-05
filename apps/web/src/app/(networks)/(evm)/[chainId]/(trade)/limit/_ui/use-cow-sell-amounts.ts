'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { CowLimitChainId } from 'src/lib/swap/cow/chains'
import { getOpenCowSellAmount } from 'src/lib/swap/cow/order-history'
import { getCowOpenSellAmountQueryKey } from 'src/lib/swap/cow/query-keys'
import { Amount } from 'sushi'
import type { EvmAddress, EvmCurrency } from 'sushi/evm'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'

// A native sell spends the wrapped balance first and only wraps the shortfall.
export function useCowSellRequirement(
  sell: EvmCurrency | undefined,
  sellAmount: bigint | undefined,
): Amount<EvmCurrency> | undefined {
  const wrapped = useMemo(
    () => (sell?.isNative ? sell.wrap() : undefined),
    [sell],
  )
  const { data: wrappedBalance } = useAmountBalance(wrapped)

  if (!sell || !sellAmount) return undefined
  if (!wrapped) return new Amount(sell, sellAmount)

  const covered = wrappedBalance?.amount ?? 0n
  return covered >= sellAmount
    ? new Amount(wrapped, sellAmount)
    : new Amount(sell, sellAmount - covered)
}

// Other open orders draw on the same allowance, so an exact approval covers them too.
export function useCowApprovalAmount({
  chainId,
  owner,
  sell,
  sellAmount,
  replacedUid,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress | undefined
  sell: EvmCurrency | undefined
  sellAmount: bigint | undefined
  replacedUid: string | undefined
}): Amount<EvmCurrency> | undefined {
  const token = sell?.wrap()

  const { data: openAmount, isError } = useQuery({
    queryKey: getCowOpenSellAmountQueryKey({
      chainId,
      owner,
      sellToken: token?.address,
      replacedUid,
    }),
    queryFn: () => {
      if (!owner || !token) throw new Error('Select a token to approve')

      return getOpenCowSellAmount({
        chainId,
        owner,
        sellToken: token.address,
        excludedUids: replacedUid ? [replacedUid] : [],
      })
    },
    enabled: Boolean(owner && token),
  })

  if (!token || !sellAmount) return undefined
  // Without the order history, approve at least this order.
  if (isError) return new Amount(token, sellAmount)
  if (openAmount === undefined) return undefined
  return new Amount(token, sellAmount + openAmount)
}
