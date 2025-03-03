import React, { type FC, type ReactNode } from 'react'

import { SushiIcon } from '../icons/SushiIcon'

const Splash: FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-50 flex items-center justify-center">
      <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)]">
        <div className="w-[50px] h-[50px] animate-[bounce_.5s_linear_infinite_0.17s] absolute">
          <SushiIcon width={50} height={50} />
        </div>
        <div className="w-[50px] h-[5px] bg-black opacity-20 absolute top-[51px] left-0 rounded-[50%] animate-shadow" />
      </div>
    </div>
  )
}

const SplashController: FC<{ children: ReactNode; show?: boolean }> = ({
  children,
  show = false,
}) => {
  return <>{show ? <Splash /> : children}</>
}

export { Splash, SplashController }
