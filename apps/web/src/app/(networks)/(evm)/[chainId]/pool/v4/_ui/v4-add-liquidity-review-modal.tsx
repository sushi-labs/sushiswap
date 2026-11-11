'use client'

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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dots,
  FormattedNumber,
  List,
} from '@sushiswap/ui'
import { useQueryClient } from '@tanstack/react-query'
import { type ReactElement, type ReactNode, useCallback, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import { logger } from 'src/lib/logger'
import { getDisplayedRange } from 'src/lib/pool/cl'
import { onV4PositionFeesCollected } from 'src/lib/pool/v4'
import {
  DialogConfirm,
  DialogProvider,
  DialogReview,
} from 'src/lib/transaction-dialog'
import {
  getGasBalanceReserve,
  getSpendableNativeBalance,
} from 'src/lib/wagmi/components/web3-input/currency/native-balance-reserve'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import {
  type Permit2PermitBatchSignature,
  usePermit2PermitBatch,
} from 'src/lib/wagmi/hooks/approvals/hooks/use-permit2-permit-batch'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { type Amount, type Percent, formatPercent } from 'sushi'
import {
  type EvmCurrency,
  SUSHISWAP_V4_CL_POSITION_MANAGER,
  type SushiSwapV4ChainId,
  addSushiSwapV4LiquidityCallParameters,
  getEvmChainById,
} from 'sushi/evm'
import type { SendTransactionReturnType } from 'viem'
import {
  type UseCallParameters,
  useCall,
  useConnection,
  usePublicClient,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import type { V4DerivedMintInfo } from './use-v4-derived-mint-info'

interface V4AddLiquidityReviewModalProps {
  chainId: SushiSwapV4ChainId
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  inputA: Amount<EvmCurrency> | undefined
  inputB: Amount<EvmCurrency> | undefined
  derived: V4DerivedMintInfo
  /** The most of each currency the position may take, to permit. */
  maxAmounts: readonly Amount<EvmCurrency>[]
  deadline: bigint | undefined
  slippageTolerance: Percent
  /** Increases this position; mints a new one when unset. */
  tokenId?: bigint
  children: ReactNode
  onSuccess(): void
  successLink?: string
}

export function V4AddLiquidityReviewModal({
  chainId,
  currencyA,
  currencyB,
  inputA,
  inputB,
  derived: {
    position,
    noLiquidity,
    price,
    pricesAtTicks,
    ticksAtLimit,
    invertPrice,
  },
  maxAmounts,
  deadline,
  slippageTolerance,
  tokenId,
  children,
  onSuccess: _onSuccess,
  successLink,
}: V4AddLiquidityReviewModalProps): ReactElement {
  const { address, chain } = useConnection()
  const client = usePublicClient({ chainId })
  const trace = useTrace()
  const positionManager = SUSHISWAP_V4_CL_POSITION_MANAGER[chainId]

  const permit = usePermit2PermitBatch({
    chainId,
    owner: address,
    spender: positionManager,
    amounts: maxAmounts,
    deadline,
  })

  const native =
    position?.pool.currency0.type === 'native'
      ? position.pool.currency0
      : undefined
  const { data: nativeBalance } = useAmountBalance(native)

  // Builds the transaction, with the permit signed for it if one is needed
  const buildTransaction = useMemo(() => {
    if (!address || !position || !deadline || position.liquidity === 0n)
      return undefined
    if (native && !nativeBalance) return undefined

    return (permit2: Permit2PermitBatchSignature | undefined) => {
      const { calldata, value } = addSushiSwapV4LiquidityCallParameters({
        position,
        slippageTolerance,
        deadline,
        ...(tokenId === undefined
          ? { recipient: address, createPool: noLiquidity }
          : { tokenId }),
        ...(permit2 ? { permit2 } : {}),
      })

      // The maximum native in may exceed what can be spent after gas; send as
      // much as possible, but never less than the amount entered
      let nativeValue = value
      if (native && nativeBalance) {
        const spendable = getSpendableNativeBalance(
          nativeBalance.amount,
          getGasBalanceReserve(native),
        )
        const entered = position.mintAmounts.amount0
        nativeValue =
          value < spendable ? value : spendable > entered ? spendable : entered
      }

      return {
        to: positionManager,
        account: address,
        chainId,
        data: calldata,
        value: nativeValue,
      } as const satisfies UseCallParameters
    }
  }, [
    address,
    position,
    deadline,
    native,
    nativeBalance,
    slippageTolerance,
    tokenId,
    noLiquidity,
    positionManager,
    chainId,
  ])

  // Only a transaction without a permit can be simulated before signing
  const unsigned = useMemo(
    () =>
      permit.isPermitRequired === false
        ? buildTransaction?.(undefined)
        : undefined,
    [buildTransaction, permit.isPermitRequired],
  )
  const { isError: isSimulationError } = useCall({
    ...unsigned,
    query: { enabled: Boolean(unsigned && chainId === chain?.id) },
  })

  const { refetch: refetchPermit } = permit
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const queryClient = useQueryClient()

  const onSuccess = useCallback(
    (hash: SendTransactionReturnType) => {
      _onSuccess()
      if (!currencyA || !currencyB) return

      sendAnalyticsEvent(LiquidityEventName.ADD_LIQUIDITY_SUBMITTED, {
        chain_id: chainId,
        address,
        txHash: hash,
        source: LiquiditySource.V4,
        label: [currencyA.symbol, currencyB.symbol].join('/'),
        token0_address:
          currencyA.type === 'native' ? NativeAddress : currencyA.address,
        token0_amount: inputA?.amount,
        token1_address:
          currencyB.type === 'native' ? NativeAddress : currencyB.address,
        token1_amount: inputB?.amount,
        create_pool: noLiquidity,
        ...trace,
      })

      // Rejects if the transaction reverts or is replaced
      const receipt = waitForSuccessfulReceipt(client, hash)
      receipt.then(
        () => {
          refetchBalances(chainId)
          refetchPermit()
          if (tokenId !== undefined)
            onV4PositionFeesCollected(queryClient, { chainId, tokenId })
        },
        () => {},
      )

      const pair = `${currencyA.symbol}/${currencyB.symbol}`
      const ts = Date.now()
      void createToast({
        account: address,
        type: 'mint',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: noLiquidity
            ? `Creating the ${pair} pool`
            : `Adding liquidity to the ${pair} pool`,
          completed: noLiquidity
            ? `Created the ${pair} pool`
            : `Added liquidity to the ${pair} pool`,
          failed: noLiquidity
            ? 'Something went wrong when trying to create the pool'
            : 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [
      _onSuccess,
      currencyA,
      currencyB,
      chainId,
      address,
      inputA,
      inputB,
      noLiquidity,
      trace,
      client,
      refetchBalances,
      refetchPermit,
      queryClient,
      tokenId,
    ],
  )

  const onError = useCallback((e: Error) => {
    if (isUserRejectedError(e)) return
    logger.error(e, {
      location: 'V4AddLiquidityReviewModal',
      action: 'mutationError',
    })
    createErrorToast(e?.message, true)
  }, [])

  const {
    mutateAsync: sendTransactionAsync,
    isPending: isWritePending,
    data: hash,
  } = useSendTransaction({ mutation: { onSuccess, onError } })

  const { status } = useWaitForTransactionReceipt({ chainId, hash })

  // Prices are shown as currencyA in currencyB, as entered
  const {
    minPrice: leftPrice,
    maxPrice: rightPrice,
    minAtLimit: leftAtLimit,
    maxAtLimit: rightAtLimit,
  } = getDisplayedRange(pricesAtTicks, ticksAtLimit, invertPrice)
  const midPrice = invertPrice ? price?.invert() : price

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            {children}
            <DialogContent className="max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>
                  {currencyA?.symbol}/{currencyB?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {noLiquidity
                    ? 'Create pool and add liquidity'
                    : 'Add liquidity'}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-176px)]">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue flex title="Network">
                      {getEvmChainById(chainId).name}
                    </List.KeyValue>
                    {position ? (
                      <List.KeyValue flex title="Fee">
                        {position.pool.isDynamicFee
                          ? 'Dynamic'
                          : formatPercent(position.pool.fee / 1_000_000)}
                      </List.KeyValue>
                    ) : null}
                  </List.Control>
                </List>
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue
                      flex
                      title="Minimum Price"
                      subtitle={`Your position will be 100% ${currencyA?.symbol} at this price`}
                    >
                      {leftAtLimit ? (
                        '0'
                      ) : (
                        <FormattedNumber number={leftPrice?.toSignificant(6)} />
                      )}{' '}
                      {currencyB?.symbol}
                    </List.KeyValue>
                    <List.KeyValue
                      flex
                      title={noLiquidity ? 'Starting Price' : 'Market Price'}
                    >
                      <FormattedNumber number={midPrice?.toSignificant(6)} />{' '}
                      {currencyB?.symbol}
                    </List.KeyValue>
                    <List.KeyValue
                      flex
                      title="Maximum Price"
                      subtitle={`Your position will be 100% ${currencyB?.symbol} at this price`}
                    >
                      {rightAtLimit ? (
                        '∞'
                      ) : (
                        <FormattedNumber
                          number={rightPrice?.toSignificant(6)}
                        />
                      )}{' '}
                      {currencyB?.symbol}
                    </List.KeyValue>
                    <List.KeyValue flex title="Slippage">
                      {slippageTolerance.toPercentString()}
                    </List.KeyValue>
                  </List.Control>
                </List>
                <List className="!pt-0">
                  <List.Control>
                    {[inputA, inputB].map((input) =>
                      input ? (
                        <List.KeyValue
                          key={input.currency.id}
                          flex
                          title={input.currency.symbol}
                        >
                          <div className="flex items-center gap-2">
                            <Currency.Icon
                              currency={input.currency}
                              width={18}
                              height={18}
                            />
                            {input.toSignificant(6)} {input.currency.symbol}
                          </div>
                        </List.KeyValue>
                      ) : null,
                    )}
                  </List.Control>
                </List>
              </div>
              <DialogFooter>
                <Checker.Connect namespace="evm" fullWidth>
                  <Checker.Network fullWidth chainId={chainId}>
                    <Checker.Permit2
                      fullWidth
                      chainId={chainId}
                      spender={positionManager}
                      amounts={maxAmounts}
                      deadline={deadline}
                    >
                      <Button
                        size="xl"
                        fullWidth
                        loading={
                          !buildTransaction ||
                          permit.isSigning ||
                          isWritePending
                        }
                        disabled={isSimulationError}
                        onClick={async () => {
                          if (!buildTransaction) return
                          // Sending reports its own errors through onError
                          let transaction: ReturnType<typeof buildTransaction>
                          try {
                            transaction = buildTransaction(await permit.sign())
                          } catch (e) {
                            if (e instanceof Error) onError(e)
                            return
                          }
                          try {
                            await sendTransactionAsync(transaction)
                            confirm()
                          } catch {}
                        }}
                        testId="confirm-add-liquidity"
                        type="button"
                      >
                        {isSimulationError ? (
                          'Shoot! Something went wrong :('
                        ) : permit.isSigning || isWritePending ? (
                          <Dots>Confirm Add</Dots>
                        ) : noLiquidity ? (
                          'Create Pool'
                        ) : (
                          'Add Liquidity'
                        )}
                      </Button>
                    </Checker.Permit2>
                  </Checker.Network>
                </Checker.Connect>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="add-v4-liquidity-confirmation-modal"
        successMessage={`You successfully added liquidity to the ${currencyA?.symbol}/${currencyB?.symbol} pool`}
        txHash={hash}
        buttonLink={successLink}
        buttonText="View your position"
      />
    </DialogProvider>
  )
}
