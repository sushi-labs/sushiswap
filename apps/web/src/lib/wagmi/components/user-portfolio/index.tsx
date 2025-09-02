'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
  cloudinaryFetchLoader,
  useBreakpoint,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import Image from 'next/image'
import { type FC, type ReactNode, useMemo, useState } from 'react'
import { EvmChainId, shortenEvmAddress } from 'sushi/evm'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import { ConnectButton } from '../connect-button'
import { PortfolioDefaultView } from './PortfolioDefaultView'
import { PortfolioSettingsView } from './PortfolioSettingsView'

export enum PortfolioView {
  Default = 'Default',
  Settings = 'Settings',
}

const ResponsivePortfolioWrapper: FC<{
  content: ReactNode
  trigger: ReactNode
  isSm: boolean
}> = ({ content, trigger, isSm }) => {
  return isSm ? (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent hideClose className="!p-0">
        {content}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent hideClose className="!p-0 h-[calc(100%-16px)]">
        {content}
      </DialogContent>
    </Dialog>
  )
}

export const UserPortfolio = () => {
  const { isSm } = useBreakpoint('sm')
  const { address } = useAccount()
  const [view, setView] = useState(PortfolioView.Default)

  const { data: ensName, isLoading: isENSNameLoading } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address,
  })

  const { data: avatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: EvmChainId.ETHEREUM,
  })

  const content = useMemo(() => {
    switch (view) {
      case PortfolioView.Settings:
        return (
          <>
            <VisuallyHidden>
              <DialogTitle>Portfolio Settings</DialogTitle>
            </VisuallyHidden>
            <PortfolioSettingsView setView={setView} />
          </>
        )
      default:
        return (
          <>
            <VisuallyHidden>
              <DialogTitle>Portfolio Default View</DialogTitle>
            </VisuallyHidden>
            <PortfolioDefaultView
              setView={setView}
              ensName={ensName}
              isENSNameLoading={isENSNameLoading}
            />
          </>
        )
    }
  }, [view, ensName, isENSNameLoading])

  if (!address) return <ConnectButton variant="secondary" />

  return (
    <ResponsivePortfolioWrapper
      trigger={
        <Button variant="secondary">
          {avatar ? (
            <Image
              alt="ens-avatar"
              src={avatar}
              width={20}
              height={20}
              className="rounded-full"
              loader={cloudinaryFetchLoader}
            />
          ) : (
            <JazzIcon diameter={20} address={address} />
          )}
          <span className="hidden sm:block">{shortenEvmAddress(address)}</span>
        </Button>
      }
      content={content}
      isSm={isSm}
    />
  )
}
