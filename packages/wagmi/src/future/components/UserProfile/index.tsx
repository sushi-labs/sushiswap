'use client'

import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from 'sushi'
import { Button } from '@sushiswap/ui/components/button'
import { JazzIcon } from '@sushiswap/ui/components/icons/JazzIcon'
import { Popover, PopoverContent, PopoverTrigger } from '@sushiswap/ui/components/popover'
import { useBreakpoint } from '@sushiswap/ui/lib/useBreakpoint'
import React, { FC, useState } from 'react'
import { useAccount, useEnsAvatar, useEnsName, useNetwork } from 'wagmi'

import { ConnectButton } from '../ConnectButton'
import { ConnectView } from './ConnectView'
import { DefaultView } from './DefaultView'
import { SettingsView } from './SettingsView'
import { TransactionsView } from './TransactionsView'

export enum ProfileView {
  Disconnected = 'Disconnected',
  Default = 'Default',
  Transactions = 'Transactions',
  Settings = 'Settings',
}

interface ProfileProps {
  networks: ChainId[]
}

export const UserProfile: FC<ProfileProps> = () => {
  const { isSm } = useBreakpoint('sm')
  const [view, setView] = useState<ProfileView>(ProfileView.Default)
  const { chain } = useNetwork()
  const { address } = useAccount()

  const { data: name } = useEnsName({
    chainId: ChainId.ETHEREUM,
    address,
  })

  const { data: avatar } = useEnsAvatar({
    name,
    chainId: ChainId.ETHEREUM,
  })

  const chainId = (chain?.id as ChainId) || ChainId.ETHEREUM

  if (!address) return <ConnectButton variant="secondary" />

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          {avatar ? (
            <img alt="ens-avatar" src={avatar} width={20} height={20} className="rounded-full" />
          ) : (
            <JazzIcon diameter={20} address={address} />
          )}
          <span className="hidden sm:block">{shortenAddress(address, isSm ? 3 : 2)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()}>
        {!address && <ConnectView onSelect={close} />}
        {view === ProfileView.Default && address && (
          <DefaultView chainId={chainId} address={address} setView={setView} />
        )}
        {view === ProfileView.Settings && <SettingsView setView={setView} />}
        {view === ProfileView.Transactions && address && <TransactionsView setView={setView} address={address} />}
      </PopoverContent>
    </Popover>
  )
}
