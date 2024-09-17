'use client'

import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react'
import {
  Badge,
  Button,
  ButtonProps,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { usePathname, useRouter } from 'next/navigation'
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import { SUPPORTED_NETWORKS } from 'src/config'
import {
  Chain,
  ChainId,
  ChainKey,
  NonStandardChainId,
  NonStandardChains,
  isChainId,
} from 'sushi'
import { useAccount } from 'wagmi'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>> | null
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: null,
})

export const useSidebar = () => {
  return useContext(SidebarContext)
}

interface SidebarProviderProps {
  children: ReactNode
  defaultOpen?: boolean
}

export const SidebarProvider: FC<SidebarProviderProps> = ({
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const SidebarToggle: FC<Omit<ButtonProps, 'onClick'>> = (props) => {
  const { isOpen, setIsOpen } = useSidebar()

  return <Button onClick={() => setIsOpen?.(!isOpen)} {...props} />
}

interface SidebarContainerProps {
  children: ReactNode
  connectedNetwork?: number | string
  shiftContent?: boolean
}

const BaseSidebarContainer: FC<SidebarContainerProps> = ({
  children,
  connectedNetwork,
  shiftContent = false,
}) => {
  const { isOpen } = useSidebar()

  return (
    <div className="flex h-full min-h-0">
      <Sidebar connectedNetwork={connectedNetwork} />
      <div
        className={classNames(
          'flex-1 h-full overflow-y-auto',
          !shiftContent && isOpen ? 'lg:-ml-56' : null,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export const SidebarContainer: FC<
  Omit<SidebarContainerProps, 'connectedNetwork'>
> = (props) => {
  const { chainId } = useAccount()

  return <BaseSidebarContainer {...props} connectedNetwork={chainId} />
}

export const AptosSidebarContainer: FC<
  Omit<SidebarContainerProps, 'connectedNetwork'>
> = (props) => {
  const { network } = useAptosWallet()

  return (
    <BaseSidebarContainer
      {...props}
      connectedNetwork={
        network?.name === 'mainnet' ? NonStandardChainId.APTOS : undefined
      }
    />
  )
}

interface SidebarProps {
  supportedNetworks?: (ChainId | NonStandardChainId)[]
  connectedNetwork?: number | string
}

const Sidebar: FC<SidebarProps> = ({ connectedNetwork }) => {
  const { isOpen } = useSidebar()

  const router = useRouter()
  const pathname = usePathname()

  const onSelect = useCallback(
    (value: string) => {
      const network = value.split('__')[1]
      const pathSegments = pathname.split('/')
      pathSegments[1] = isChainId(+network)
        ? ChainKey[+network as ChainId]
        : network

      router.push(pathSegments.join('/'), { scroll: false })
    },
    [pathname, router],
  )

  return !isOpen ? null : (
    <nav className="hidden lg:block z-10 bg-gray-100 dark:bg-slate-900 w-56 h-full border-r border-gray-200 dark:border-slate-800">
      <div className="h-full flex flex-col pt-3">
        <Command>
          <div className="px-1">
            <span className="text-muted-foreground text-xs px-3">
              Browse Network
            </span>
            <CommandInput
              testdata-id="network-selector-input"
              placeholder="Search..."
            />
            <CommandEmpty>No network found.</CommandEmpty>
          </div>
          <CommandGroup className="overflow-y-auto">
            {SUPPORTED_NETWORKS.map((network) => {
              const name =
                typeof network === 'number'
                  ? Chain.from(network)?.name
                  : NonStandardChains[network].name

              return (
                <CommandItem
                  key={network}
                  className="cursor-pointer aria-selected:!bg-[unset] aria-selected:!text-[unset] !p-0"
                  testdata-id={`network-selector-${network}`}
                  value={`${name}__${network}`}
                  onSelect={onSelect}
                >
                  <div className="flex items-center gap-2 hover:bg-muted hover:text-accent-foreground p-2 w-full rounded-lg">
                    <Badge
                      position="bottom-right"
                      badgeContent={
                        connectedNetwork === network ? (
                          <div className="bg-green rounded-full w-2 h-2 mr-0.5 mb-0.5" />
                        ) : (
                          <div />
                        )
                      }
                    >
                      <NetworkIcon chainId={network} width={22} height={22} />
                    </Badge>
                    {name}
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </div>
    </nav>
  )
}
