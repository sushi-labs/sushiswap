import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import {
  computeConstantProductPoolAddress,
  computeStablePoolAddress,
  ConstantProductPool,
  Fee,
  StablePool,
} from '@sushiswap/exchange'
import { Button, Dots } from '@sushiswap/ui'
import {
  Approve,
  BENTOBOX_ADDRESS,
  getTridentRouterContractConfig,
  PoolFinderType,
  useBentoBoxTotals,
  useConstantProductPoolFactoryContract,
  useStablePoolFactoryContract,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { ProviderRpcError, useAccount, useDeprecatedSendTransaction, useNetwork, UserRejectedRequestError } from 'wagmi'

import {
  approveMasterContractAction,
  batchAction,
  deployNewPoolAction,
  getAsEncodedAction,
  LiquidityInput,
} from '../../lib/actions'
import { useNotifications } from '../../lib/state/storage'
import { AddSectionReviewModal } from '../AddSection'

interface CreateSectionReviewModalTridentProps {
  chainId: ChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  fee: Fee
  poolType: PoolFinderType
  children({ isWritePending, setOpen }: { isWritePending: boolean; setOpen(open: boolean): void }): ReactNode
}

export const CreateSectionReviewModalTrident: FC<CreateSectionReviewModalTridentProps> = ({
  token0,
  token1,
  input0,
  input1,
  fee,
  poolType,
  chainId,
  children,
}) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [permit, setPermit] = useState<Signature>()
  const { chain } = useNetwork()
  const contract = useTridentRouterContract(chainId)
  const constantProductPoolFactory = useConstantProductPoolFactoryContract(chainId)
  const stablePoolFactory = useStablePoolFactoryContract(chainId)
  const [, { createNotification }] = useNotifications(address)

  const totals = useBentoBoxTotals(chainId, [token0, token1])

  const pool = useMemo(() => {
    if (!token0 || !token1 || !fee) return
    if (poolType === PoolFinderType.Classic) {
      return new ConstantProductPool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        false
      )
    } else if (
      poolType === PoolFinderType.Stable &&
      totals &&
      token0?.wrapped?.address in totals &&
      token1?.wrapped?.address in totals
    ) {
      return new StablePool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        totals[token0?.wrapped?.address],
        totals[token1?.wrapped?.address]
      )
    }
  }, [fee, token0, token1, poolType, totals])

  const totalSupply = useMemo(() => (pool ? Amount.fromRawAmount(pool?.liquidityToken, 0) : undefined), [pool])

  const factory = useMemo(() => {
    if (poolType === PoolFinderType.Classic) {
      return constantProductPoolFactory
    } else if (poolType === PoolFinderType.Stable) {
      return stablePoolFactory
    }
  }, [constantProductPoolFactory, poolType, stablePoolFactory])

  const { sendTransactionAsync, isLoading: isWritePending } = useDeprecatedSendTransaction({
    chainId,
    onSuccess: () => setOpen(false),
  })

  const poolAddress = useMemo(() => {
    // !poolType === 0, don't guared against it
    if (!factory || !token0 || !token1 || !fee) return
    if (poolType === PoolFinderType.Classic) {
      return computeConstantProductPoolAddress({
        factoryAddress: factory.address,
        tokenA: token0.wrapped,
        tokenB: token1.wrapped,
        fee: fee,
        twap: false,
      })
    } else if (poolType === PoolFinderType.Stable) {
      return computeStablePoolAddress({
        factoryAddress: factory.address,
        tokenA: token0.wrapped,
        tokenB: token1.wrapped,
        fee: fee,
      })
    }
  }, [factory, fee, token0, token1, poolType])

  const execute = useCallback(async () => {
    if (
      !chain?.id ||
      !factory ||
      !poolAddress ||
      !totalSupply ||
      !pool ||
      !totals ||
      !input0 ||
      !input1 ||
      !(input0.currency.wrapped.address in totals) ||
      !(input1.currency.wrapped.address in totals)
    ) {
      return
    }

    let value
    const liquidityInput: LiquidityInput[] = []
    const encoded = defaultAbiCoder.encode(['address'], [address])

    try {
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

      // console.log(
      //   'getLiquidityMinted',
      //   totalSupply.quotient.toString(),
      //   input0.quotient.toString(),
      //   input1.quotient.toString(),
      //   {
      //     base: pool instanceof StablePool && pool.total0.base.toString(),
      //     elastic: pool instanceof StablePool && pool.total0.elastic.toString(),
      //   },
      //   {
      //     base: pool instanceof StablePool && pool.total1.base.toString(),
      //     elastic: pool instanceof StablePool && pool.total1.elastic.toString(),
      //   },
      //   pool.getLiquidityMinted(totalSupply, input0, input1).quotient.toString()
      // )

      const data = await sendTransactionAsync({
        request: {
          from: address,
          to: contract.address,
          data: batchAction({
            contract,
            actions: [
              approveMasterContractAction({ router: contract, signature: permit }),
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
                  pool.getLiquidityMinted(totalSupply, input0.wrapped, input1.wrapped).quotient.toString(),
                  encoded,
                ],
              }),
            ],
          }),
          ...(value && { value }),
        },
      })

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId: chain.id,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Adding liquidity to the ${input0.currency.symbol}/${input1.currency.symbol} pair`,
          completed: `Successfully added liquidity to the ${input0.currency.symbol}/${input1.currency.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    } catch (e: unknown) {
      if (e instanceof UserRejectedRequestError) return
      if (e instanceof ProviderRpcError) {
        setError(e.message)
      }
      console.error(e)
    }
  }, [
    address,
    chain?.id,
    contract,
    createNotification,
    factory,
    fee,
    input0,
    input1,
    permit,
    pool,
    poolAddress,
    sendTransactionAsync,
    totalSupply,
    totals,
  ])

  return (
    <>
      {children({ isWritePending, setOpen })}
      <AddSectionReviewModal
        chainId={chainId}
        input0={input0}
        input1={input1}
        open={open}
        setOpen={setOpen}
        error={error}
      >
        <Approve
          onSuccess={createNotification}
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              <Approve.Bentobox
                size="md"
                className="whitespace-nowrap"
                fullWidth
                address={getTridentRouterContractConfig(chainId).addressOrName}
                onSignature={setPermit}
              />
              <Approve.Token
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input0}
                address={chain ? BENTOBOX_ADDRESS[chain?.id] : undefined}
                enabled={Boolean(chain && BENTOBOX_ADDRESS[chain?.id])}
              />
              <Approve.Token
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input1}
                address={chain ? BENTOBOX_ADDRESS[chain?.id] : undefined}
                enabled={Boolean(chain && BENTOBOX_ADDRESS[chain?.id])}
              />
            </Approve.Components>
          }
          render={({ approved }) => {
            return (
              <Button size="md" disabled={!approved} fullWidth onClick={execute}>
                {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
              </Button>
            )
          }}
        />
      </AddSectionReviewModal>
    </>
  )
}
