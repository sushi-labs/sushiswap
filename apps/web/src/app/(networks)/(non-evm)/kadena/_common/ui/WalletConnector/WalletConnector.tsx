import {
  Button,
  type ButtonProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import { useState } from 'react'
import { truncateString } from 'sushi'
import { useKadena } from '~kadena/kadena-wallet-provider'
import { DefaultView } from './DefaultView'
import { SettingsView } from './SettingsView'
import { ConnectButton } from './connect-button'

export type IProfileView = 'default' | 'settings'

export const WalletConnector = (props: ButtonProps & { btnText?: string }) => {
  const { isConnected, activeAccount } = useKadena()

  const [view, setView] = useState<IProfileView>('default')

  if (!isConnected || !activeAccount?.accountName) {
    return <ConnectButton btnText={props.btnText} {...props} />
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <JazzIcon diameter={20} address={activeAccount?.accountName} />
          <span className="hidden sm:block">
            {truncateString(activeAccount?.accountName, 10, 'middle')}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
