'use client'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LinkInternal,
} from '@sushiswap/ui'
import { type ReactElement, useEffect, useRef, useState } from 'react'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import type { Amount } from 'sushi'
import {
  StellarChainId,
  type StellarContractAddress,
  type StellarToken,
} from 'sushi/stellar'
import { useCreateAndInitializePool } from '~stellar/_common/lib/hooks/factory/use-create-and-initialize-pool'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/liquidity/use-add-liquidity'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { Trustlines } from '~stellar/_common/ui/checker/trustline'
import { useStellarWallet } from '~stellar/providers'

interface PoolSubmitProps {
  token0: StellarToken
  token1: StellarToken
  fee: number
  poolAddress: StellarContractAddress | undefined
  needsInitialization: boolean
  sqrtPriceX96: bigint | undefined
  tickLower: number
  tickUpper: number
  amount0: string
  amount1: string
  amounts: Amount<StellarToken>[]
  disabledReason: string | undefined
  onCreated(address: StellarContractAddress): void
  onBusyChange(busy: boolean): void
  onSuccess(): void
}

export function PoolSubmit({
  token0,
  token1,
  fee,
  poolAddress,
  needsInitialization,
  sqrtPriceX96,
  tickLower,
  tickUpper,
  amount0,
  amount1,
  amounts,
  disabledReason,
  onCreated,
  onBusyChange,
  onSuccess,
}: PoolSubmitProps): ReactElement {
  const account = useAccount('stellar')
  const { signTransaction, signAuthEntry } = useStellarWallet()
  const createPool = useCreateAndInitializePool()
  const addLiquidity = useAddLiquidity()
  const [pending, setPending] = useState<string>()
  const [error, setError] = useState<string>()
  const [success, setSuccess] = useState<{
    pool: StellarContractAddress
    hash: string
  }>()
  const submitting = useRef(false)
  const active = useRef(true)
  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
      onBusyChange(false)
    }
  }, [onBusyChange])

  async function submit(): Promise<void> {
    if (
      !account ||
      disabledReason ||
      submitting.current ||
      sqrtPriceX96 === undefined
    )
      return
    submitting.current = true
    onBusyChange(true)
    setError(undefined)
    let address = poolAddress
    async function sign(xdr: string): Promise<string> {
      if (!active.current)
        throw new Error(
          'The wallet or pool selection changed. Please try again.',
        )
      return signTransaction(xdr)
    }
    async function signAuth(xdr: string): Promise<string> {
      if (!active.current)
        throw new Error(
          'The wallet or pool selection changed. Please try again.',
        )
      return signAuthEntry(xdr)
    }
    try {
      if (needsInitialization) {
        setPending('Creating / initializing pool…')
        const { result } = await createPool.mutateAsync({
          tokenA: token0.address,
          tokenB: token1.address,
          fee,
          sqrtPriceX96,
          userAddress: account,
          signTransaction: sign,
        })
        address = result.poolAddress
        if (!active.current) return
        onCreated(address)
      }
      if (!address) throw new Error('Pool address unavailable')
      if (!active.current) return
      setPending('Adding liquidity…')
      const { result } = await addLiquidity.mutateAsync({
        poolAddress: address,
        userAddress: account,
        token0Amount: amount0,
        token1Amount: amount1,
        token0Decimals: token0.decimals,
        token1Decimals: token1.decimals,
        tickLower,
        tickUpper,
        recipient: account,
        signTransaction: sign,
        signAuthEntry: signAuth,
      })
      if (!active.current) return
      setSuccess({ pool: address, hash: result.txHash })
      onSuccess()
    } catch (error) {
      if (active.current)
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to add liquidity. Please try again.',
        )
    } finally {
      submitting.current = false
      if (active.current) {
        setPending(undefined)
        onBusyChange(false)
      }
    }
  }

  return (
    <>
      {error && (
        <p role="alert" className="text-sm text-red">
          {error}
        </p>
      )}
      <Connect namespace="stellar" fullWidth size="xl">
        {pending || disabledReason ? (
          <Button fullWidth size="xl" disabled loading={Boolean(pending)}>
            {pending ?? disabledReason}
          </Button>
        ) : (
          <Trustlines tokens={[token0, token1]} fullWidth size="xl">
            <Amounts
              chainId={StellarChainId.STELLAR}
              amounts={amounts}
              fullWidth
              size="xl"
            >
              <Button
                fullWidth
                size="xl"
                type="button"
                onClick={() => void submit()}
              >
                {needsInitialization
                  ? 'Create pool & add liquidity'
                  : 'Add liquidity'}
              </Button>
            </Amounts>
          </Trustlines>
        )}
      </Connect>
      <Dialog
        open={Boolean(success)}
        onOpenChange={(open) => {
          if (!open) setSuccess(undefined)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liquidity added</DialogTitle>
            <DialogDescription>
              You successfully added liquidity to the {token0.symbol}/
              {token1.symbol} pair.
            </DialogDescription>
          </DialogHeader>
          {success && (
            <a
              href={getStellarTxnLink(success.hash)}
              target="_blank"
              rel="noreferrer"
              className="text-blue hover:underline"
            >
              View transaction
            </a>
          )}
          <DialogFooter>
            {success && (
              <Button asChild fullWidth size="xl">
                <LinkInternal href={`/stellar/pool/${success.pool}`}>
                  View your position
                </LinkInternal>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
