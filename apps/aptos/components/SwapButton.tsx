import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React, { useEffect, useState } from 'react'
import WalletSelector from './WalletSelector'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { useSwapState } from 'app/swap/trade/TradeProvider'
import { useSwapRouter } from 'utils/useSwapRouter'
import { warningSeverity } from 'lib/swap/warningSeverity'
import { useTokenBalance } from 'utils/useTokenBalance'

export const SwapButton = () => {
  const { connected, account } = useWallet()
  const { amount, isPriceFetching, noRouteFound, error, token0 } = useSwapState()
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
  console.log(!checked && warningSeverity(routes?.priceImpact) > 3)
  return (
    <Modal.Trigger tag="review-modal">
      {({ open }) => (
        <>
          <div className="pt-4">
            {connected ? (
              <button
                className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ${
                  noRouteFound ||
                  error ||
                  isPriceFetching ||
                  Number(amount) <= 0 ||
                  (!checked && warningSeverity(routes?.priceImpact) > 3)
                    ? 'pointer-events-none relative opacity-[0.4] overflow-hidden'
                    : ''
                }`}
                disabled={
                  noRouteFound || error || Number(amount) <= 0 || (!checked && warningSeverity(routes?.priceImpact) > 3)
                    ? true
                    : false
                }
                onClick={() => {
                  amount ? open() : {}
                }}
              >
                {!checked && warningSeverity(routes?.priceImpact) >= 3 ? (
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
              </button>
            ) : (
              <WalletSelector hideChevron color="blue" size="xl" fullWidth={true} />
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
              <label htmlFor="expert-checkbox" className="ml-2 font-medium text-red-600">
                Price impact is too high. You will lose a big portion of your funds in this trade. Please tick the box
                if you would like to continue.
              </label>
            </div>
          )}
        </>
      )}
    </Modal.Trigger>
  )
}
