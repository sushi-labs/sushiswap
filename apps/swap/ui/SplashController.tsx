import { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { SushiIcon } from '@sushiswap/ui'
import { Transition } from '@headlessui/react'
import { useSwapState } from './trade/TradeProvider'

export const SplashController: FC<{ children: ReactNode }> = ({ children }) => {
  const { token0, token1 } = useSwapState()
  const { isReady } = useRouter()

  return (
    <>
      {(!isReady || !token0 || !token1) && (
        <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-[1080] flex items-center justify-center">
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
