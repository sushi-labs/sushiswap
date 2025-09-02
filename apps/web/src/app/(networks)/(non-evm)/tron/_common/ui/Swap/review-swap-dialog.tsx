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
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { formatPercent } from 'sushi'
import { usePriceImpact } from '~tron/_common/lib/hooks/usePriceImpact'
import { useReserves } from '~tron/_common/lib/hooks/useReserves'
import { useRoutes } from '~tron/_common/lib/hooks/useRoutes'
import { useSwapNetworkFee } from '~tron/_common/lib/hooks/useSwapNetworkFee'
import { truncateText } from '~tron/_common/lib/utils/formatters'
import { getIfWrapOrUnwrap } from '~tron/_common/lib/utils/helpers'
import { getTronscanAddressLink } from '~tron/_common/lib/utils/tronscan-helpers'
import {
  warningSeverity,
  warningSeverityClassName,
} from '~tron/_common/lib/utils/warning-severity'
import { useSwapDispatch, useSwapState } from '~tron/swap/swap-provider'
import { WalletConnector } from '../WalletConnector/wallet-connector'
import { ReviewSwapDialogTrigger } from './review-swap-dialog-trigger'
import { SwapButton } from './swap-button'

export const ReviewSwapDialog = () => {
  const { token0, token1, amountIn, amountOut } = useSwapState()
  const { setRoute, setPriceImpactPercentage } = useSwapDispatch()
  const { address, connected } = useWallet()
  const isConnected = address && connected
  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.Swap,
  )
  const slippage =
    slippageTolerance === 'AUTO' ? 0.005 : Number(slippageTolerance) / 100

  const minOutput = useMemo(() => {
    if (!amountOut) return ''
    if (
      (token0?.symbol === 'WTRX' && token1?.address === 'TRON') ||
      (token0?.address === 'TRON' && token1?.symbol === 'WTRX')
    ) {
      return amountIn
    }

    const output = Number(amountOut) * (1 - slippage)
    return String(output)
  }, [amountOut, slippage, token0, token1, amountIn])

  const swapType = useMemo(() => {
    return getIfWrapOrUnwrap(token0, token1)
  }, [token0, token1])

  const { data: networkFeeInTrx } = useSwapNetworkFee({
    swapType: swapType,
    address,
    minOutput: minOutput?.toString() ?? '',
  })

  const { data: routeData, isLoading: isLoadingRoutes } = useRoutes({
    token0,
    token1,
  })
  //these reserves are always going to be defined if a pair exists
  const { data: reserves } = useReserves({
    pairAddress: routeData?.pairs?.[0],
    token0,
    token1,
  })

  //these reserves are for is the swap needs an intermediate pair
  const { data: reserves1 } = useReserves({
    pairAddress: routeData?.pairs?.[1],
    token0,
    token1,
  })

  //this number is always going to be defined if the reserves exists
  const { data: priceImpactPercentage0 } = usePriceImpact({
    amount: amountIn,
    token: token0,
    reserves,
  })

  //this number is for the price impact of the second pair in a hop is needed
  const { data: priceImpactPercentage1 } = usePriceImpact({
    amount: amountOut,
    token: token1,
    reserves: reserves1,
  })

  const _priceImpactPercentage =
    (priceImpactPercentage0 ?? 0) + (priceImpactPercentage1 ?? 0)
  const priceImpactPercentage =
    _priceImpactPercentage > 100 ? 100 : _priceImpactPercentage

  useEffect(() => {
    if (isLoadingRoutes) {
      setRoute([])
    }
    if (routeData && routeData.route.length > 0 && !isLoadingRoutes) {
      setRoute(routeData.route)
    }
  }, [routeData, isLoadingRoutes, setRoute])

  useEffect(() => {
    setPriceImpactPercentage(priceImpactPercentage ?? 0)
  }, [priceImpactPercentage, setPriceImpactPercentage])

  const severityClass = useMemo(() => {
    return warningSeverityClassName(warningSeverity(priceImpactPercentage))
  }, [priceImpactPercentage])

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
                  {swapType === 'wrap'
                    ? 'Wrap'
                    : swapType === 'unwrap'
                      ? 'Unwrap'
                      : 'Sell'}{' '}
                  {amountIn} {token0?.symbol}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <List className="!pt-0">
                  <List.Control>
                    <List.KeyValue title="Network">Tron</List.KeyValue>
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
                      <>{networkFeeInTrx ?? '0'} TRX</>
                    </List.KeyValue>
                  </List.Control>
                </List>
                {address && (
                  <List className="!pt-0">
                    <List.Control>
                      <List.KeyValue title="Recipient">
                        <Link
                          target="_blank"
                          href={getTronscanAddressLink(address)}
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
                <SwapButton closeModal={confirm} minOutput={minOutput} />
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
    </DialogProvider>
  )
}
