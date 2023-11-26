import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React, { useEffect, useState } from 'react'
import { useIsSwapMaintenance } from 'utils/use-is-swap-maintenance'
import WalletSelector from './WalletSelector'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { useSwapState } from 'app/swap/trade/TradeProvider'
import { useSwapRouter } from 'utils/useSwapRouter'
import { warningSeverity } from 'lib/swap/warningSeverity'
import { useTokenBalance } from 'utils/useTokenBalance'
import { Button } from '@sushiswap/ui/future/components/button'

export const SwapButton = () => {
  const { data: maintenance } = useIsSwapMaintenance()
  const { connected, account } = useWallet()
  const { amount, noRouteFound, error, token0 } = useSwapState()
  const [checked, setChecked] = useState<boolean>(false)
  const { data: balance } = useTokenBalance({
    account: account?.address as string,
    currency: token0?.address,
    refetchInterval: 2000,
  })
  const { data: routes } = useSwapRouter({ balance })
  useEffect(() => {
    if (warningSeverity(routes?.priceImpact) <= 3) {
      setChecked(false)
    }
  }, [routes])
  return (
    <Modal.Trigger tag="review-modal">
      {({ open }) => (
        <>
          <div className="pt-4">
            {connected ? (
              <Button
                fullWidth
                size="xl"
                disabled={
                  !!(
                    maintenance ||
                    noRouteFound ||
                    error ||
                    Number(amount) <= 0 ||
                    (!checked && warningSeverity(routes?.priceImpact) > 3)
                  )
                }
                onClick={() => {
                  amount ? open() : {}
                }}
                color={
                  warningSeverity(routes?.priceImpact) >= 3 ? 'red' : 'blue'
                }
              >
                {maintenance ? (
                  'Maintenance in progress'
                ) : !checked && warningSeverity(routes?.priceImpact) >= 3 ? (
                  <>Price impact too high</>
                ) : noRouteFound ? (
                  noRouteFound
                ) : error ? (
                  'Insufficient Balance'
                ) : Number(amount) > 0 ? (
                  <>Swap</>
                ) : (
                  <>Enter Amount</>
                )}
              </Button>
            ) : (
              <WalletSelector
                hideChevron
                color="blue"
                size="xl"
                fullWidth={true}
              />
            )}
          </div>
          {warningSeverity(routes?.priceImpact) > 3 && (
            <div className="flex items-start px-4 py-3 mt-4 rounded-xl bg-red/20">
              <input
                id="expert-checkbox"
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="cursor-pointer mr-1 w-5 h-5 mt-0.5 text-red-600 !ring-red-600 bg-white border-red rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
              />
              <label
                htmlFor="expert-checkbox"
                className="ml-2 font-medium text-red-600"
              >
                Price impact is too high. You will lose a big portion of your
                funds in this trade. Please tick the box if you would like to
                continue.
              </label>
            </div>
          )}
        </>
      )}
    </Modal.Trigger>
  )
}
