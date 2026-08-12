'use client'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { Slot } from '@radix-ui/react-slot'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { InterfaceEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import classNames from 'classnames'
import Link from 'next/link'
import { ChainId } from 'sushi'
import { Dialog, DialogOverlay, DialogPrimitive } from './dialog'
import { IconButton } from './iconbutton'

const ONRAMP_OVERRIDE_CHAIN_IDS = [ChainId.SKALE_EUROPA] as const

const ONRAMP_OVERRIDE = {
  [ChainId.SKALE_EUROPA]: 'https://portal.skale.space/onramp',
} as const

type OnrampOverrideChainId = (typeof ONRAMP_OVERRIDE_CHAIN_IDS)[number]

export const isOnrampOverrideChainId = (
  chainId: number | undefined,
): chainId is OnrampOverrideChainId =>
  ONRAMP_OVERRIDE_CHAIN_IDS.includes(chainId as OnrampOverrideChainId)

export const OnramperButton: FC<{
  children: ReactNode
  className?: string
  chainId?: number
}> = ({ children, className, chainId }) => {
  const { setOpen } = useOnramperContext()

  const onClick = useCallback(() => {
    sendAnalyticsEvent(InterfaceEventName.FIAT_ONRAMP_WIDGET_OPENED)
    setOpen(true)
  }, [setOpen])

  return isOnrampOverrideChainId(chainId) ? (
    <Link
      href={ONRAMP_OVERRIDE[chainId]}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Slot className={className}>{children}</Slot>
    </Link>
  ) : (
    <Slot onClick={onClick} className={className}>
      {children}
    </Slot>
  )
}

type OnramperNamespace = 'eth' // | 'btc'

interface CreateOnramperUrlInput {
  address?: string
  defaultCrypto: string
  namespace: OnramperNamespace
}

type CreateOnramperUrlFn = (input: CreateOnramperUrlInput) => Promise<string>

interface OnramperPanelProps {
  address?: string
  namespace?: OnramperNamespace
  createOnramperUrl: CreateOnramperUrlFn
  defaultCrypto?: string
}

export const OnramperPanel: FC<OnramperPanelProps> = ({
  address,
  namespace = 'eth',
  createOnramperUrl,
  defaultCrypto = 'ETH',
}) => {
  const { open, setOpen } = useOnramperContext()
  const [src, setSrc] = useState<string | undefined>(undefined)
  const [urlError, setUrlError] = useState(false)
  const isUrlPending = Boolean(open && !src && !urlError)

  useEffect(() => {
    if (!open) {
      setSrc(undefined)
      setUrlError(false)
      return
    }

    let cancelled = false
    setSrc(undefined)
    setUrlError(false)

    createOnramperUrl({ address, defaultCrypto, namespace })
      .then((url) => {
        if (!cancelled) {
          setSrc(url)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUrlError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [createOnramperUrl, namespace, address, defaultCrypto, open])

  return (
    <Dialog open={open && !isUrlPending} onOpenChange={() => {}}>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={classNames(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl md:w-full',
          )}
        >
          <VisuallyHidden>
            <DialogPrimitive.DialogTitle>Onramper</DialogPrimitive.DialogTitle>
          </VisuallyHidden>
          <div className="flex justify-end">
            <IconButton
              onClick={() => setOpen(false)}
              icon={XMarkIcon}
              name="Close"
            />
          </div>
          <div className="flex items-center justify-center w-full h-[75vh] sm:h-[620px] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            {src ? (
              <iframe
                src={src}
                height="100%"
                width="100%"
                title="Onramper widget"
                allow="accelerometer; autoplay; camera; gyroscope; payment"
                sandbox="allow-scripts allow-popups allow-same-origin"
              />
            ) : (
              <p role="alert" className="px-6 text-center text-sm">
                Onramper could not be loaded. Close this dialog and try again.
              </p>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}

interface OnramperContext {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setDefaultCrypto: Dispatch<SetStateAction<string>>
}

const OnramperContext = createContext<OnramperContext | undefined>(undefined)

interface ProviderProps {
  createOnramperUrl: CreateOnramperUrlFn
  address?: string
  namespace?: OnramperNamespace
  children:
    | (({
        open,
        setOpen,
      }: { open: boolean; setOpen(open: boolean): void }) => ReactNode)
    | ReactNode
}

export const OnramperProvider: FC<ProviderProps> = ({
  children,
  address,
  namespace,
  createOnramperUrl,
}) => {
  const [open, setOpen] = useState(false)
  const [defaultCrypto, setDefaultCrypto] = useState('ETH')

  return (
    <OnramperContext.Provider value={{ open, setOpen, setDefaultCrypto }}>
      {typeof children === 'function' ? children({ open, setOpen }) : children}
      <OnramperPanel
        defaultCrypto={defaultCrypto}
        createOnramperUrl={createOnramperUrl}
        address={address}
        namespace={namespace}
      />
    </OnramperContext.Provider>
  )
}

export const useOnramperContext = () => {
  const context = useContext(OnramperContext)
  if (!context) {
    throw new Error('Hook can only be used inside Onramper Context')
  }

  return context
}
