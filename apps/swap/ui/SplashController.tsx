import { FC, ReactNode, useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'
import { useRouter } from 'next/router'
import { SushiIcon } from '@sushiswap/ui'
import { Transition } from '@headlessui/react'
import { usePrevious } from '@sushiswap/hooks'
import { useAutoConnect } from '@sushiswap/wagmi'
import { useSwapActions } from './trade/TradeProvider'
import { currencyFromShortCurrencyName, Native } from '@sushiswap/currency'

export const SplashController: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAutoConnecting } = useAutoConnect()
  const { chain } = useNetwork()
  const { isReady } = useRouter()
  const { setTokens } = useSwapActions()
  const [open, setOpen] = useState(true)
  const isPrevConnecting = usePrevious(isAutoConnecting)

  useEffect(() => {
    if (isPrevConnecting && !isAutoConnecting && isReady) setOpen(false)
  }, [chain?.id, isAutoConnecting, isPrevConnecting, isReady])

  useEffect(() => {
    if (chain?.id) {
      setTokens(Native.onChain(chain.id), currencyFromShortCurrencyName(chain.id, 'SUSHI' as never))
      setOpen(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain?.id])

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900 z-[1080] flex items-center justify-center">
          <Transition
            appear
            show={true}
            enter="ease-in-out duration-[1000ms]"
            enterFrom="scale-1 saturate-0"
            enterTo="scale-[0.75] saturate-100"
            leave="ease-in-out duration-[1000ms]"
            leaveFrom="scale-[0.75]"
            leaveTo="scale-1"
          >
            <SushiIcon width={112} height={112} />
          </Transition>
        </div>
      )}
      {children}
    </>
  )
}
