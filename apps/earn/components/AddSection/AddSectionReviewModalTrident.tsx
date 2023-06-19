import { defaultAbiCoder } from '@ethersproject/abi'
import { AddressZero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import { calculateSlippageAmount, ConstantProductPool, StablePool } from '@sushiswap/amm'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Token, Type } from '@sushiswap/currency'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { Dots } from '@sushiswap/ui'
import {
  _useSendTransaction as useSendTransaction,
  ConstantProductPoolState,
  StablePoolState,
  useAccount,
  useBentoBoxTotals,
  useNetwork,
  useTotalSupply,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react'

import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { approveMasterContractAction, batchAction, getAsEncodedAction, LiquidityInput } from '../../lib/actions'
import { AddSectionReviewModal } from './AddSectionReviewModal'
import { createToast } from '@sushiswap/ui/future/components/toast'
import { Button } from '@sushiswap/ui/future/components/button'
import { useSlippageTolerance } from '../../lib/hooks/useSlippageTolerance'
import { useApproved, useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { APPROVE_TAG_ADD_TRIDENT } from '../../lib/constants'

interface AddSectionReviewModalTridentProps {
  poolAddress: string
  poolState: ConstantProductPoolState | StablePoolState | undefined
  pool: ConstantProductPool | StablePool | null | undefined
  chainId: BentoBoxV1ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
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
        ? poolState === ConstantProductPoolState.NOT_EXISTS || poolState === StablePoolState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === ConstantProductPoolState.NOT_EXISTS || poolState === StablePoolState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const noLiquidity = useMemo(() => {
    return (
      poolState === ConstantProductPoolState.NOT_EXISTS ||
      poolState === StablePoolState.NOT_EXISTS ||
      Boolean(totalSupply && JSBI.equal(totalSupply.quotient, ZERO)) ||
      Boolean(pool && JSBI.equal(pool.reserve0.quotient, ZERO) && JSBI.equal(pool.reserve1.quotient, ZERO))
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
    (data: SendTransactionResult | undefined) => {
      if (!data || !chain?.id || !token0 || !token1) return
      const ts = new Date().getTime()
      createToast({
        account: address,
        type: 'mint',
        chainId: chain.id,
        txHash: data.hash,
        promise: data.wait(),
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

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
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

        let value
        const liquidityInput: LiquidityInput[] = []
        const encoded = defaultAbiCoder.encode(['address'], [address])
        if (input0) {
          if (input0.currency.isNative) {
            value = input0.quotient.toString()
          }

          liquidityInput.push({
            token: input0.currency.isNative ? AddressZero : input0.currency.wrapped.address,
            native: true,
            amount: input0.quotient.toString(),
          })
        }

        if (input1) {
          if (input1.currency.isNative) {
            value = input1.quotient.toString()
          }

          liquidityInput.push({
            token: input1.currency.isNative ? AddressZero : input1.currency.wrapped.address,
            native: true,
            amount: input1.quotient.toString(),
          })
        }

        if (liquidityInput.length === 0) return

        setRequest({
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions: [
              approveMasterContractAction({
                router: contract,
                signature: signature,
              }),
              getAsEncodedAction({
                contract,
                fn: 'addLiquidity',
                args: [liquidityInput, pool.liquidityToken.address, liquidityMinted.quotient.toString(), encoded],
              }),
            ],
          }),
          ...(value && { value }),
        })
      } catch (e: unknown) {
        //
      }
    },
    [
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
    ]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => {
      setSignature(undefined)
      close()
    },
    enabled: approved,
  })

  return (
    <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} close={close}>
      <Button
        id="confirm-add-liquidity"
        size="xl"
        disabled={isWritePending}
        fullWidth
        onClick={() => sendTransaction?.()}
      >
        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
      </Button>
    </AddSectionReviewModal>
  )
}
