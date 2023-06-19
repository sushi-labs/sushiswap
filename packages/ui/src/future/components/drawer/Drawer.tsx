import { Transition } from '@headlessui/react'
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

import { ButtonComponent } from '../button'
import { XMarkIcon } from '@heroicons/react/20/solid'

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

export const DrawerButton: ButtonComponent = (props) => {
  const { setOpen } = useDrawer()

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      setOpen((prev) => !prev)
      props.onClick && props.onClick(e)
    },
    [props, setOpen]
  )

  return <div className="flex items-center" onClick={onClick} {...props} />
}

export const Panel: FC<PanelProps> = ({ children, className }) => {
  const { open, setOpen } = useDrawer()
  const isMounted = useIsMounted()

  if (!isMounted) return <></>

  return ReactDOM.createPortal(
    <Transition.Root appear show={open} unmount={false} as={Fragment}>
      <div className={classNames(className, 'fixed right-0 top-0 bottom-0 w-full translate-x-[100%] z-[1080] ')}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          unmount={false}
        >
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="translate-x-[-100%] absolute inset-0 bg-black/40 transition-opacity"
          />
        </Transition.Child>
        <Transition.Child
          className="overflow-y-auto scroll w-full sm:w-[380px] bg-gray-100 dark:bg-slate-900 top-0 bottom-0 absolute p-3 shadow-xl shadow-black/30"
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-0"
          enterTo="translate-x-[-100%]"
          leave="transform transition ease-in-out duration-500"
          leaveFrom="translate-x-[-100%]"
          leaveTo="translate-x-0"
          unmount={false}
        >
          <div className="relative">
            <button onClick={() => setOpen(false)} className="absolute right-0 top-0">
              <XMarkIcon width={26} height={26} className="text-gray-400 dark:text-slate-400" />
            </button>
            {children}
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>,
    document.body
  )
}

export const Drawer = { Root: DrawerRoot, Panel, Button: DrawerButton }
