import { Pact, createClient } from '@kadena/client'
import {
  Button,
  type ButtonProps,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import { useEffect, useState } from 'react'
import { IS_TESTNET } from '~kadena/_common/constants/is-testnet'
import { truncateText } from '~kadena/_common/lib/utils/formatters'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { DefaultView } from './DefaultView'
import { SettingsView } from './SettingsView'
import { WalletListView } from './WalletListView'

export type IProfileView = 'default' | 'settings'

export const WalletConnector = (props: ButtonProps) => {
  const { isConnected, isConnecting, activeAccount } = useKadena()

  const [view, setView] = useState<IProfileView>('default')

  return (
    <Popover>
      <PopoverTrigger className="relative w-full">
        <Button
          loading={isConnecting}
          disabled={isConnecting}
          asChild
          {...props}
        >
          {isConnected && activeAccount?.accountName ? (
            <>
              <JazzIcon diameter={20} address={activeAccount?.accountName} />
              <span className="hidden sm:block">
                {truncateText(activeAccount?.accountName)}
              </span>
            </>
          ) : (
            <>{isConnecting ? 'Connecting' : 'Connect'} </>
          )}
        </Button>
        {IS_TESTNET && isConnected ? (
          <Chip className="!text-white rounded-md h-fit absolute right-0 !px-1 !py-0 text-[8px] -top-1">
            Testnet
          </Chip>
        ) : null}
      </PopoverTrigger>

      <PopoverContent className="!p-1 !rounded-2xl w-full">
        {!isConnected ? <WalletListView isFullWidth={props.fullWidth} /> : null}
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
