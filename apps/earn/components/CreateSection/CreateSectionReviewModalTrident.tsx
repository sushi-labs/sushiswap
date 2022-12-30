import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import {
  computeConstantProductPoolAddress,
  computeStablePoolAddress,
  ConstantProductPool,
  Fee,
  StablePool,
} from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import { Button, Dots } from '@sushiswap/ui'
import {
  Approve,
  getTridentRouterContractConfig,
  PoolFinderType,
  useBentoBoxTotals,
  useConstantProductPoolFactoryContract,
  useSendTransaction,
  useStablePoolFactoryContract,
  useTridentRouterContract,
} from '@sushiswap/wagmi'
import { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import {
  approveMasterContractAction,
  batchAction,
  deployNewPoolAction,
  getAsEncodedAction,
  LiquidityInput,
} from '../../lib/actions'
import { useNotifications, useSettings } from '../../lib/state/storage'
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
  const [permit, setPermit] = useState<Signature>()
  const { chain } = useNetwork()
  const contract = useTridentRouterContract(chainId)
  const constantProductPoolFactory = useConstantProductPoolFactoryContract(chainId)
  const stablePoolFactory = useStablePoolFactoryContract(chainId)
  const [, { createNotification }] = useNotifications(address)

  const [{ slippageTolerance }] = useSettings()

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [token0, token1], [token0, token1])
  )

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
    if (poolType === PoolFinderType.Classic) {
      return constantProductPoolFactory
    } else if (poolType === PoolFinderType.Stable) {
      return stablePoolFactory
    }
  }, [constantProductPoolFactory, poolType, stablePoolFactory])

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

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !chain?.id || !token0 || !token1) return
      const ts = new Date().getTime()
      createNotification({
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
    [chain?.id, createNotification, token0, token1]
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

  const {
    sendTransaction,
    isLoading: isWritePending,
    error,
    data,
    isSuccess,
  } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => setOpen(false),
  })

  return (
    <>
      {children({ isWritePending, setOpen })}
      <AddSectionReviewModal chainId={chainId} input0={input0} input1={input1} open={open} setOpen={setOpen}>
        <Approve
          onSuccess={createNotification}
          className="flex-grow !justify-end"
          components={
            <Approve.Components>
              <Approve.Bentobox
                id="create-trident-approve-bentobox"
                size="md"
                className="whitespace-nowrap"
                fullWidth
                address={getTridentRouterContractConfig(chainId).address}
                onSignature={setPermit}
                enabled={Boolean(getTridentRouterContractConfig(chainId).address)}
              />
              <Approve.Token
                id="create-trident-approve-token0"
                size="md"
                className="whitespace-nowrap"
                fullWidth
                amount={input0}
                address={chain ? BENTOBOX_ADDRESS[chain?.id] : undefined}
                enabled={Boolean(chain && BENTOBOX_ADDRESS[chain?.id])}
              />
              <Approve.Token
                id="create-trident-approve-token1"
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
              <Button size="md" disabled={!approved || isWritePending} fullWidth onClick={() => sendTransaction?.()}>
                {isWritePending ? <Dots>Confirm transaction</Dots> : 'Add'}
              </Button>
            )
          }}
        />
      </AddSectionReviewModal>
    </>
  )
}
