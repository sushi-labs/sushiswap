import { TridentConstantPool, TridentStablePool } from '@sushiswap/trident-sdk'
import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Dots } from '@sushiswap/ui/components/dots'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import {
  TridentConstantPoolState,
  TridentStablePoolState,
  useAccount,
  useBentoBoxTotals,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useTotalSupply,
  useTridentRouterContract,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import {
  SendTransactionResult,
  waitForTransaction,
} from '@sushiswap/wagmi/actions'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import {
  useApproved,
  useApprovedActions,
  useSignature,
} from '@sushiswap/wagmi/systems/Checker/Provider'
import {
  LiquidityInput,
  approveMasterContractAction,
  batchAction,
} from 'lib/actions'
import { APPROVE_TAG_ADD_TRIDENT } from 'lib/constants'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import { FC, ReactNode, useCallback, useMemo } from 'react'
import { slippageAmount } from 'sushi/calculate'
import { ChainId } from 'sushi/chain'
import { BentoBoxChainId } from 'sushi/config'
import { Amount, Token, Type } from 'sushi/currency'
import { Percent, ZERO } from 'sushi/math'
import {
  Address,
  UserRejectedRequestError,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  zeroAddress,
} from 'viem'

import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalTridentProps {
  poolAddress: string
  poolState: TridentConstantPoolState | TridentStablePoolState | undefined
  pool: TridentConstantPool | TridentStablePool | null | undefined
  chainId: BentoBoxChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  children: ReactNode
  onSuccess: () => void
}

const ZERO_PERCENT = new Percent('0')

export const AddSectionReviewModalTrident: FC<
  AddSectionReviewModalTridentProps
> = ({
  poolAddress,
  poolState,
  pool,
  chainId,
  token0,
  token1,
  input0,
  input1,
  children,
  onSuccess,
}) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { signature } = useSignature(APPROVE_TAG_ADD_TRIDENT)
  const { setSignature } = useApprovedActions(APPROVE_TAG_ADD_TRIDENT)
  const { approved } = useApproved(APPROVE_TAG_ADD_TRIDENT)
  const liquidityToken = useMemo(() => {
    return new Token({
      address: poolAddress.includes(':')
        ? poolAddress.split(':')[1]
        : poolAddress,
      name: 'SLP Token',
      decimals: 18,
      symbol: 'SLP',
      chainId,
    })
  }, [chainId, poolAddress])

  const totalSupply = useTotalSupply(liquidityToken)
  const tokens = useMemo(() => [token0, token1], [token0, token1])
  const { data: rebases } = useBentoBoxTotals({ chainId, currencies: tokens })
  const contract = useTridentRouterContract(chainId)
  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === TridentConstantPoolState.NOT_EXISTS ||
          poolState === TridentStablePoolState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(
              input0.currency,
              slippageAmount(input0, slippageTolerance)[0],
            )
        : undefined,
      input1
        ? poolState === TridentConstantPoolState.NOT_EXISTS ||
          poolState === TridentStablePoolState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(
              input1.currency,
              slippageAmount(input1, slippageTolerance)[0],
            )
        : undefined,
    ]
  }, [poolState, input0, input1, slippageTolerance])

  const noLiquidity = useMemo(() => {
    return (
      poolState === TridentConstantPoolState.NOT_EXISTS ||
      poolState === TridentStablePoolState.NOT_EXISTS ||
      Boolean(totalSupply && totalSupply.quotient === ZERO) ||
      Boolean(
        pool &&
          pool.reserve0.quotient === ZERO &&
          pool.reserve1.quotient === ZERO,
      )
    )
  }, [pool, poolState, totalSupply])

  const liquidityMinted = useMemo(() => {
    if (
      pool &&
      totalSupply &&
      token0 &&
      token1 &&
      input0 &&
      input1 &&
      rebases?.[token0.wrapped.address] &&
      rebases?.[token1.wrapped.address]
    ) {
      const amountA = input0.wrapped.toShare(rebases?.[token0.wrapped.address])
      const amountB = input1.wrapped.toShare(rebases?.[token1.wrapped.address])

      // Both can't be zero
      if (amountA.equalTo(ZERO) && amountB.equalTo(ZERO)) return undefined

      try {
        const slp = pool.getLiquidityMinted(totalSupply, amountA, amountB)
        const minSLP = slippageAmount(
          slp,
          noLiquidity ? ZERO_PERCENT : slippageTolerance,
        )[0]
        return Amount.fromRawAmount(slp.currency, minSLP.toString())
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [
    noLiquidity,
    input0,
    input1,
    pool,
    rebases,
    slippageTolerance,
    token0,
    token1,
    totalSupply,
  ])

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }
      if (!data || !chain?.id || !token0 || !token1) return

      const ts = new Date().getTime()
      createToast({
        account: address,
        type: 'mint',
        chainId: chain.id,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [address, chain, token0, token1],
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    try {
      if (
        !chain?.id ||
        !pool ||
        !token0 ||
        !token1 ||
        !chainId ||
        !contract ||
        !input0 ||
        !input1 ||
        !address ||
        !minAmount0 ||
        !minAmount1 ||
        !liquidityMinted
      )
        return

      let value = 0n
      const liquidityInput: LiquidityInput[] = []
      const encoded = encodeAbiParameters(parseAbiParameters('address'), [
        address,
      ])
      if (input0) {
        if (input0.currency.isNative) {
          value = BigInt(input0.quotient.toString())
        }

        liquidityInput.push({
          token: input0.currency.isNative
            ? zeroAddress
            : (input0.currency.wrapped.address as Address),
          native: true,
          amount: BigInt(input0.quotient.toString()),
        })
      }

      if (input1) {
        if (input1.currency.isNative) {
          value = BigInt(input1.quotient.toString())
        }

        liquidityInput.push({
          token: input1.currency.isNative
            ? zeroAddress
            : (input1.currency.wrapped.address as Address),
          native: true,
          amount: BigInt(input1.quotient.toString()),
        })
      }

      if (liquidityInput.length === 0) return
      return {
        account: address,
        to: contract.address,
        data: batchAction({
          actions: [
            approveMasterContractAction({
              signature: signature,
            }),
            encodeFunctionData({
              ...contract,
              functionName: 'addLiquidity',
              args: [
                liquidityInput,
                pool.liquidityToken.address as Address,
                BigInt(liquidityMinted.quotient.toString()),
                encoded,
              ],
            }),
          ],
        }),
        value,
      }
    } catch (_e: unknown) {
      //
    }
  }, [
    chain?.id,
    pool,
    token0,
    token1,
    chainId,
    contract,
    input0,
    input1,
    address,
    minAmount0,
    minAmount1,
    liquidityMinted,
    signature,
  ])

  const { config } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(
      approved &&
        minAmount0?.greaterThan(ZERO) &&
        minAmount1?.greaterThan(ZERO),
    ),
  })

  const {
    sendTransactionAsync,
    isLoading: isWritePending,
    data,
  } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
      onSuccess()
    },
  })

  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add liquidity</DialogTitle>
                <DialogDescription>
                  Please review your entered details.
                </DialogDescription>
              </DialogHeader>
              <AddSectionReviewModal
                chainId={chainId as BentoBoxChainId}
                input0={input0}
                input1={input1}
              />
              <DialogFooter>
                <Button
                  size="xl"
                  id="confirm-add-liquidity"
                  disabled={
                    isWritePending || !approved || !sendTransactionAsync
                  }
                  fullWidth
                  onClick={() => sendTransactionAsync?.().then(() => confirm())}
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId as ChainId}
        status={status}
        testId="incentivize-confirmation-modal"
        successMessage="Successfully added liquidity"
        buttonText="Go to pool"
        buttonLink={`/pools/${chainId}:${poolAddress}`}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
