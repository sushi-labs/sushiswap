import { calculateSlippageAmount, TridentConstantPool, TridentStablePool } from '@sushiswap/amm'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Token, Type } from '@sushiswap/currency'
import { Percent, ZERO } from '@sushiswap/math'
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
} from '@sushiswap/wagmi'
import { SendTransactionResult, waitForTransaction } from '@sushiswap/wagmi/actions'
import { useApproved, useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { approveMasterContractAction, batchAction, LiquidityInput } from 'lib/actions'
import { APPROVE_TAG_ADD_TRIDENT } from 'lib/constants'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import { FC, useCallback, useMemo } from 'react'
import {
  Address,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  UserRejectedRequestError,
  zeroAddress,
} from 'viem'

import { AddSectionReviewModal } from './AddSectionReviewModal'

interface AddSectionReviewModalTridentProps {
  poolAddress: string
  poolState: TridentConstantPoolState | TridentStablePoolState | undefined
  pool: TridentConstantPool | TridentStablePool | null | undefined
  chainId: BentoBoxV1ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  onSuccess: () => void
  open: boolean
  close(): void
}

const ZERO_PERCENT = new Percent('0')

export const AddSectionReviewModalTrident: FC<AddSectionReviewModalTridentProps> = ({
  poolAddress,
  poolState,
  pool,
  chainId,
  token0,
  token1,
  input0,
  input1,
  onSuccess,
  open,
  close,
}) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { signature, setSignature } = useSignature(APPROVE_TAG_ADD_TRIDENT)
  const { approved } = useApproved(APPROVE_TAG_ADD_TRIDENT)
  const liquidityToken = useMemo(() => {
    return new Token({
      address: poolAddress.includes(':') ? poolAddress.split(':')[1] : poolAddress,
      name: 'SLP Token',
      decimals: 18,
      symbol: 'SLP',
      chainId,
    })
  }, [chainId, poolAddress])

  const totalSupply = useTotalSupply(liquidityToken)
  const tokens = useMemo(() => [token0, token1], [token0, token1])
  const rebases = useBentoBoxTotals(chainId, tokens)
  const contract = useTridentRouterContract(chainId)
  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(+(slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance) * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === TridentConstantPoolState.NOT_EXISTS || poolState === TridentStablePoolState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === TridentConstantPoolState.NOT_EXISTS || poolState === TridentStablePoolState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const noLiquidity = useMemo(() => {
    return (
      poolState === TridentConstantPoolState.NOT_EXISTS ||
      poolState === TridentStablePoolState.NOT_EXISTS ||
      Boolean(totalSupply && totalSupply.quotient === ZERO) ||
      Boolean(pool && pool.reserve0.quotient === ZERO && pool.reserve1.quotient === ZERO)
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
        const minSLP = calculateSlippageAmount(slp, noLiquidity ? ZERO_PERCENT : slippagePercent)[0]
        return Amount.fromRawAmount(slp.currency, minSLP.toString())
      } catch (error) {
        console.error(error)
      }
    }

    return undefined
  }, [noLiquidity, input0, input1, pool, rebases, slippagePercent, token0, token1, totalSupply])

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
    [address, chain?.id, token0, token1]
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
      const encoded = encodeAbiParameters(parseAbiParameters('address'), [address])
      if (input0) {
        if (input0.currency.isNative) {
          value = BigInt(input0.quotient.toString())
        }

        liquidityInput.push({
          token: input0.currency.isNative ? zeroAddress : (input0.currency.wrapped.address as Address),
          native: true,
          amount: BigInt(input0.quotient.toString()),
        })
      }

      if (input1) {
        if (input1.currency.isNative) {
          value = BigInt(input1.quotient.toString())
        }

        liquidityInput.push({
          token: input1.currency.isNative ? zeroAddress : (input1.currency.wrapped.address as Address),
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
    } catch (e: unknown) {
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

  const { config } = usePrepareSendTransaction({ ...prepare, chainId, enabled: approved })

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    ...config,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
      onSuccess()
    },
  })

  return (
    <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} close={close}>
      <Button
        size="xl"
        id="confirm-add-liquidity"
        disabled={isWritePending || !approved || !sendTransaction}
        fullWidth
        onClick={() => sendTransaction?.()}
      >
        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
      </Button>
    </AddSectionReviewModal>
  )
}
