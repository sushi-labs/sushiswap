'use client'

import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
  useBreakpoint,
} from '@sushiswap/ui'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ChainId, shortenAddress } from 'sushi'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import { ConnectButton } from '../connect-button'
import { DefaultView } from './DefaultView'
import { SettingsView } from './SettingsView'

export enum PortfolioView {
  Default = 'Default',
  Settings = 'Settings',
}

export const UserPortfolio = () => {
  const { isSm } = useBreakpoint('sm')
  const { address } = useAccount()
  const [view, setView] = useState(PortfolioView.Default)

  const { data: ensName, isLoading: isENSNameLoading } = useEnsName({
    chainId: ChainId.ETHEREUM,
    address,
  })

  const { data: avatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: ChainId.ETHEREUM,
  })

  const content = useMemo(() => {
    switch (view) {
      case PortfolioView.Settings:
        return <SettingsView setView={setView} />
      default:
        return (
          <DefaultView
            setView={setView}
            ensName={ensName}
            isENSNameLoading={isENSNameLoading}
          />
        )
    }
  }, [view, ensName, isENSNameLoading])

  if (!address) return <ConnectButton variant="secondary" />

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          {avatar ? (
            <Image
              alt="ens-avatar"
              src={avatar}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : null}
          <span>{shortenAddress(address, isSm ? 3 : 2)}</span>
        </Button>
      </SheetTrigger>
      <SheetContent hideClose className="!p-0 overflow-hidden">
        {content}
      </SheetContent>
    </Sheet>
  )
}
