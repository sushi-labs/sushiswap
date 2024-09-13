'use client'

import {
  Badge,
  Button,
  ButtonProps,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  IconComponent,
  classNames,
} from '@sushiswap/ui'
import { AptosCircle } from '@sushiswap/ui/icons/network/circle/AptosCircle'
import { NETWORK_CIRCLE_ICON } from '@sushiswap/ui/icons/network/circle/index'
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
import { NON_EVM_NETWORKS, SUPPORTED_NETWORKS } from 'src/config'
import { Chain, ChainId, ChainKey, isChainId } from 'sushi'
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
  nonEVMNetwork?: string
  shiftContent?: boolean
}

export const SidebarContainer: FC<SidebarContainerProps> = ({
  children,
  nonEVMNetwork,
  shiftContent = false,
}) => {
  const { isOpen } = useSidebar()

  return (
    <div className="flex h-full min-h-0">
      <Sidebar nonEVMNetwork={nonEVMNetwork} />
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

const NonEvmNetwork: Record<
  (typeof NON_EVM_NETWORKS)[number],
  { name: string; icon: IconComponent }
> = {
  aptos: {
    name: 'Aptos',
    icon: AptosCircle,
  },
}

interface SidebarProps {
  nonEVMNetwork?: string
}

const Sidebar: FC<SidebarProps> = ({ nonEVMNetwork }) => {
  const { isOpen } = useSidebar()

  const { chainId } = useAccount()

  const connectedNetwork = nonEVMNetwork ?? chainId

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
              const [name, icon] =
                typeof network === 'string'
                  ? [NonEvmNetwork[network].name, NonEvmNetwork[network].icon]
                  : [
                      Chain.from(+network)?.name,
                      NETWORK_CIRCLE_ICON[+network as ChainId]!,
                    ]
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
                      <span>{icon({ width: 22, height: 22 })}</span>
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
