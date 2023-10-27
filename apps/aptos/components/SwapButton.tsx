import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React from 'react'
import WalletSelector from './WalletSelector'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { useSwapState } from 'app/swap/trade/TradeProvider'

export const SwapButton = () => {
  const { connected } = useWallet()
  const { amount, isPriceFetching, noRouteFound, error } = useSwapState()
  return (
    <Modal.Trigger tag="review-modal">
      {({ open }) => (
        <div className="pt-4">
          {connected ? (
            <button
              className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ${
                noRouteFound || error || isPriceFetching || Number(amount) <= 0
                  ? 'pointer-events-none relative opacity-[0.4] overflow-hidden'
                  : ''
              }`}
              disabled={noRouteFound || error || Number(amount) <= 0 ? true : false}
              onClick={() => {
                amount ? open() : {}
              }}
            >
              {noRouteFound ? (
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
      )}
    </Modal.Trigger>
  )
}
