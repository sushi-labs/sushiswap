import {
  TridentConstantPool,
  TridentStablePool,
  computeTridentConstantPoolAddress,
  computeTridentStablePoolAddress,
} from '@sushiswap/trident-sdk'
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
  PoolFinderType,
  useAccount,
  useBentoBoxTotals,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useStablePoolFactoryContract,
  useTridentConstantPoolFactoryContract,
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
  useSignature,
} from '@sushiswap/wagmi/systems/Checker/Provider'
import {
  LiquidityInput,
  approveMasterContractAction,
  batchAction,
  deployNewPoolAction,
} from 'lib/actions'
import { APPROVE_TAG_CREATE_TRIDENT } from 'lib/constants'
import { FC, ReactNode, useCallback, useMemo } from 'react'
import { ChainId } from 'sushi/chain'
import { BentoBoxChainId } from 'sushi/config'
import { Amount, Type } from 'sushi/currency'
import { Fee } from 'sushi/dex'
import {
  Address,
  UserRejectedRequestError,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  zeroAddress,
} from 'viem'

import { AddSectionReviewModal } from './AddSectionReviewModal'

interface CreateSectionReviewModalTridentProps {
  chainId: BentoBoxChainId
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  fee: Fee
  poolType: PoolFinderType
  children: ReactNode
}

export const CreateSectionReviewModalTrident: FC<
  CreateSectionReviewModalTridentProps
> = ({ token0, token1, input0, input1, fee, poolType, chainId, children }) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { signature, setSignature } = useSignature(APPROVE_TAG_CREATE_TRIDENT)
  const { approved } = useApproved(APPROVE_TAG_CREATE_TRIDENT)
  const contract = useTridentRouterContract(chainId)
  const constantProductPoolFactory =
    useTridentConstantPoolFactoryContract(chainId)
  const stablePoolFactory = useStablePoolFactoryContract(chainId)

  const totals = useBentoBoxTotals(
    chainId,
    useMemo(() => [token0, token1], [token0, token1]),
  )

  const pool = useMemo(() => {
    if (!token0 || !token1 || !fee) return
    if (poolType === PoolFinderType.Classic) {
      return new TridentConstantPool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        false,
      )
    } else if (
      poolType === PoolFinderType.Stable &&
      totals &&
      token0.wrapped.address in totals &&
      token1.wrapped.address in totals
    ) {
      return new TridentStablePool(
        Amount.fromRawAmount(token0.wrapped, 0),
        Amount.fromRawAmount(token1.wrapped, 0),
        fee,
        totals[token0.wrapped.address],
        totals[token1.wrapped.address],
      )
    }
  }, [fee, token0, token1, poolType, totals])

  const totalSupply = useMemo(
    () => (pool ? Amount.fromRawAmount(pool?.liquidityToken, 0) : undefined),
    [pool],
  )

  const factory = useMemo(() => {
    switch (poolType) {
      case PoolFinderType.Classic:
        return constantProductPoolFactory
      case PoolFinderType.Stable:
        return stablePoolFactory
    }
  }, [constantProductPoolFactory, poolType, stablePoolFactory])

  const poolAddress = useMemo(() => {
    // !poolType === 0, don't guared against it
    if (!factory || !token0 || !token1 || !fee) return
    switch (poolType) {
      case PoolFinderType.Classic:
        return computeTridentConstantPoolAddress({
          factoryAddress: factory.address,
          tokenA: token0.wrapped,
          tokenB: token1.wrapped,
          fee: fee,
          twap: false,
        }) as Address
      case PoolFinderType.Stable:
        return computeTridentStablePoolAddress({
          factoryAddress: factory.address,
          tokenA: token0.wrapped,
          tokenB: token1.wrapped,
          fee: fee,
        }) as Address
    }
  }, [factory, fee, token0, token1, poolType])

  const isValid = useMemo(() => {
    return Boolean(
      chain?.id &&
        factory &&
        token0 &&
        token1 &&
        poolAddress &&
        input0 &&
        input1 &&
        totalSupply &&
        pool &&
        contract &&
        totals?.[token0.wrapped.address] &&
        totals?.[token1.wrapped.address],
    )
  }, [
    chain?.id,
    contract,
    factory,
    input0,
    input1,
    pool,
    poolAddress,
    token0,
    token1,
    totalSupply,
    totals,
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
    [chain?.id, token0, token1, address],
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
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
        !totals?.[token1.wrapped.address] ||
        !address
      ) {
        return
      }

      let value
      const liquidityInput: LiquidityInput[] = []
      const encoded = encodeAbiParameters(parseAbiParameters('address'), [
        address,
      ])

      if (input0) {
        if (input0.currency.isNative) {
          value = input0.quotient
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
          value = input1.quotient
        }

        liquidityInput.push({
          token: input1.currency.isNative
            ? zeroAddress
            : (input1.currency.wrapped.address as Address),
          native: true,
          amount: BigInt(input1.quotient.toString()),
        })
      }

      return {
        from: address,
        to: contract.address,
        data: batchAction({
          actions: [
            approveMasterContractAction({
              signature: signature,
            }),
            deployNewPoolAction({
              assets: [input0.currency, input1.currency],
              factory: factory.address,
              feeTier: fee,
              twap: false,
            }),
            encodeFunctionData({
              ...contract,
              functionName: 'addLiquidity',
              args: [
                liquidityInput,
                poolAddress,
                BigInt(
                  pool
                    .getLiquidityMinted(
                      totalSupply,
                      input0.wrapped.toShare(totals?.[token0.wrapped.address]),
                      input1.wrapped.toShare(totals?.[token1.wrapped.address]),
                    )
                    .quotient.toString(),
                ),
                encoded,
              ],
            }),
          ],
        }),
        value: value ?? 0n,
      }
    } catch (e: unknown) {
      console.error(e)
    }
  }, [
    address,
    chain?.id,
    contract,
    factory,
    fee,
    input0,
    input1,
    pool,
    poolAddress,
    signature,
    token0,
    token1,
    totalSupply,
    totals,
  ])

  const { config, error } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: Boolean(approved && totals),
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
                <DialogTitle>Create pool</DialogTitle>
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
                  id="confirm-add-liquidity"
                  size="xl"
                  disabled={!isValid || isWritePending || !sendTransactionAsync}
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
        successMessage={"Successfully added liquidity"}
        buttonText="Go to pool"
        buttonLink={`/pools/${chainId}:${poolAddress}`}
        txHash={data?.hash}
      />
    </DialogProvider>
  )
}
