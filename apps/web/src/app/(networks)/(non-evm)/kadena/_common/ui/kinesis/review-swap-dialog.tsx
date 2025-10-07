import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  Button,
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  SelectIcon,
} from '@sushiswap/ui'
import { List } from '@sushiswap/ui'
import { DialogContent, classNames } from '@sushiswap/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Amount,
  ChainId,
  formatPercent,
  formatUSD,
  truncateString,
} from 'sushi'
import {
  EvmChainId,
  EvmNative,
  type EvmToken,
  WETH9_ADDRESS,
  getEvmChainById,
  isEvmChainId,
} from 'sushi/evm'
import { type KvmToken, getKvmChainById, isKvmChainId } from 'sushi/kvm'
import { isAddress } from 'viem'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import {
  KADENA,
  KINESIS_BRIDGE_EVM_ETH,
} from '~kadena/_common/constants/token-list'
import { useKinesisWrappedToken } from '~kadena/_common/lib/hooks/kinesis-swap/use-kinesis-wrapped-token'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { ReviewSwapDialogTrigger } from './review-swap-dialog-trigger'
import { CrossChainSwapRouteView } from './route-view'
import { KinesisSwapButton } from './swap-button'

export const ReviewSwapDialog = () => {
  const {
    state: {
      swapAmountString,
      chainId0,
      chainId1,
      token1,
      simulateBridgeTx,
      token0,
      recipient,
    },
  } = useDerivedStateCrossChainSwap()
  const [showMore, setShowMore] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending',
  )
  const amountInRef = useRef<Amount | null>(null)
  const amountOutRef = useRef<Amount | null>(null)

  const isEvm = isEvmChainId(chainId0)
  const evmChainId = isEvm ? (token0?.chainId as EvmChainId) : undefined
  const evmAddress = isEvm ? (token0?.address as `0x${string}`) : undefined

  const { data: wrappedToken, isLoading: isLoadingWrappedToken } =
    useKinesisWrappedToken({
      token: token0 as EvmToken | undefined,
      enabled: Boolean(token0 && isEvm),
    })

  const tokenToGetPriceFor = useMemo(() => {
    if (
      evmAddress?.toLowerCase() === KINESIS_BRIDGE_EVM_ETH.address.toLowerCase()
    ) {
      return WETH9_ADDRESS[EvmChainId.ETHEREUM]
    }
    return wrappedToken ? wrappedToken : evmAddress
  }, [wrappedToken, evmAddress])

  const evmPrice = usePrice({
    chainId: evmChainId,
    address: tokenToGetPriceFor,
    enabled: Boolean(
      evmChainId && !isLoadingWrappedToken && tokenToGetPriceFor,
    ),
  })
  const isKvm = isKvmChainId(chainId0)

  const kadenaPrice = useTokenPrice({
    token: token0 as KvmToken | undefined,
    enabled: Boolean(isKvm && token0),
  })

  const priceUsd = useMemo(() => {
    return chainId0 && isEvmChainId(chainId0) ? evmPrice.data : kadenaPrice.data
  }, [chainId0, evmPrice, kadenaPrice])

  useEffect(() => {
    if (swapAmountString && token0) {
      amountInRef.current = Amount.fromHuman(token0, swapAmountString)
    }
    if (simulateBridgeTx?.estimatedAmountReceived && token1) {
      amountOutRef.current = Amount.fromHuman(
        token1,
        simulateBridgeTx.estimatedAmountReceived,
      )
    }
  }, [
    swapAmountString,
    simulateBridgeTx?.estimatedAmountReceived,
    token0,
    token1,
  ])

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )
  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100

  const executionDurationSeconds =
    simulateBridgeTx?.estimatedBridgeTimeInSeconds ?? 0
  const executionDurationMinutes = Math.floor(executionDurationSeconds / 60)

  const executionDuration =
    executionDurationSeconds < 60
      ? `${executionDurationSeconds} seconds`
      : `${executionDurationMinutes} minutes`

  const amountIn = useMemo(() => {
    if (token0) {
      return Amount.tryFromHuman(token0, swapAmountString)
    }
  }, [swapAmountString, token0])

  const amountOut = useMemo(() => {
    const stringAmount = simulateBridgeTx?.estimatedAmountReceived ?? ''
    if (token1) {
      return Amount.tryFromHuman(token1, stringAmount)
    }
  }, [simulateBridgeTx, token1])

  const minAmountOut = useMemo(() => {
    const stringAmount = simulateBridgeTx?.amountMinReceived ?? ''
    if (token1) {
      return Amount.tryFromHuman(token1, stringAmount)
    }
  }, [simulateBridgeTx, token1])

  const feeInToken = useMemo(() => {
    if (simulateBridgeTx?.networkFeeInToken && chainId0 === ChainId.ETHEREUM) {
      return Amount.tryFromHuman(
        EvmNative.fromChainId(ChainId.ETHEREUM),
        simulateBridgeTx?.networkFeeInToken,
      )
    }
    if (simulateBridgeTx?.networkFeeInToken && chainId0 === ChainId.KADENA) {
      return Amount.tryFromHuman(KADENA, simulateBridgeTx?.networkFeeInToken)
    }
  }, [simulateBridgeTx, chainId0])

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="mt-4">
              <ReviewSwapDialogTrigger />
            </div>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Receive {amountOut?.toSignificant(6)}{' '}
                  {amountOut?.currency?.symbol}
                </DialogTitle>
                <DialogDescription>
                  Swap {amountIn?.toSignificant(6)} {amountIn?.currency?.symbol}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Estimated arrival">
                      {executionDuration}
                    </List.KeyValue>
                    {showMore ? (
                      <List.KeyValue
                        title="Price Impact"
                        subtitle="The impact your trade has on the market price of this pool."
                      >
                        <span className={classNames('text-right')}>
                          {formatPercent(0)}
                        </span>
                      </List.KeyValue>
                    ) : null}
                    <List.KeyValue
                      title="Network fee"
                      subtitle="The transaction fee charged by the origin blockchain."
                    >
                      <div className="flex flex-col gap-0.5">
                        <div>
                          {feeInToken?.toSignificant(6) ?? '0'}{' '}
                          {feeInToken?.currency.symbol}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatUSD(simulateBridgeTx?.networkFeeInUsd ?? 0)}
                        </span>
                      </div>
                    </List.KeyValue>
                    <List.KeyValue
                      title="Est. received"
                      subtitle="The estimated output amount."
                    >
                      <div className="flex flex-col gap-0.5">
                        <div>
                          {amountOut?.toSignificant(6) ?? '0'}{' '}
                          {amountOut?.currency.symbol}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatUSD(
                            amountOut?.mulHuman(priceUsd ?? 0)?.toString() ??
                              '0',
                          )}
                        </span>
                      </div>
                    </List.KeyValue>
                    {showMore ? (
                      <List.KeyValue
                        title={`Min. received after slippage (${formatPercent(slippage)})`}
                        subtitle="The minimum amount you are guaranteed to receive."
                      >
                        <div className="flex flex-col gap-0.5">
                          <div>
                            {minAmountOut?.toSignificant(6) ?? '0'}{' '}
                            {minAmountOut?.currency.symbol}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatUSD(
                              minAmountOut
                                ?.mulHuman(priceUsd ?? 0)
                                ?.toString() ?? '0',
                            )}
                          </span>
                        </div>
                      </List.KeyValue>
                    ) : null}

                    <div className="p-3">
                      <Button
                        size="xs"
                        fullWidth
                        onClick={() => setShowMore(!showMore)}
                        variant="ghost"
                      >
                        {showMore ? (
                          <>
                            <SelectIcon className="rotate-180" />
                          </>
                        ) : (
                          <>
                            <SelectIcon />
                          </>
                        )}
                      </Button>
                    </div>
                  </List.Control>
                </List>
              </div>
              <CrossChainSwapRouteView />
              {recipient && (
                <List className="!pt-2">
                  <List.Control>
                    <List.KeyValue title="Recipient">
                      <a
                        target="_blank"
                        href={
                          chainId1 === ChainId.ETHEREUM && isAddress(recipient)
                            ? getEvmChainById(chainId1).getAccountUrl(recipient)
                            : chainId1 === ChainId.KADENA
                              ? getKvmChainById(chainId1).getAccountUrl(
                                  recipient,
                                )
                              : ''
                        }
                        className="flex items-center gap-2 cursor-pointer text-blue"
                        rel="noreferrer"
                      >
                        {truncateString(recipient, 10, 'middle')}
                      </a>
                    </List.KeyValue>
                  </List.Control>
                </List>
              )}
              <DialogFooter>
                <KinesisSwapButton
                  closeModal={confirm}
                  setTxHash={setTxHash}
                  setStatus={setStatus}
                />
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId0}
        status={status}
        testId="make-another-swap-kadena"
        buttonText="Make another swap"
        txHash={txHash as `0x${string}`}
        successMessage={`You sold ${amountInRef.current?.toSignificant(6)} ${
          amountInRef.current?.currency?.symbol
        } for ${amountOutRef.current?.toSignificant(6)} ${amountOutRef.current?.currency?.symbol}`}
      />
    </DialogProvider>
  )
}
