import {
  Button,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  Dots,
} from '@sushiswap/ui'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { FC, ReactNode, useCallback, useMemo } from 'react'

import {
  LiquidityInput,
  approveMasterContractAction,
  batchAction,
  deployNewPoolAction,
} from 'src/lib/pool/trident'

import { APPROVE_TAG_CREATE_TRIDENT } from 'src/lib/constants'
import {
  TridentConstantPool,
  TridentStablePool,
  computeTridentConstantPoolAddress,
  computeTridentStablePoolAddress,
} from 'sushi'
import { ChainId } from 'sushi/chain'
import {
  BentoBoxChainId,
  TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS,
  TRIDENT_ROUTER_ADDRESS,
  TRIDENT_STABLE_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from 'sushi/config'
import { Amount, Type } from 'sushi/currency'
import { Fee } from 'sushi/dex'
import {
  Address,
  SendTransactionReturnType,
  UserRejectedRequestError,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
  zeroAddress,
} from 'viem'

import { useBentoBoxTotals } from 'src/lib/wagmi/hooks/bentobox/hooks/useBentoBoxTotals'
import {
  useApproved,
  useApprovedActions,
  useSignature,
} from 'src/lib/wagmi/systems/Checker/Provider'
import { PoolFinderType } from 'src/lib/wagmi/systems/PoolFinder/types'
import { tridentRouterAbi } from 'sushi/abi'
import {
  UseCallParameters,
  useAccount,
  useCall,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { AddSectionReviewModal } from './AddSectionReviewModal'

interface CreateSectionReviewModalTridentProps {
  chainId: TridentChainId
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
  const client = usePublicClient()
  const { address, chain } = useAccount()
  const { signature } = useSignature(APPROVE_TAG_CREATE_TRIDENT)
  const { setSignature } = useApprovedActions(APPROVE_TAG_CREATE_TRIDENT)
  const { approved } = useApproved(APPROVE_TAG_CREATE_TRIDENT)
  const contractAddress = TRIDENT_ROUTER_ADDRESS[chainId]
  const constantProductPoolFactory =
    TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS[chainId]
  const stablePoolFactory = TRIDENT_STABLE_POOL_FACTORY_ADDRESS[chainId]

  const { data: totals } = useBentoBoxTotals({
    chainId,
    currencies: useMemo(() => [token0, token1], [token0, token1]),
  })

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
          factoryAddress: factory,
          tokenA: token0.wrapped,
          tokenB: token1.wrapped,
          fee: fee,
          twap: false,
        }) as Address
      case PoolFinderType.Stable:
        return computeTridentStablePoolAddress({
          factoryAddress: factory,
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
        contractAddress &&
        totals?.[token0.wrapped.address] &&
        totals?.[token1.wrapped.address],
    )
  }, [
    chain?.id,
    contractAddress,
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

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      setSignature(undefined)

      if (!chain?.id || !token0 || !token1) return

      const ts = new Date().getTime()
      createToast({
        account: address,
        type: 'mint',
        chainId: chain.id,
        txHash: hash,
        promise: client.waitForTransactionReceipt({ hash }),
        summary: {
          pending: `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [client, chain, token0, token1, address, setSignature],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof UserRejectedRequestError) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const prepare = useMemo(() => {
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
        !contractAddress ||
        !totals?.[token0.wrapped.address] ||
        !totals?.[token1.wrapped.address] ||
        !address
      ) {
        return undefined
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
        account: address,
        to: contractAddress,
        value: value ?? 0n,
        data: batchAction({
          actions: [
            approveMasterContractAction({
              signature: signature,
            }),
            deployNewPoolAction({
              assets: [input0.currency, input1.currency],
              factory: factory,
              feeTier: fee,
              twap: false,
            }),
            encodeFunctionData({
              abi: tridentRouterAbi,
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
      } satisfies UseCallParameters
    } catch (e: unknown) {
      console.error(e)
    }
  }, [
    address,
    chain?.id,
    contractAddress,
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

  const { isError: isSimulationError } = useCall({
    ...prepare,
    query: {
      enabled: Boolean(approved && totals),
    },
  })

  const {
    sendTransactionAsync,
    isLoading: isWritePending,
    data: hash,
  } = useSendTransaction({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const send = useMemo(() => {
    if (!prepare || isSimulationError) return

    return async (confirm: () => void) => {
      try {
        await sendTransactionAsync(prepare)

        confirm()
      } catch {}
    }
  }, [isSimulationError, prepare, sendTransactionAsync])

  const { status } = useWaitForTransactionReceipt({ chainId, hash })

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
                  disabled={
                    !isValid || isWritePending || !send || isSimulationError
                  }
                  fullWidth
                  onClick={() => send?.(confirm)}
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
        successMessage={'Successfully added liquidity'}
        buttonText="Go to pool"
        buttonLink={`/pools/${chainId}:${poolAddress}`}
        txHash={hash}
      />
    </DialogProvider>
  )
}
