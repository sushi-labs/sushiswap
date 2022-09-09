import React, {
  createContext,
  Dispatch,
  FC,
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
import { classNames } from '../index'

interface DrawerContext {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  element: HTMLDivElement | null
}

const DrawerContext = createContext<DrawerContext | undefined>(undefined)

interface ProviderProps {
  children: ReactNode
}

export const Provider: FC<ProviderProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(true)
  const [, setRender] = useState(false)

  // Force render
  useEffect(() => {
    if (ref.current) setRender(true)
  }, [])

  return (
    <DrawerContext.Provider value={{ element: ref?.current, open, setOpen }}>
      <div className={open ? '2xl:w-[calc(100%-380px)] w-full' : 'w-full'}>{children}</div>
      <div
        className={classNames(
          open ? 'w-full md:w-[380px]' : 'w-0',
          'top-[54px] 2xl:top-0 fixed right-0 bottom-0 z-[1080] bg-slate-900 border-l border-slate-200/10 h-screen shadow-md lg:shadow-none shadow-black/30'
        )}
      >
        <div ref={ref} />
      </div>
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
  const { element } = useDrawer()
  if (!element) return <></>

  return ReactDOM.createPortal(
    <div className={classNames(className, 'flex flex-col gap-3 px-4 py-4 overflow-y-auto h-screen hide-scrollbar')}>
      {children}
    </div>,
    element
  )
}

export const Drawer = { Provider, Panel, Button: DrawerButton }
