import {
  Button,
  type ButtonProps,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SkeletonText,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import { useState } from 'react'
import { IS_FUTURENET } from '~stellar/_common/lib/constants'
import { formatAddress } from '~stellar/_common/lib/utils/format'
import { useStellarWallet } from '~stellar/providers'
import { DefaultView } from './DefaultView'
import { SettingsView } from './SettingsView'
import { WalletList } from './WalletList'

export type IProfileView = 'default' | 'settings'

export const ConnectWalletButton = (props: ButtonProps) => {
  const [view, setView] = useState<IProfileView>('default')
  const { connectedAddress, isConnected, isLoading } = useStellarWallet()

  return (
    <Popover>
      <PopoverTrigger className="relative w-full">
        <Button
          disabled={isLoading}
          asChild
          {...props}
          className={props.className}
        >
          {isLoading ? (
            <SkeletonText />
          ) : isConnected && connectedAddress ? (
            <>
              <JazzIcon diameter={20} address={connectedAddress} />
              <span className="hidden sm:block">
                {formatAddress(connectedAddress)}
              </span>
            </>
          ) : (
            'Connect Wallet'
          )}
        </Button>

        {IS_FUTURENET && isConnected ? (
          <Chip className="!text-white rounded-md h-fit absolute right-0 !px-1 !py-0 text-[8px] -top-1">
            Futurenet
          </Chip>
        ) : null}
      </PopoverTrigger>

      <PopoverContent className="!p-1 !rounded-2xl w-fit">
        {!isConnected ? <WalletList /> : null}
        {view === 'default' && isConnected ? (
          <DefaultView setView={setView} />
        ) : null}
        {view === 'settings' && isConnected ? (
          <SettingsView setView={setView} />
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
