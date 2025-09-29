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
import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
import { formatPercent, truncateString } from 'sushi'
import { KvmChainId, getKvmChainByKey } from 'sushi/kvm'
import { GAS_PRICE } from '~kadena/_common/constants/gas'
import {
  warningSeverity,
  warningSeverityClassName,
} from '~kadena/_common/lib/utils/warning-severity'
import { WalletConnector } from '~kadena/_common/ui/WalletConnector/WalletConnector'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { useSwapState } from '../../..//swap/swap-provider'
import { ReviewSwapDialogTrigger } from './review-swap-dialog-trigger'
import { XChainSwapButton } from './swap-button'

export const ReviewSwapDialog = () => {
  // const {
  //   token0,
  //   token1,
  //   amountIn,
  //   amountOut,
  //   minAmountOut,
  //   gas,
  //   priceImpactPercentage,
  //   status,
  //   txHash,
  // } = useSwapState()
  // const { isConnected, activeAccount } = useKadena()
  // const address = activeAccount?.accountName ?? ''
  // const amountInRef = useRef(amountIn)
  // const amountOutRef = useRef(amountOut)

  // const [slippageTolerance] = useSlippageTolerance(
  //   SlippageToleranceStorageKey.Swap,
  // )

  // const severityClass = useMemo(() => {
  //   return warningSeverityClassName(warningSeverity(priceImpactPercentage))
  // }, [priceImpactPercentage])

  // useEffect(() => {
  //   if (amountIn && amountInRef) amountInRef.current = amountIn
  //   if (amountOut && amountOutRef) amountOutRef.current = amountOut
  // }, [amountIn, amountOut])

  // const networkFeeInKDA = (gas ?? 0) * GAS_PRICE

  const isConnected = true
  const amountOut = '100'
  const token1 = 'KDA'
  const amountIn = '100'
  const token0 = 'KDA'
  const priceImpactPercentage = 0.01
  const slippageTolerance = '0.01'
  const minAmountOut = '99'
  const severityClass = 'red'
  const networkFeeInKDA = 0.000001
  const address = '0x1234567890123456789012345678901234567890'
  const status = 'pending'
  const txHash = '0x1234567890123456789012345678901234567890'

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
                  Buy {amountOut?.toString()} {token1}
                </DialogTitle>
                <DialogDescription>
                  Swap {amountIn?.toString()} {token0}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Network">Kadena</List.KeyValue>
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
                      title={`Min. received after slippage (${'0.5'}%)`}
                      subtitle="The minimum amount you are guaranteed to receive."
                    >
                      {minAmountOut?.toString()} {token1}
                    </List.KeyValue>

                    <List.KeyValue title="Network fee">
                      <>{networkFeeInKDA.toFixed(6) ?? '0'} KDA</>
                    </List.KeyValue>
                  </List.Control>
                </List>
                {address && (
                  <List className="!pt-0">
                    <List.Control>
                      <List.KeyValue title="Recipient">
                        <Link
                          target="_blank"
                          href={getKvmChainByKey('kadena').getAccountUrl(
                            address,
                          )}
                          className={classNames(
                            'flex gap-2 items-center cursor-pointer text-blue hover:underline hover:text-blue-700',
                          )}
                          rel="noreferrer"
                        >
                          {truncateString(address, 10, 'middle')}
                        </Link>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                )}
              </div>
              <DialogFooter>
                {/* <SwapButton closeModal={confirm} /> */}
                <XChainSwapButton closeModal={() => {}} />
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={KvmChainId.KADENA}
        status={status}
        testId="make-another-swap-kadena"
        buttonText="Make another swap"
        txHash={txHash as `0x${string}` | undefined}
        successMessage={`You sold ${amountIn} ${
          token0
        } for ${amountOut} ${token1}`}
      />
    </DialogProvider>
  )
}
