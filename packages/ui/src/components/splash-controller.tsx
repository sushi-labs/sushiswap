import React, { FC, ReactNode } from 'react'

import { SushiIcon } from './icons'

const Splash: FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-[1080] flex items-center justify-center">
      <div className="absolute top-[calc(50%-20px)] left-[calc(50%-20px)]">
        <div className="rotate-45">
          <div className="w-[50px] h-[50px] animate-walk absolute top-[-15px] left-[15px]  overflow-hidden">
            <SushiIcon width={50} height={50} className="rotate-[-45deg]" />
          </div>
        </div>
        <div className="w-[50px] h-[5px] bg-black opacity-20 absolute top-[80px] left-0 rounded-[50%] animate-shadow" />
      </div>
    </div>
  )
}

const SplashController: FC<{ children: ReactNode; show?: boolean }> = ({ children, show = false }) => {
  return <>{show ? <Splash /> : children}</>
}

export { Splash, SplashController }
