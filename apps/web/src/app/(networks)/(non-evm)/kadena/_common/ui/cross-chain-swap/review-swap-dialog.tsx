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
import { useState } from 'react'
import { ChainId, formatPercent } from 'sushi'
import { WalletConnector } from '~kadena/_common/ui/WalletConnector/WalletConnector'
import { useDerivedStateCrossChainSwap } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'
import { ReviewSwapDialogTrigger } from './review-swap-dialog-trigger'
import { CrossChainSwapRouteView } from './route-view'
import { XChainSwapButton } from './xchain-swap-button'

export const ReviewSwapDialog = () => {
  const { state } = useDerivedStateCrossChainSwap()
  const [txHash, setTxHash] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending',
  )

  const isConnected = true
  const priceImpactPercentage = 0.01
  const severityClass = 'red'

  const executionDurationSeconds =
    state.simulateBridgeTx?.estimatedBridgeTimeInSeconds ?? 0
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
                  Receive{' '}
                  {state.simulateBridgeTx?.amountMinReceived?.toString()}{' '}
                  {state.token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  Swap {state.swapAmountString} {state.token0?.symbol}
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
                      <span
                        style={{ color: severityClass }}
                        className={classNames(
                          'text-right text-gray-700 dark:text-slate-400',
                        )}
                      >
                        -{formatPercent(priceImpactPercentage / 100)}
                      </span>
                    </List.KeyValue>
                    <List.KeyValue
                      title="Network fee"
                      subtitle="The transaction fee charged by the origin blockchain."
                    >
                      <>
                        {state.simulateBridgeTx?.networkFeeInToken ?? '0'}{' '}
                        {state.chainId0 === ChainId.KADENA ? 'KDA' : 'ETH'}
                      </>
                    </List.KeyValue>
                    <List.KeyValue
                      title="Est. received"
                      subtitle="The estimated output amount."
                    >
                      {state.simulateBridgeTx?.estimatedAmountReceived}
                    </List.KeyValue>
                    <List.KeyValue
                      title={`Min. received after slippage (${'0.5'}%)`}
                      subtitle="The minimum amount you are guaranteed to receive."
                    >
                      {state.simulateBridgeTx?.amountMinReceived}{' '}
                      {state.token1?.symbol}
                    </List.KeyValue>
                  </List.Control>
                </List>
              </div>
              <CrossChainSwapRouteView />
              <DialogFooter>
                <XChainSwapButton
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
        chainId={state.chainId0}
        status={status}
        testId="make-another-swap-kadena"
        buttonText="Make another swap"
        // @dev check if we can update dialog confirm to take in a string since it now supports kadena which is not a hex string
        // @ts-ignore
        txHash={txHash}
        successMessage={`You sold ${state.swapAmountString} ${
          state.token0?.symbol
        } for ${state.simulateBridgeTx?.amountMinReceived?.toString()} ${
          state.token1?.symbol
        }`}
      />
    </DialogProvider>
  )
}
