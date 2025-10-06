import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  DialogConfirm,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
} from '@sushiswap/ui'
import { List } from '@sushiswap/ui'
import { DialogContent, classNames } from '@sushiswap/ui'
import { useEffect, useRef, useState } from 'react'
import { Amount, ChainId, formatPercent } from 'sushi'
import { WalletConnector } from '~kadena/_common/ui/WalletConnector/WalletConnector'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { ReviewSwapDialogTrigger } from './review-swap-dialog-trigger'
import { CrossChainSwapRouteView } from './route-view'
import { KinesisSwapButton } from './swap-button'

export const ReviewSwapDialog = () => {
  const {
    state: { swapAmountString, chainId0, token1, simulateBridgeTx, token0 },
  } = useDerivedStateCrossChainSwap()
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending',
  )

  const amountInRef = useRef<Amount | null>(null)
  const amountOutRef = useRef<Amount | null>(null)

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

  const isConnected = true

  const executionDurationSeconds =
    simulateBridgeTx?.estimatedBridgeTimeInSeconds ?? 0
  const executionDurationMinutes = Math.floor(executionDurationSeconds / 60)

  const executionDuration =
    executionDurationSeconds < 60
      ? `${executionDurationSeconds} seconds`
      : `${executionDurationMinutes} minutes`

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div className="mt-4">
              {isConnected ? (
                <ReviewSwapDialogTrigger />
              ) : (
                <WalletConnector variant="default" fullWidth size="xl" />
              )}
            </div>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Receive {simulateBridgeTx?.amountMinReceived?.toString()}{' '}
                  {token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  Swap {swapAmountString} {token0?.symbol}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Estimated arrival">
                      {executionDuration}
                    </List.KeyValue>
                    <List.KeyValue
                      title="Price Impact"
                      subtitle="The impact your trade has on the market price of this pool."
                    >
                      <span className={classNames('text-right')}>
                        {formatPercent(0)}
                      </span>
                    </List.KeyValue>
                    <List.KeyValue
                      title="Network fee"
                      subtitle="The transaction fee charged by the origin blockchain."
                    >
                      <>
                        {simulateBridgeTx?.networkFeeInToken ?? '0'}{' '}
                        {chainId0 === ChainId.KADENA ? 'KDA' : 'ETH'}
                      </>
                    </List.KeyValue>
                    <List.KeyValue
                      title="Est. received"
                      subtitle="The estimated output amount."
                    >
                      {simulateBridgeTx?.estimatedAmountReceived}
                    </List.KeyValue>
                    <List.KeyValue
                      title={`Min. received after slippage (${formatPercent(slippage)})`}
                      subtitle="The minimum amount you are guaranteed to receive."
                    >
                      {simulateBridgeTx?.amountMinReceived} {token1?.symbol}
                    </List.KeyValue>
                  </List.Control>
                </List>
              </div>
              <CrossChainSwapRouteView />
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
