import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
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
import { useEffect, useMemo } from 'react'
import { formatPercent } from 'sushi/format'
import { truncateText } from '~kadena/_common/lib/utils/formatters'
import { getChainwebAddressLink } from '~kadena/_common/lib/utils/kadena-helpers'
import {
  warningSeverity,
  warningSeverityClassName,
} from '~kadena/_common/lib/utils/warning-severity'
import { WalletConnector } from '~kadena/_common/ui/WalletConnector/WalletConnector'
import { useWalletState } from '~kadena/wallet-provider'
import { useSwapDispatch, useSwapState } from '../../..//swap/swap-provider'
import { ReviewSwapDialogTrigger } from './ReviewSwapDialogTrigger'
import { SwapButton } from './SwapButton'

export const ReviewSwapDialog = () => {
  const { token0, token1, amountIn, amountOut } = useSwapState()
  const { connected } = useWalletState()
  const { setRoute, setPriceImpactPercentage } = useSwapDispatch()
  const address =
    'abf594a764e49a90a98cddf30872d8497e37399684c1d8e2b8e96fd865728cc2'

  const isConnected = address && connected

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )

  const minOutput = '0.123'

  // @TODO: replace w hook
  const networkFeeInKDA = '0.123'

  const routeData = {
    pairs: ['pair1', 'pair2'],
    route: ['route1', 'route2'],
  }

  const [priceImpactPercentage0, priceImpactPercentage1] = [3, 6]

  const _priceImpactPercentage =
    (priceImpactPercentage0 ?? 0) + (priceImpactPercentage1 ?? 0)
  const priceImpactPercentage =
    _priceImpactPercentage > 100 ? 100 : _priceImpactPercentage

  useEffect(() => {
    setTimeout(() => {
      setRoute(routeData.route)
    }, 1000)
  }, [setRoute])

  useEffect(() => {
    setPriceImpactPercentage(priceImpactPercentage ?? 0)
  }, [priceImpactPercentage, setPriceImpactPercentage])

  const severityClass = useMemo(() => {
    return warningSeverityClassName(warningSeverity(priceImpactPercentage))
  }, [priceImpactPercentage])

  const swapType = 'Swap'

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
                  Buy {amountOut} {token1?.symbol}
                </DialogTitle>
                <DialogDescription>
                  {swapType}
                  {amountIn} {token0?.symbol}
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
                          'text-gray-700 text-right dark:text-slate-400',
                        )}
                      >
                        -{formatPercent(priceImpactPercentage / 100)}
                      </span>
                    </List.KeyValue>
                    <List.KeyValue
                      title={`Min. received after slippage (${
                        slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance
                      }%)`}
                      subtitle="The minimum amount you are guaranteed to receive."
                    >
                      {minOutput} {token1?.symbol}
                    </List.KeyValue>

                    <List.KeyValue title="Network fee">
                      <>{networkFeeInKDA ?? '0'} KDA</>
                    </List.KeyValue>
                  </List.Control>
                </List>
                {address && (
                  <List className="!pt-0">
                    <List.Control>
                      <List.KeyValue title="Recipient">
                        <Link
                          target="_blank"
                          href={getChainwebAddressLink(address)}
                          className={classNames(
                            'flex items-center gap-2 cursor-pointer text-blue hover:underline hover:text-blue-700',
                          )}
                          rel="noreferrer"
                        >
                          {truncateText(address)}
                        </Link>
                      </List.KeyValue>
                    </List.Control>
                  </List>
                )}
              </div>
              <DialogFooter>
                <SwapButton closeModal={confirm} />
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
    </DialogProvider>
  )
}
