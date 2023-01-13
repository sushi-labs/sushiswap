import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'
import { Dialog, Loader } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'

const OnramperWidget = dynamic(() => import('@onramper/widget'), { ssr: false, loading: () => <Loader size={32} /> })

interface OnramperProps {
  children({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const Onramper: FC<OnramperProps> = ({ children }) => {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)

  const wallets = {
    ETH: { address },
  }

  return (
    <>
      {children({ open, setOpen })}
      <Dialog open={open} unmount={false} onClose={setOpen}>
        <div className="flex items-center justify-center w-full h-[75vh] sm:w-[482px] sm:h-[660px] rounded-t-2xl sm:rounded-2xl overflow-hidden">
          <OnramperWidget
            API_KEY="pk_test_ass3gtLSWQpI11IWUZLJdrfyQhj7bTw_3xwLvhEvH6Q0"
            defaultAmount={200}
            defaultCrypto="ETH"
            fontFamily="InterVariable"
            color="#3b82f6"
            {...(address && { defaultAddrs: wallets })}
          />
        </div>
      </Dialog>
    </>
  )
}
