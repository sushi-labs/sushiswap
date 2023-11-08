import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Modal } from 'components/Modal/Modal'
import WalletSelector from '../WalletSelector'
import { usePoolState } from './PoolProvider'

interface Props {
  buttonError: string
  token1Value: string
}

export const AddLiquidityButton = ({ buttonError, token1Value }: Props) => {
  const { connected } = useWallet()
  const { isPriceFetching, amount0, amount1 } = usePoolState()
  return (
    <Modal.Trigger tag="add-liquidity">
      {({ open }) => (
        <div className="pt-4">
          {connected ? (
            <button
              type="button"
              className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold ${
                isPriceFetching ||
                buttonError ||
                Number(amount0) <= 0 ||
                Number(amount1) <= 0
                  ? 'pointer-events-none relative opacity-[0.4] overflow-hidden'
                  : ''
              }`}
              disabled={!!buttonError}
              onClick={() => {
                token1Value ? open() : {}
              }}
            >
              {buttonError ? (
                'Insufficient Balance'
              ) : Number(amount0) > 0 && Number(amount1) > 0 ? (
                <>Add Liquidity</>
              ) : (
                <>Enter Amount</>
              )}
            </button>
          ) : (
            <WalletSelector />
          )}
        </div>
      )}
    </Modal.Trigger>
  )
}
