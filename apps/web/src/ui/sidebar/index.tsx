'use client'

import {
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
import { AptosCircle } from '@sushiswap/ui/icons/network/circle/AptosCircle'
import Link from 'next/link'
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import { Chain } from 'sushi'
import { ROUTE_PROCESSOR_5_SUPPORTED_CHAIN_IDS } from 'sushi/config'

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
  shiftContent?: boolean
}

export const SidebarContainer: FC<SidebarContainerProps> = ({
  children,
  shiftContent = false,
}) => {
  const { isOpen } = useSidebar()

  return (
    <div className="flex h-full min-h-0">
      <Sidebar />
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

export const Sidebar = () => {
  const { isOpen } = useSidebar()

  return !isOpen ? null : (
    <nav className="hidden lg:block bg-gray-100 dark:bg-slate-900 w-56 h-full border-r border-gray-200 dark:border-slate-800 overflow-y-auto">
      <div className="h-full flex flex-col px-3 pt-4 overflow-y-auto">
        <span className="text-muted-foreground text-xs px-3">
          Browse Network
        </span>
        <Command>
          <CommandInput
            testdata-id="network-selector-input"
            placeholder="Search..."
          />
          <CommandEmpty>No network found.</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            <Link
              href="https://aptos.sushi.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <CommandItem className="cursor-pointer aria-selected:bg-[unset] hover:bg-muted">
                <div className="flex items-center gap-2">
                  <AptosCircle width={22} height={22} />
                  Aptos
                </div>
              </CommandItem>
            </Link>
            {ROUTE_PROCESSOR_5_SUPPORTED_CHAIN_IDS.map((el) => (
              <CommandItem
                className="cursor-pointer aria-selected:bg-[unset] hover:bg-muted"
                testdata-id={`network-selector-${el}`}
                value={`${Chain.from(el)?.name}__${el}`}
                key={el}
              >
                <div className="flex items-center gap-2">
                  <NetworkIcon chainId={el} width={22} height={22} />
                  {Chain.from(el)?.name}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </div>
    </nav>
  )
}
