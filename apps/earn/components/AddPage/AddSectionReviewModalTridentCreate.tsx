import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import {
  computeConstantProductPoolAddress,
  computeStablePoolAddress,
  ConstantProductPool,
  Fee,
  StablePool,
} from '@sushiswap/amm'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Amount, Type } from '@sushiswap/currency'
import { Button, Dots } from '@sushiswap/ui'
import {
  useBentoBoxTotals,
  useConstantProductPoolFactoryContract,
  _useSendTransaction as useSendTransaction,
  useStablePoolFactoryContract,
  useTridentRouterContract,
  useAccount,
  useNetwork,
} from '@sushiswap/wagmi'
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import {
  approveMasterContractAction,
  batchAction,
  deployNewPoolAction,
  getAsEncodedAction,
  LiquidityInput,
} from '../../lib/actions'
import { AddSectionReviewModal } from '../AddSection'
import { PoolType } from '@sushiswap/wagmi/future/hooks'
import { createToast } from '@sushiswap/ui/future/components/toast'

interface CreateSectionReviewModalTridentProps {
  chainId: BentoBoxV1ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  fee: Fee
  poolType: PoolType
  open: boolean
  close(): void
  permit: Signature | undefined
}

export const CreateSectionReviewModalTrident: FC<CreateSectionReviewModalTridentProps> = ({
  token0,
  token1,
  input0,
  input1,
  fee,
  poolType,
  chainId,
  open,
  close,
  permit,
}) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const contract = useTridentRouterContract(chainId)
  const constantProductPoolFactory = useConstantProductPoolFactoryContract(chainId)
  const stablePoolFactory = useStablePoolFactoryContract(chainId)

  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [token0, token1], [token0, token1])
  )

  const pool = useMemo(() => {
    if (!token0 || !token1 || !fee) return
    if (poolType === PoolType.ConstantProduct) {
      return new ConstantProductPool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        false
      )
    } else if (
      poolType === PoolType.StablePool &&
      totals &&
      token0.wrapped.address in totals &&
      token1.wrapped.address in totals
    ) {
      return new StablePool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        totals[token0.wrapped.address],
        totals[token1.wrapped.address]
      )
    }
  }, [fee, token0, token1, poolType, totals])

  const totalSupply = useMemo(() => (pool ? Amount.fromRawAmount(pool?.liquidityToken, 0) : undefined), [pool])

  const factory = useMemo(() => {
    if (poolType === PoolType.ConstantProduct) {
      return constantProductPoolFactory
    } else if (poolType === PoolType.StablePool) {
      return stablePoolFactory
    }
  }, [constantProductPoolFactory, poolType, stablePoolFactory])

  const poolAddress = useMemo(() => {
    if (!factory || !token0 || !token1 || !fee) return
    if (poolType === PoolType.ConstantProduct) {
      return computeConstantProductPoolAddress({
        factoryAddress: factory.address,
        tokenA: token0.wrapped,
        tokenB: token1.wrapped,
        fee: fee,
        twap: false,
      })
    } else if (poolType === PoolType.StablePool) {
      return computeStablePoolAddress({
        factoryAddress: factory.address,
        tokenA: token0.wrapped,
        tokenB: token1.wrapped,
        fee: fee,
      })
    }
  }, [factory, fee, token0, token1, poolType])

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
    [chain?.id, address, token0, token1]
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        if (
          !chain?.id ||
          !factory ||
          !token0 ||
          !token1 ||
          !poolAddress ||
          !input0 ||
          !input1 ||
          !totalSupply ||
          !pool ||
          !contract ||
          !totals?.[token0.wrapped.address] ||
          !totals?.[token1.wrapped.address]
        ) {
          return
        }

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

        setRequest({
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions: [
              approveMasterContractAction({
                router: contract,
                signature: permit,
              }),
              deployNewPoolAction({
                assets: [input0.currency, input1.currency],
                factory: factory.address,
                router: contract,
                feeTier: fee,
                twap: false,
              }),
              getAsEncodedAction({
                contract,
                fn: 'addLiquidity',
                args: [
                  liquidityInput,
                  poolAddress,
                  pool
                    .getLiquidityMinted(
                      totalSupply,
                      input0.wrapped.toShare(totals?.[token0.wrapped.address]),
                      input1.wrapped.toShare(totals?.[token1.wrapped.address])
                    )
                    .quotient.toString(),
                  encoded,
                ],
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
      address,
      chain?.id,
      contract,
      factory,
      fee,
      input0,
      input1,
      permit,
      pool,
      poolAddress,
      token0,
      token1,
      totalSupply,
      totals,
    ]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: close,
  })

  return (
    <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} setOpen={close}>
      <Button size="md" disabled={isWritePending} fullWidth onClick={() => sendTransaction?.()}>
        {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
      </Button>
    </AddSectionReviewModal>
  )
}
