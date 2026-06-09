'use client'
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon'
import { Slot } from '@radix-ui/react-slot'
import { useBreakpoint } from '@sushiswap/hooks'
import { InterfaceEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import Link from 'next/link'
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
import { ChainId } from 'sushi'
import { DialogPrimitive } from './dialog'
import { IconButton } from './iconbutton'
import {
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  perpsDialogCloseVariants,
} from './perps-dialog'
import { SkeletonBox } from './skeleton'

const SWAPPED_OVERRIDE_CHAIN_IDS = [ChainId.SKALE_EUROPA] as const

const SWAPPED_OVERRIDE = {
  [ChainId.SKALE_EUROPA]: 'https://portal.skale.space/onramp',
} as const

type SwappedOverrideChainId = (typeof SWAPPED_OVERRIDE_CHAIN_IDS)[number]

export const isSwappedOverrideChainId = (
  chainId: number | undefined,
): chainId is SwappedOverrideChainId =>
  SWAPPED_OVERRIDE_CHAIN_IDS.includes(chainId as SwappedOverrideChainId)

export const SwappedButton: FC<{
  children: ReactNode
  className?: string
  chainId?: number
}> = ({ children, className, chainId }) => {
  const { setOpen } = useSwappedContext()

  const onClick = useCallback(() => {
    sendAnalyticsEvent(InterfaceEventName.FIAT_ONRAMP_WIDGET_OPENED)
    setOpen(true)
  }, [setOpen])

  return isSwappedOverrideChainId(chainId) ? (
    <Link
      href={SWAPPED_OVERRIDE[chainId]}
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

type SignSwappedDataFn = (data: string) => Promise<string>

interface SwappedPanelProps {
  address?: string
  signSwappedData?: SignSwappedDataFn
  defaultCrypto?: string
}

const publicKey =
  process.env.NEXT_PUBLIC_SWAPPED_PUBLIC_KEY ||
  'pk_sandbox_rT9bW3sN6mJ8F5hP2cRqLvZ7SaD4XoY9' //sandbox pk

const getUrl = (address: string, defaultCrypto: string) => {
  return `https://widget.swapped.com?apiKey=${publicKey}&currencyCode=${defaultCrypto}&walletAddress=${address}&quoteCurrencyAmount=100`
}

const useSwappedSrc = ({
  address,
  signSwappedData,
  defaultCrypto = 'ETH',
}: SwappedPanelProps) => {
  const [signature, setSignature] = useState<string | undefined>(undefined)
  const isSignaturePending = Boolean(address && !signature)
  useEffect(() => {
    if (signSwappedData && address) {
      signSwappedData(getUrl(address, defaultCrypto)).then((signature) => {
        setSignature(signature)
      })
    } else {
      setSignature(undefined)
    }
  }, [signSwappedData, address, defaultCrypto])

  let src = getUrl(address || '', defaultCrypto)
  if (address && signature) {
    src += `&signature=${encodeURIComponent(signature)}`
  }

  return { src, isSignaturePending }
}

export const SwappedPanel: FC<SwappedPanelProps> = ({
  address,
  signSwappedData,
  defaultCrypto = 'ETH', //https://docs.swapped.com/swapped-ramp/readme/supported-cryptocurrencies
}) => {
  const { open, setOpen } = useSwappedContext()
  const { isLg } = useBreakpoint('lg')

  return (
    <PerpsDialog open={open} onOpenChange={() => {}}>
      <PerpsDialogContent className="!max-w-[400px]" hideClose>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Buy with Fiat</PerpsDialogTitle>
          <PerpsDialogDescription>
            Purchase crypto with fiat
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <DialogPrimitive.Close
          asChild
          className={perpsDialogCloseVariants({ variant: 'default' })}
        >
          <IconButton
            variant={isLg ? 'ghost' : 'perps-secondary'}
            size={isLg ? 'sm' : 'default'}
            icon={XMarkIcon}
            onClick={() => setOpen(false)}
            name="Close"
          />
        </DialogPrimitive.Close>
        <PerpsDialogInnerContent className="min-h-[482px] !pt-0">
          {!address ? (
            <div className="flex items-center justify-center w-full h-full font-semibold">
              Connect Wallet in App
            </div>
          ) : (
            <SwappedIframe
              address={address}
              signSwappedData={signSwappedData}
              defaultCrypto={defaultCrypto}
            />
          )}
        </PerpsDialogInnerContent>
      </PerpsDialogContent>
    </PerpsDialog>
  )
}

export const SwappedIframe = ({
  address,
  signSwappedData,
  defaultCrypto = 'ETH', //https://docs.swapped.com/swapped-ramp/readme/supported-cryptocurrencies
}: SwappedPanelProps) => {
  const { src } = useSwappedSrc({ address, signSwappedData, defaultCrypto })
  if (!src.includes('signature')) {
    return <SkeletonBox className="w-full h-full" />
  }
  return (
    <iframe
      src={src}
      height="100%"
      width="100%"
      className="rounded-[28px]"
      title="Swapped widget"
      allow="accelerometer; autoplay; camera; encrypted-media; gyroscope; payment; clipboard-read; clipboard-write"
      sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
    />
  )
}

interface SwappedContext {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setDefaultCrypto: Dispatch<SetStateAction<string>>
}

const SwappedContext = createContext<SwappedContext | undefined>(undefined)

interface ProviderProps {
  signSwappedData: SignSwappedDataFn
  address?: string
  children:
    | (({
        open,
        setOpen,
      }: { open: boolean; setOpen(open: boolean): void }) => ReactNode)
    | ReactNode
  defaultAsset?: string
}

export const SwappedProvider: FC<ProviderProps> = ({
  children,
  address,
  signSwappedData,
  defaultAsset = 'ETH', //https://docs.swapped.com/swapped-ramp/readme/supported-cryptocurrencies
}) => {
  const [open, setOpen] = useState(false)
  const [defaultCrypto, setDefaultCrypto] = useState(defaultAsset || 'ETH')

  return (
    <SwappedContext.Provider value={{ open, setOpen, setDefaultCrypto }}>
      {typeof children === 'function' ? children({ open, setOpen }) : children}
      <SwappedPanel
        defaultCrypto={defaultCrypto}
        signSwappedData={signSwappedData}
        address={address}
      />
    </SwappedContext.Provider>
  )
}

export const useSwappedContext = () => {
  const context = useContext(SwappedContext)
  if (!context) {
    throw new Error('Hook can only be used inside Swapped Context')
  }

  return context
}
