'use client'

import {
  ArrowLeftOnRectangleIcon,
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import {
  Badge,
  Button,
  ClipboardController,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SkeletonBox,
  SkeletonCircle,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import Image from 'next/image'
import { useState } from 'react'
import { SidebarView, useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { type WalletConnection, useWallets } from 'src/lib/wallet'
import { DisconnectWalletButton } from 'src/lib/wallet/components/disconnect-wallet-button'
import { getChainById } from 'sushi'
import { EvmChainId, shortenEvmAddress } from 'sushi/evm'
import { useEnsName } from 'wagmi'

const WalletsPopover = ({
  evm,
  svm,
}: { evm: WalletConnection; svm: WalletConnection }) => {
  const { setView } = useSidebar()

  const { data: ensName } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address: evm.account as `0x${string}`,
  })

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full justify-between items-center">
        <PopoverTrigger>
          <div className="flex gap-2 items-center">
            <UserCircleIcon
              width={24}
              height={24}
              className="!text-primary opacity-50"
            />
            <span className="font-semibold">Wallets</span>
            {isOpen ? (
              <ChevronUpIcon className="w-2.5 stroke-2" />
            ) : (
              <ChevronDownIcon className="w-2.5 stroke-2" />
            )}
          </div>
        </PopoverTrigger>
        <IconButton
          size="xs"
          icon={Cog6ToothIcon}
          onClick={() => setView(SidebarView.Settings)}
          description="Settings"
          name="Settings"
        />
      </div>
      <PopoverContent align="start" className="w-[280px]">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <NetworkIcon chainId={evm.chainId} width={28} height={28} />
              <div className="flex flex-col">
                <span className="text-sm">
                  {ensName ?? shortenEvmAddress(evm.account)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {getChainById(evm.chainId).name}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <ClipboardController hideTooltip>
                {({ setCopied, isCopied }) => (
                  <IconButton
                    size="xs"
                    icon={DocumentDuplicateIcon}
                    onClick={() => setCopied(evm.account)}
                    description={isCopied ? 'Copied!' : 'Copy Address'}
                    name="Copy"
                  />
                )}
              </ClipboardController>
              <DisconnectWalletButton namespace="evm" asChild>
                <IconButton
                  size="xs"
                  icon={ArrowLeftOnRectangleIcon}
                  description="Disconnect"
                  name="Disconnect"
                />
              </DisconnectWalletButton>
              <IconButton
                size="xs"
                icon={ArrowsRightLeftIcon} // TODO
                description="Switch wallet"
                name="switchWallet"
                onClick={() =>
                  setView(SidebarView.Connect, {
                    action: 'switch',
                    namespace: 'evm',
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <NetworkIcon chainId={svm.chainId} width={28} height={28} />
              <div className="flex flex-col">
                <span className="text-sm">
                  {ensName ?? shortenEvmAddress(svm.account)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {getChainById(svm.chainId).name}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <ClipboardController hideTooltip>
                {({ setCopied, isCopied }) => (
                  <IconButton
                    size="xs"
                    icon={DocumentDuplicateIcon}
                    onClick={() => setCopied(svm.account)}
                    description={isCopied ? 'Copied!' : 'Copy Address'}
                    name="Copy"
                  />
                )}
              </ClipboardController>
              <DisconnectWalletButton namespace="svm" asChild>
                <IconButton
                  size="xs"
                  icon={ArrowLeftOnRectangleIcon}
                  description="Disconnect"
                  name="Disconnect"
                />
              </DisconnectWalletButton>
              <IconButton
                size="xs"
                icon={ArrowsRightLeftIcon} // TODO
                description="Switch wallet"
                name="switchWallet"
                onClick={() =>
                  setView(SidebarView.Connect, {
                    action: 'switch',
                    namespace: 'svm',
                  })
                }
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const WalletInfo = ({ wallet }: { wallet: WalletConnection | undefined }) => {
  const { setView } = useSidebar()

  const { data: ensName, isLoading: isENSNameLoading } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address: wallet?.account as `0x${string}`,
    query: {
      enabled: Boolean(wallet?.namespace === 'evm'),
    },
  })

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2.5">
        <div className="shrink-0">
          {wallet ? (
            <Badge
              className="border-2 border-background bg-background rounded-full z-[11]"
              position="bottom-right"
              badgeContent={
                <NetworkIcon chainId={wallet.chainId} width={14} height={14} />
              }
            >
              {wallet.icon ? (
                <Image
                  src={wallet.icon.trim()}
                  width="40"
                  height="40"
                  className="p-1"
                  alt={wallet.name}
                />
              ) : (
                <UserCircleIcon
                  width={40}
                  height={40}
                  className="!text-primary opacity-50"
                />
              )}
            </Badge>
          ) : (
            <SkeletonCircle radius={40} />
          )}
        </div>
        <div>
          {!wallet?.account || isENSNameLoading ? (
            <SkeletonBox className="h-8 w-32" />
          ) : ensName ? (
            <>
              <div className="font-semibold">{ensName}</div>
              <ClipboardController hideTooltip>
                {({ setCopied }) => (
                  <Button
                    asChild
                    variant="blank"
                    onClick={() => setCopied(wallet?.account!)}
                    className="flex gap-1 text-xs items-center text-muted-foreground !p-0 !h-[unset] !min-h-[unset]"
                  >
                    {shortenEvmAddress(wallet.account)}
                    <DocumentDuplicateIcon className="w-2.5 h-2.5" />
                  </Button>
                )}
              </ClipboardController>
            </>
          ) : (
            <>
              <div className="font-semibold">
                {shortenEvmAddress(wallet.account)}
              </div>
              <ClipboardController hideTooltip>
                {({ setCopied }) => (
                  <Button
                    asChild
                    variant="blank"
                    onClick={() => setCopied(wallet?.account!)}
                    className="flex gap-1 text-xs items-center text-muted-foreground !p-0 !h-[unset] !min-h-[unset]"
                  >
                    {shortenEvmAddress(wallet.account)}
                    <DocumentDuplicateIcon className="w-2.5 h-2.5" />
                  </Button>
                )}
              </ClipboardController>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-x-1">
        <IconButton
          size="xs"
          icon={Cog6ToothIcon}
          onClick={() => setView(SidebarView.Settings)}
          description="Settings"
          name="Settings"
        />
        <DisconnectWalletButton namespace={wallet?.namespace ?? 'evm'} asChild>
          <IconButton
            size="xs"
            icon={ArrowLeftOnRectangleIcon}
            description="Disconnect"
            name="Disconnect"
          />
        </DisconnectWalletButton>
        <Popover>
          <PopoverTrigger asChild>
            <IconButton
              size="xs"
              icon={PlusCircleIcon}
              description="Wallet Options"
              name="Wallet Options"
            />
          </PopoverTrigger>
          <PopoverContent
            className="!p-2"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                variant="ghost"
                icon={PlusIcon}
                className="!justify-start"
                onClick={() =>
                  setView(SidebarView.Connect, {
                    namespace: 'svm',
                  })
                }
              >
                Connect Solana Wallet
              </Button>
              <Button
                fullWidth
                variant="ghost"
                icon={ArrowsRightLeftIcon} // TODO
                className="!justify-start"
                onClick={() =>
                  setView(SidebarView.Connect, { action: 'switch' })
                }
              >
                Switch Wallet
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export const PortfolioHeader = () => {
  const wallets = useWallets()

  return (
    <div className="flex justify-between px-5 py-6 bg-secondary">
      {wallets.evm && wallets.svm ? (
        <WalletsPopover evm={wallets.evm} svm={wallets.svm} />
      ) : (
        <WalletInfo wallet={wallets.evm ?? wallets.svm} />
      )}
    </div>
  )
}
