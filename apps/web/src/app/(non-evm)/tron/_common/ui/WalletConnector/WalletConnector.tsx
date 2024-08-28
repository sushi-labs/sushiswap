import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SelectIcon,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'
import { useState } from 'react'
import { IS_TESTNET } from '~tron/_common/constants/is-testnet'
import { truncateText } from '~tron/_common/lib/utils/formatters'
import { DefaultView } from './DefaultView'
import { SettingsView } from './SettingsView'
import { WalletListView } from './WalletListView'

export type IProfileView = 'default' | 'settings'

type WalletConnectorProps = {
  hideChevron?: boolean
  fullWidth?: boolean
  size?: 'default' | 'lg'
  variant?: 'secondary' | 'default'
}

export const WalletConnector = ({
  hideChevron,
  fullWidth,
  size = 'default',
  variant = 'secondary',
}: WalletConnectorProps) => {
  const [view, setView] = useState<IProfileView>('default')
  const { connected, connecting, address } = useWallet()
  const isConnected = address && connected

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Button
          className={`${fullWidth ? 'w-full' : ''}`}
          loading={connecting}
          disabled={connecting}
          asChild
          size={size}
          variant={variant}
        >
          {isConnected ? (
            <>
              <div className="hidden md:flex">
                <JazzIcon diameter={20} address={address} />
              </div>
              {truncateText(address)}
            </>
          ) : (
            <>
              {connecting ? 'Connecting' : 'Connect'}{' '}
              {hideChevron ? null : <SelectIcon />}
            </>
          )}
        </Button>
        {IS_TESTNET && isConnected ? (
          <Chip className="!text-white rounded-md h-fit absolute right-0 !px-1 !py-0 text-[8px] -top-1">
            Testnet
          </Chip>
        ) : null}
      </PopoverTrigger>

      <PopoverContent className="!p-1 !rounded-2xl">
        {!isConnected ? <WalletListView /> : null}
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
