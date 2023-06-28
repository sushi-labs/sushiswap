import { Transition } from '@headlessui/react'
import React, { FC, ReactNode, useCallback, useRef } from 'react'
import { usePopoverContext } from './PopoverProvider'
import ReactDOM from 'react-dom'
import { useIsMounted } from '@sushiswap/hooks'

export interface PopoverPanelInterface {
  children: ReactNode
}

export const PopoverPanel: FC<PopoverPanelInterface> = ({ children }) => {
  const { open, styles, attributes, setPopperElement, setHovers } = usePopoverContext()
  const timeoutId = useRef<NodeJS.Timeout>()
  const isMounted = useIsMounted()

  const handlePanelEnter = useCallback(() => {
    timeoutId.current = setTimeout(() => setHovers((prevState) => ({ ...prevState, button: true })), 200)
  }, [setHovers])

  const handlePanelLeave = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    setTimeout(() => setHovers((prevState) => ({ ...prevState, button: false })), 200)
  }, [setHovers])

  if (typeof window === 'undefined' || !isMounted || !open) return <></>

  return ReactDOM.createPortal(
    <div
      className="z-[100]"
      onMouseLeave={handlePanelLeave}
      onMouseEnter={handlePanelEnter}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <Transition
        show={true}
        appear
        enter="transition duration-300 ease-out"
        enterFrom="transform translate-y-[-16px]"
        enterTo="transform translate-y-0"
        leave="transition duration-300 ease-out"
        leaveFrom="transform translate-y-0 opacity-100"
        leaveTo="transform translate-y-[-16px] opacity-0"
      >
        <div className="py-2">
          <div className="relative p-2 flex flex-col w-full rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white/50 dark:bg-slate-800/50 paper">
            {children}
          </div>
        </div>
      </Transition>
    </div>,
    document.body
  )
}
