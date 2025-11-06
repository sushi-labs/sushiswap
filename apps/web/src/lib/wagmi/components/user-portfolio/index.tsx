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
import { useAccountDrawer } from './hooks/use-account-drawer'
import { PortfolioDefaultView } from './portfolio-default-view'
import { PortfolioSettingsView } from './portfolio-settings-view'
import { TwapOrdersBadge } from './twap-orders-badge'

export enum PortfolioView {
  Default = 'Default',
  Settings = 'Settings',
}

const ResponsivePortfolioWrapper: FC<{
  content: ReactNode
  trigger: ReactNode
  isSm: boolean
}> = ({ content, trigger, isSm }) => {
  const { isOpen, handleAccountDrawer } = useAccountDrawer()

  return isSm ? (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => handleAccountDrawer({ state: open })}
    >
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        overlayClassName="!h-[calc(100%-57px)] dark:bg-slate-900/50 bg-gray-100/50 !inset-y-[57px] backdrop-blur-none"
        hideClose
        className="!p-0 !shadow-none border-t-0 !rounded-none dark:!bg-slate-900 !right-0 !inset-y-[57px] !h-[calc(100%-57px)]"
      >
        {content}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => handleAccountDrawer({ state: open })}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        variant="semi-opaque"
        hideClose
        aria-describedby={undefined}
        className="!p-0 h-[100vh]"
      >
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
          <TwapOrdersBadge type="all-active" />
        </Button>
      }
      content={content}
      isSm={isSm}
    />
  )
}
