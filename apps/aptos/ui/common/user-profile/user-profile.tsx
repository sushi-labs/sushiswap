import { useWallet } from '@aptos-labs/wallet-adapter-react'
import {
  Button,
  JazzIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@sushiswap/ui'
import React, { useState } from 'react'
import { useTokenBalance } from 'utils/hooks/useTokenBalance'
import { useTokens } from 'utils/hooks/useTokens'
import { ConnectButton } from './connect-button'
import { ConnectView } from './connect-view/connect-view'
import { DefaultView } from './default-view'
import { SettingsView } from './settings-view'

export enum ProfileView {
  Disconnected = 0,
  Default = 1,
  Transactions = 2,
  Settings = 3,
}

export function UserProfile() {
  const { account, connected } = useWallet()
  const [view, setView] = useState<ProfileView>(ProfileView.Default)
  const { data: tokens } = useTokens()

  const nativeCurr = tokens?.['0x1::aptos_coin::AptosCoin']
  const { data: balance } = useTokenBalance({
    account: account?.address,
    currency: nativeCurr?.address,
    refetchInterval: 2000,
  })

  if (!connected || !account?.address)
    return <ConnectButton variant="outline" />

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <>
            <div className="hidden md:flex">
              <JazzIcon diameter={20} address={account?.address} />
            </div>
            {`${account?.address?.substring(
              0,
              5,
            )}...${account?.address?.substring(66 - 3)}`}
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {!connected && <ConnectView close={close} />}
        {connected && view === ProfileView.Default && (
          <DefaultView
            balance={balance && balance / 10 ** 8}
            setView={setView}
          />
        )}
        {view === ProfileView.Settings && <SettingsView setView={setView} />}
      </PopoverContent>
    </Popover>
  )
}
