import { useWallet } from '@aptos-labs/wallet-adapter-react'
import React from 'react'
import WalletSelector from './WalletSelector'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'

interface Props {
  noRouteFound: string
  buttonError: string
  token1Value: number
}

export const SwapButton = ({ noRouteFound, buttonError, token1Value }: Props) => {
  const { connected } = useWallet()
  return (
    <Modal.Trigger tag="review-modal">
      {({ open, isOpen, close }) => (
        <div className="pt-4">
          {connected ? (
            <button
              className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ${
                noRouteFound || buttonError ? 'pointer-events-none relative opacity-[0.4] overflow-hidden' : ''
              }`}
              disabled={noRouteFound || buttonError ? true : false}
              onClick={() => {
                token1Value ? open() : {}
              }}
            >
              {noRouteFound ? noRouteFound : buttonError ? buttonError : token1Value ? <>Swap</> : <>Enter Amount</>}
            </button>
          ) : (
            // <button className="btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ">
            <WalletSelector hideChevron color="blue" size="xl" fullWidth={true} />
            // </button>
          )}
        </div>
      )}
    </Modal.Trigger>
  )
}
