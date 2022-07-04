import { Transition } from '@headlessui/react'
import { LogoLoader } from '@sushiswap/ui'
import React, { FC, Fragment } from 'react'
import ReactDOM from 'react-dom'

export const LoadingOverlay: FC<{ show?: boolean }> = ({ show }) => {
  if (typeof window === undefined) return <></>

  return ReactDOM.createPortal(
    <Transition
      as={Fragment}
      show={show}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed z-[100] flex items-center justify-center inset-0 transition-opacity bg-white bg-opacity-5 backdrop-blur-sm rounded-xl overflow-hidden">
        <LogoLoader width={36} height={36} />
      </div>
    </Transition>,
    document.body
  )
}
