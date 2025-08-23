import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  LiquidityEventName,
  LiquiditySource,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import {
  Button,
  Currency,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  Dots,
  FormattedNumber,
  IconButton,
  List,
  SettingsModule,
  SettingsOverlay,
} from '@sushiswap/ui'
import React, { type FC, type ReactNode, useCallback, useMemo } from 'react'
import { Bound } from 'src/lib/constants'
import { NativeAddress } from 'src/lib/constants'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import {
  getDefaultTTL,
  useTransactionDeadline,
} from 'src/lib/wagmi/hooks/utils/hooks/useTransactionDeadline'
import { Amount, formatPercent, formatUSD } from 'sushi'
import {
  type EvmChainId,
  type EvmCurrency,
  NonfungiblePositionManager,
  type Position,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3FeeAmount,
  getEvmChainById,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import {
  type Hex,
  type SendTransactionReturnType,
  UserRejectedRequestError,
} from 'viem'
import {
  type UseCallParameters,
  useAccount,
  useCall,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import type { useConcentratedDerivedMintInfo } from './ConcentratedLiquidityProvider'

interface AddSectionReviewModalConcentratedProps
  extends Pick<
    ReturnType<typeof useConcentratedDerivedMintInfo>,
    'noLiquidity' | 'position' | 'price' | 'pricesAtTicks' | 'ticksAtLimit'
  > {
  chainId: EvmChainId
  feeAmount: SushiSwapV3FeeAmount | undefined
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  input0: Amount<EvmCurrency> | undefined
  input1: Amount<EvmCurrency> | undefined
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
  onSuccess: _onSuccess,
  successLink,
}) => {
  const { address, chain } = useAccount()
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.AddLiquidity,
    chainId,
  })
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  const client = usePublicClient()

  const trace = useTrace()

  const isSorted = token0 && token1 && token0.wrap().sortsBefore(token1.wrap())
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
  const [isLeftAtLimit, isRightAtLimit] = useMemo(() => {
    return isSorted
      ? [ticksAtLimit[Bound.LOWER], ticksAtLimit[Bound.UPPER]]
      : [[ticksAtLimit[Bound.UPPER], ticksAtLimit[Bound.LOWER]]]
  }, [isSorted, ticksAtLimit])

  const [minPriceDiff, maxPriceDiff] = useMemo(() => {
    if (!midPrice || !token0 || !token1 || !leftPrice || !rightPrice)
      return [0, 0]
    const min = +leftPrice?.toString({ fixed: 4 })
    const cur = +midPrice?.toString({ fixed: 4 })
    const max = +rightPrice?.toString({ fixed: 4 })

    return [(min - cur) / cur, (max - cur) / cur]
  }, [leftPrice, midPrice, rightPrice, token0, token1])

  const fiatAmounts = useMemo(
    () =>
      token0 && token1
        ? [Amount.fromHuman(token0, '1'), Amount.fromHuman(token1, '1')]
        : [],
    [token0, token1],
  )
  const fiatAmountsAsNumber = useTokenAmountDollarValues({
    chainId,
    amounts: fiatAmounts,
  })

  const { refetchChain: refetchBalances } = useRefetchBalances()

  const hasExistingPosition = !!existingPosition

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      _onSuccess()

      if (!token0 || !token1) return

      sendAnalyticsEvent(LiquidityEventName.ADD_LIQUIDITY_SUBMITTED, {
        chain_id: chainId,
        address,
        txHash: hash,
        source: LiquiditySource.V3,
        label: [token0.symbol, token1.symbol].join('/'),
        token0_address:
          token0.type === 'native' ? NativeAddress : token0.address,
        token0_amount: input0?.amount,
        token1_address:
          token1.type === 'native' ? NativeAddress : token1.address,
        token1_amount: input1?.amount,
        create_pool: noLiquidity,
        ...trace,
      })

      const receipt = client.waitForTransactionReceipt({ hash })
      receipt.then(() => {
        refetchBalances(chainId)
      })

      const ts = new Date().getTime()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: hash,
        promise: receipt,
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
    [
      refetchBalances,
      _onSuccess,
      token0,
      token1,
      address,
      chainId,
      client,
      noLiquidity,
      trace,
      input0,
      input1,
    ],
  )

  const onError = useCallback((e: Error) => {
    if (!(e.cause instanceof UserRejectedRequestError)) {
      createErrorToast(e?.message, true)
    }
  }, [])

  const prepare = useMemo(() => {
    if (
      !chainId ||
      !address ||
      !token0 ||
      !token1 ||
      !isSushiSwapV3ChainId(chainId) ||
      !position ||
      !deadline
    )
      return undefined

    const useNative =
      token0.type === 'native'
        ? token0
        : token1.type === 'native'
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
      to: SUSHISWAP_V3_POSITION_MANAGER[chainId],
      account: address,
      chainId,
      data: calldata as Hex,
      value: BigInt(value),
    } as const satisfies UseCallParameters
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

  const { isError: isSimulationError } = useCall({
    ...(prepare as NonNullable<typeof prepare>),
    query: { enabled: Boolean(prepare && chainId === chain?.id) },
  })

  const {
    sendTransactionAsync,
    isPending: isWritePending,
    data,
  } = useSendTransaction({
    mutation: {
      onSuccess,
      onError,
    },
  })

  const send = useMemo(() => {
    if (!prepare || isSimulationError) return undefined

    return async (confirm: () => void) => {
      try {
        await sendTransactionAsync(prepare)

        confirm()
      } catch {}
    }
  }, [sendTransactionAsync, isSimulationError, prepare])

  const { status } = useWaitForTransactionReceipt({ chainId, hash: data })

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent>
              <div className="flex justify-between">
                <DialogHeader>
                  <DialogTitle>
                    {token0?.symbol}/{token1?.symbol}
                  </DialogTitle>
                  <DialogDescription>
                    {' '}
                    {noLiquidity ? 'Create liquidity pool' : 'Add liquidity'}
                  </DialogDescription>
                </DialogHeader>
                <SettingsOverlay
                  options={{
                    slippageTolerance: {
                      storageKey: SlippageToleranceStorageKey.AddLiquidity,
                      title: 'Add Liquidity Slippage',
                    },
                    transactionDeadline: {
                      storageKey: TTLStorageKey.AddLiquidity,
                      defaultValue: getDefaultTTL(chainId).toString(),
                    },
                  }}
                  modules={[
                    SettingsModule.SlippageTolerance,
                    SettingsModule.TransactionDeadline,
                  ]}
                >
                  <IconButton
                    name="Settings"
                    icon={Cog6ToothIcon}
                    variant="secondary"
                    className="mr-12"
                  />
                </SettingsOverlay>
              </div>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue flex title="Network">
                      {getEvmChainById(chainId).name}
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
                        <span>
                          {isLeftAtLimit ? (
                            '0'
                          ) : (
                            <FormattedNumber
                              number={leftPrice?.toSignificant(6)}
                            />
                          )}{' '}
                          {token1?.symbol}
                        </span>
                        {isLeftAtLimit ? (
                          ''
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                            {formatUSD(
                              fiatAmountsAsNumber[0] *
                                (1 + +(minPriceDiff || 0)),
                            )}{' '}
                            ({formatPercent(minPriceDiff)})
                          </span>
                        )}
                      </div>
                    </List.KeyValue>
                    <List.KeyValue
                      flex
                      title={noLiquidity ? 'Starting Price' : 'Market Price'}
                      subtitle={
                        noLiquidity
                          ? 'Starting price as determined by you'
                          : 'Current price as determined by the ratio of the pool'
                      }
                    >
                      <div className="flex flex-col gap-1">
                        <span>
                          <FormattedNumber
                            number={midPrice?.toSignificant(6)}
                          />{' '}
                          {token1?.symbol}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                          {formatUSD(fiatAmountsAsNumber[0])}
                        </span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue
                      flex
                      title={'Maximum Price'}
                      subtitle={`Your position will be 100% composed of ${token1?.symbol} at this price`}
                    >
                      <div className="flex flex-col gap-1">
                        <span>
                          {isRightAtLimit ? (
                            '∞'
                          ) : (
                            <FormattedNumber
                              number={rightPrice?.toSignificant(6)}
                            />
                          )}{' '}
                          {token1?.symbol}
                        </span>
                        {isRightAtLimit ? (
                          ''
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-slate-400 text-slate-600">
                            {formatUSD(
                              fiatAmountsAsNumber[0] *
                                (1 + +(maxPriceDiff || 0)),
                            )}{' '}
                            ({formatPercent(maxPriceDiff)})
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
                  loading={!send || isWritePending}
                  onClick={() => send?.(confirm)}
                  disabled={isSimulationError}
                  testId="confirm-add-liquidity"
                  type="button"
                >
                  {isSimulationError ? (
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
        txHash={data}
        buttonLink={successLink}
        buttonText="View your position"
      />
    </DialogProvider>
  )
}
