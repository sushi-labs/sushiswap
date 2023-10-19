import {
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Currency } from '@sushiswap/ui/components/currency'
import { Dots } from '@sushiswap/ui/components/dots'
import { List } from '@sushiswap/ui/components/list/List'
import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import {
  FeeAmount,
  isSushiSwapV3ChainId,
  NonfungiblePositionManager,
  Position,
} from '@sushiswap/v3-sdk'
import {
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from '@sushiswap/wagmi'
import {
  SendTransactionResult,
  waitForTransaction,
} from '@sushiswap/wagmi/actions'
import { useTransactionDeadline } from '@sushiswap/wagmi/future/hooks'
import { getV3NonFungiblePositionManagerConractConfig } from '@sushiswap/wagmi/future/hooks/contracts/useV3NonFungiblePositionManager'
import { UsePrepareSendTransactionConfig } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Bound } from 'lib/constants'
import { useTokenAmountDollarValues } from 'lib/hooks'
import { useSlippageTolerance } from 'lib/hooks/useSlippageTolerance'
import React, { FC, ReactNode, useCallback, useMemo } from 'react'
import { Chain, ChainId } from 'sushi/chain'
import { Amount, tryParseAmount, Type } from 'sushi/currency'
import { Hex, UserRejectedRequestError } from 'viem'

import { useConcentratedDerivedMintInfo } from './ConcentratedLiquidityProvider'

interface AddSectionReviewModalConcentratedProps
  extends Pick<
    ReturnType<typeof useConcentratedDerivedMintInfo>,
    'noLiquidity' | 'position' | 'price' | 'pricesAtTicks' | 'ticksAtLimit'
  > {
  chainId: ChainId
  feeAmount: FeeAmount | undefined
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  existingPosition: Position | undefined
  tokenId: number | string | undefined
  children: ReactNode
  onSuccess: () => void
  successLink?: string
}

export const AddSectionReviewModalConcentrated: FC<
  AddSectionReviewModalConcentratedProps
> = ({
  chainId,
  feeAmount,
  token0,
  token1,
  input0,
  input1,
  children,
  noLiquidity,
  position,
  existingPosition,
  price,
  pricesAtTicks,
  ticksAtLimit,
  tokenId,
  onSuccess,
  successLink,
}) => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data: deadline } = useTransactionDeadline({ chainId })
  const [slippageTolerance] = useSlippageTolerance('addLiquidity')
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const isSorted =
    token0 && token1 && token0.wrapped.sortsBefore(token1.wrapped)
  const leftPrice = useMemo(
    () => (isSorted ? priceLower : priceUpper?.invert()),
    [isSorted, priceLower, priceUpper],
  )
  const rightPrice = useMemo(
    () => (isSorted ? priceUpper : priceLower?.invert()),
    [isSorted, priceLower, priceUpper],
  )
  const midPrice = useMemo(
    () => (isSorted ? price : price?.invert()),
    [isSorted, price],
  )
  const isFullRange = Boolean(
    ticksAtLimit[Bound.LOWER] && ticksAtLimit[Bound.UPPER],
  )

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!midPrice || !token0 || !token1 || !leftPrice || !rightPrice)
      return [0, 0]
    const min = +leftPrice?.toFixed(4)
    const cur = +midPrice?.toFixed(4)
    const max = +rightPrice?.toFixed(4)

    return [((min - cur) / cur) * 100, ((max - cur) / cur) * 100]
  }, [leftPrice, midPrice, rightPrice, token0, token1])

  const fiatAmounts = useMemo(
    () => [tryParseAmount('1', token0), tryParseAmount('1', token1)],
    [token0, token1],
  )
  const fiatAmountsAsNumber = useTokenAmountDollarValues({
    chainId,
    amounts: fiatAmounts,
  })

  const hasExistingPosition = !!existingPosition

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined, error: Error | null) => {
      if (error instanceof UserRejectedRequestError) {
        createErrorToast(error?.message, true)
      }
      if (!data || !token0 || !token1) return

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: noLiquidity
            ? `Creating the ${token0.symbol}/${token1.symbol} liquidity pool`
            : `Adding liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          completed: noLiquidity
            ? `Created the ${token0.symbol}/${token1.symbol} liquidity pool`
            : `Successfully added liquidity to the ${token0.symbol}/${token1.symbol} pair`,
          failed: noLiquidity
            ? 'Something went wrong when trying to create the pool'
            : 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [token0, token1, address, chainId, noLiquidity],
  )

  const prepare = useMemo<UsePrepareSendTransactionConfig>(() => {
    if (
      !chainId ||
      !address ||
      !token0 ||
      !token1 ||
      !isSushiSwapV3ChainId(chainId)
    )
      return {}

    if (position && deadline) {
      const useNative = token0.isNative
        ? token0
        : token1.isNative
        ? token1
        : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? NonfungiblePositionManager.addCallParameters(position, {
              tokenId,
              slippageTolerance,
              deadline: deadline.toString(),
              useNative,
            })
          : NonfungiblePositionManager.addCallParameters(position, {
              slippageTolerance,
              recipient: address,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity,
            })

      return {
        to: getV3NonFungiblePositionManagerConractConfig(chainId).address,
        data: calldata as Hex,
        value: BigInt(value),
      }
    }

    return {}
  }, [
    address,
    chainId,
    deadline,
    hasExistingPosition,
    noLiquidity,
    position,
    slippageTolerance,
    token0,
    token1,
    tokenId,
  ])

  const { config, isError } = usePrepareSendTransaction({
    ...prepare,
    chainId,
    enabled: chainId === chain?.id,
  })

  const {
    sendTransactionAsync,
    isLoading: isWritePending,
    data,
  } = useSendTransaction({
    ...config,
    chainId,
    onSettled,
    onSuccess,
  })

  const { status } = useWaitForTransaction({ chainId, hash: data?.hash })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {token0?.symbol}/{token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {' '}
                  {noLiquidity ? 'Create liquidity pool' : 'Add liquidity'}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue flex title="Network">
                      {Chain.from(chainId)?.name}
                    </List.KeyValue>
                    {feeAmount && (
                      <List.KeyValue title="Fee Tier">{`${
                        +feeAmount / 10000
                      }%`}</List.KeyValue>
                    )}
                  </List.Control>
                </List>
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue
                      flex
                      title={'Minimum Price'}
                      subtitle={`Your position will be 100% composed of ${input0?.currency.symbol} at this price`}
                    >
                      <div className="flex flex-col gap-1">
                        {isFullRange ? '0' : leftPrice?.toSignificant(6)}{' '}
                        {token1?.symbol}
                        {isFullRange ? (
                          ''
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                            $
                            {(
                              fiatAmountsAsNumber[0] *
                              (1 + +(minPriceDiff || 0) / 100)
                            ).toFixed(2)}{' '}
                            ({minPriceDiff.toFixed(2)}%)
                          </span>
                        )}
                      </div>
                    </List.KeyValue>
                    <List.KeyValue
                      flex
                      title={noLiquidity ? 'Starting Price' : 'Market Price'}
                      subtitle={
                        noLiquidity
                          ? `Starting price as determined by you`
                          : `Current price as determined by the ratio of the pool`
                      }
                    >
                      <div className="flex flex-col gap-1">
                        {midPrice?.toSignificant(6)} {token1?.symbol}
                        <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                          ${fiatAmountsAsNumber[0].toFixed(2)}
                        </span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue
                      flex
                      title={'Maximum Price'}
                      subtitle={`Your position will be 100% composed of ${token1?.symbol} at this price`}
                    >
                      <div className="flex flex-col gap-1">
                        {isFullRange ? '∞' : rightPrice?.toSignificant(6)}{' '}
                        {token1?.symbol}
                        {isFullRange ? (
                          ''
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                            $
                            {(
                              fiatAmountsAsNumber[0] *
                              (1 + +(maxPriceDiff || 0) / 100)
                            ).toFixed(2)}{' '}
                            ({maxPriceDiff.toFixed(2)}%)
                          </span>
                        )}{' '}
                      </div>
                    </List.KeyValue>{' '}
                    <List.KeyValue flex title="Slippage">
                      {slippageTolerance.toSignificant(2)}%
                    </List.KeyValue>
                  </List.Control>
                </List>
                <List className="!pt-0">
                  <List.Control>
                    {input0 && (
                      <List.KeyValue flex title={`${input0?.currency.symbol}`}>
                        <div className="flex items-center gap-2">
                          <Currency.Icon
                            currency={input0.currency}
                            width={18}
                            height={18}
                          />
                          {input0?.toSignificant(6)} {input0?.currency.symbol}
                        </div>
                      </List.KeyValue>
                    )}
                    {input1 && (
                      <List.KeyValue flex title={`${input1?.currency.symbol}`}>
                        <div className="flex items-center gap-2">
                          <Currency.Icon
                            currency={input1.currency}
                            width={18}
                            height={18}
                          />
                          {input1?.toSignificant(6)} {input1?.currency.symbol}
                        </div>
                      </List.KeyValue>
                    )}
                  </List.Control>
                </List>
              </div>
              <DialogFooter>
                <Button
                  size="xl"
                  fullWidth
                  loading={!sendTransactionAsync || isWritePending}
                  onClick={() => sendTransactionAsync?.().then(() => confirm())}
                  disabled={isError}
                  testId="confirm-add-liquidity"
                  type="button"
                >
                  {isError ? (
                    'Shoot! Something went wrong :('
                  ) : isWritePending ? (
                    <Dots>Confirm Add</Dots>
                  ) : (
                    'Add Liquidity'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="add-concentrated-liquidity-confirmation-modal"
        successMessage={`You successfully added liquidity to the ${token0?.symbol}/${token1?.symbol} pair`}
        txHash={data?.hash}
        buttonLink={successLink}
        buttonText="View your position"
      />
    </DialogProvider>
  )
}
