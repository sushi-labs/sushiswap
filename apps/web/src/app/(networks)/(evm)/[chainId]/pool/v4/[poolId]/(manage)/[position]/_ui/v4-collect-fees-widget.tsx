'use client'

import { TTLStorageKey } from '@sushiswap/hooks'
import {
  Button,
  CardContent,
  CardCurrencyAmountItem,
  CardFooter,
  CardGroup,
  CardLabel,
  Dots,
  Message,
} from '@sushiswap/ui'
import { type ReactElement, useMemo } from 'react'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { type Amount, formatUSD } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV4ChainId,
  type SushiSwapV4PoolKey,
  collectSushiSwapV4FeesCallParameters,
} from 'sushi/evm'
import { useV4PositionTransaction } from './use-v4-position-transaction'

interface V4CollectFeesWidgetProps {
  chainId: SushiSwapV4ChainId
  tokenId: bigint
  poolKey: SushiSwapV4PoolKey | undefined
  /** The pool's currencies, as "A/B", for the toasts. */
  pair: string
  fees: readonly [Amount<EvmCurrency>, Amount<EvmCurrency>] | undefined
  /** The index could not give the fees; collecting does not need them. */
  feesUnavailable: boolean
  feesUSD: number[]
  isLoading: boolean
  isOwner: boolean
}

export function V4CollectFeesWidget({
  chainId,
  tokenId,
  poolKey,
  pair,
  fees,
  feesUnavailable,
  feesUSD,
  isLoading,
  isOwner,
}: V4CollectFeesWidgetProps): ReactElement {
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.RemoveLiquidity,
    chainId,
  })

  // Unknown fees may still be there, so collecting stays possible
  const hasFees =
    feesUnavailable ||
    Boolean(fees && (fees[0].amount > 0n || fees[1].amount > 0n))

  const call = useMemo(
    () =>
      // Only the owner's call can succeed, so only it is simulated
      isOwner && poolKey && deadline && hasFees
        ? collectSushiSwapV4FeesCallParameters({ tokenId, poolKey, deadline })
        : undefined,
    [isOwner, poolKey, deadline, hasFees, tokenId],
  )

  const { send, isPending, isSimulationError } = useV4PositionTransaction({
    chainId,
    tokenId,
    call,
    toast: {
      type: 'claimRewards',
      pending: `Collecting fees from your ${pair} position`,
      completed: `Collected fees from your ${pair} position`,
      failed: 'Something went wrong when trying to collect fees',
    },
    location: 'V4CollectFeesWidget',
  })

  return (
    <>
      <CardContent>
        {feesUnavailable ? (
          <Message size="sm" variant="muted" className="text-center">
            Your uncollected fees could not be loaded. You can still collect
            them.
          </Message>
        ) : null}
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardCurrencyAmountItem
            unwrap={false}
            isLoading={isLoading}
            amount={fees?.[0]}
            fiatValue={formatUSD(feesUSD[0] ?? 0)}
          />
          <CardCurrencyAmountItem
            unwrap={false}
            isLoading={isLoading}
            amount={fees?.[1]}
            fiatValue={formatUSD(feesUSD[1] ?? 0)}
          />
        </CardGroup>
      </CardContent>
      <CardFooter>
        <Checker.Connect fullWidth>
          <Checker.Network fullWidth chainId={chainId}>
            <Checker.Guard
              guardWhen={!isOwner}
              guardText="Not the position owner"
            >
              <Button
                fullWidth
                size="xl"
                loading={hasFees && (!send || isPending)}
                disabled={!hasFees || isSimulationError}
                onClick={() => send?.()}
                testId="collect-fees"
              >
                {!hasFees ? (
                  'No fees to collect'
                ) : isSimulationError ? (
                  'Shoot! Something went wrong :('
                ) : isPending ? (
                  <Dots>Confirm Collect</Dots>
                ) : (
                  'Collect'
                )}
              </Button>
            </Checker.Guard>
          </Checker.Network>
        </Checker.Connect>
      </CardFooter>
    </>
  )
}
