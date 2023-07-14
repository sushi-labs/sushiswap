import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import WalletSelector from '../../../components/WalletSelector'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

interface Props {
  buttonError: string
  token1Value: string
}

export const AddLiquidityButton = ({ buttonError, token1Value }: Props) => {
  const { connected } = useWallet()
  return (
    <Modal.Trigger tag="add-liquidity">
      {({ open }) => (
        <div className="pt-4">
          {connected ? (
            <button
              className={`btn w-full flex items-center justify-center gap-2 cursor-pointer transition-all bg-blue hover:bg-blue-600 active:bg-blue-700 text-white px-6 h-[52px] rounded-xl text-base font-semibold`}
              disabled={buttonError ? true : false}
              onClick={() => {
                token1Value ? open() : {}
              }}
            >
              {buttonError ? buttonError : token1Value ? <>Add Liquidity</> : <>Enter Amount</>}
            </button>
          ) : (
            <WalletSelector hideChevron color="blue" size="xl" fullWidth={true} />
          )}
        </div>
      )}
    </Modal.Trigger>
  )
}
