'use client'

import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useIsMounted } from '@sushiswap/hooks'
import classNames from 'classnames'
import React, {
  createContext,
  Dispatch,
  FC,
  Fragment,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'

import { Button, ButtonProps } from '../button'
import { IconButton } from '../iconbutton'

interface DrawerContext {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  element: HTMLDivElement | null
}

const DrawerContext = createContext<DrawerContext | undefined>(undefined)

interface ProviderProps {
  children: (({ open, setOpen }: { open: boolean; setOpen(open: boolean): void }) => ReactNode) | ReactNode
}

export const DrawerRoot: FC<ProviderProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [, setRender] = useState(false)

  // Force render
  useEffect(() => {
    if (ref.current) setRender(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.parentElement?.classList.add('overflow-hidden')
    } else {
      document.body.parentElement?.classList.remove('overflow-hidden')
    }
  }, [open])

  return (
    <DrawerContext.Provider value={{ element: ref?.current, open, setOpen }}>
      {typeof children === 'function' ? children({ open, setOpen }) : children}
    </DrawerContext.Provider>
  )
}

export const useDrawer = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('Hook can only be used inside Drawer Context')
  }

  return context
}

interface PanelProps {
  children: ReactNode
  className?: string
}

export const DrawerButton = (props: ButtonProps) => {
  const { setOpen } = useDrawer()

  const onClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      setOpen((prev) => !prev)
      props.onClick && props.onClick(e)
    },
    [props, setOpen]
  )

  return <Button onClick={onClick} {...props} />
}

export const Panel: FC<PanelProps> = ({ children, className }) => {
  const { open, setOpen } = useDrawer()
  const isMounted = useIsMounted()

  if (!isMounted) return <></>

  return ReactDOM.createPortal(
    <Transition.Root appear show={open} unmount={false} as={Fragment}>
      <div className={classNames(className, 'fixed right-0 top-0 bottom-0 w-full translate-x-[100%] z-[1080] ')}>
        <Transition.Child
          className="overflow-y-auto scroll w-full sm:w-[380px] bg-gray-100 dark:bg-slate-900 top-4 bottom-4 -left-4 rounded-2xl absolute p-4 shadow-xl shadow-black/30"
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-0"
          enterTo="translate-x-[-100%]"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-x-[-100%]"
          leaveTo="translate-x-0"
          unmount={false}
        >
          <div className="relative">
            <div className="absolute right-2 top-2">
              <IconButton name="Close" icon={XMarkIcon} onClick={() => setOpen(false)} />
            </div>
            {children}
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>,
    document.body
  )
}

export const Drawer = { Root: DrawerRoot, Panel, Button: DrawerButton }
