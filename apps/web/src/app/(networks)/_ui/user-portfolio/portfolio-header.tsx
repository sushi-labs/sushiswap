'use client'

import {
  ArrowLeftOnRectangleIcon,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useBreakpoint,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { SwitchIcon } from '@sushiswap/ui/icons/SwitchIcon'
import { type ReactNode, useMemo, useState } from 'react'
import { SidebarView, useSidebar } from 'src/app/(networks)/_ui/sidebar'
import {
  ENABLED_WALLET_NAMESPACES,
  type WalletConnection,
  type WalletNamespace,
  getNameFromNamespace,
  useWallets,
} from 'src/lib/wallet'
import { DisconnectWalletButton } from 'src/lib/wallet/components/disconnect-wallet-button'
import { getChainById, shortenAddress } from 'sushi'
import { EvmChainId } from 'sushi/evm'
import { useEnsName } from 'wagmi'

export const PortfolioHeader = () => {
  const wallets = useWallets()
  const walletCount = useMemo(() => {
    if (!wallets) return 0
    return Object.values(wallets)?.filter((wallet) => wallet !== undefined)
      .length
  }, [wallets])
  return (
    <div className="flex justify-between px-5 py-6 bg-secondary">
      {walletCount > 1 ? (
        <ConnectedWalletsPopover
          evm={wallets.evm}
          svm={wallets.svm}
          stellar={wallets.stellar}
        />
      ) : (
        <ConnectedWalletInfo
          wallet={wallets.evm ?? wallets.svm ?? wallets.stellar}
        />
      )}
    </div>
  )
}

const ConnectedWalletInfo = ({
  wallet,
}: { wallet: WalletConnection | undefined }) => {
  const { setView } = useSidebar()

  const { data: ensName, isLoading: isENSNameLoading } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address: wallet?.account as `0x${string}`,
    query: {
      enabled: Boolean(wallet?.namespace === 'evm'),
    },
  })

  const namespacesToConnectTo = useMemo(() => {
    if (!wallet) return []
    const otherNamespaces = ENABLED_WALLET_NAMESPACES.filter(
      (namespace) => namespace !== wallet.namespace,
    )
    return otherNamespaces
  }, [wallet])

  const { isSm } = useBreakpoint('sm')

  const utilButtonSize = isSm ? 'xs' : 'sm'

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2.5">
        <div className="shrink-0">
          {wallet ? (
            <Badge
              position="bottom-right"
              className="!-bottom-0 !-right-0"
              badgeContent={
                <NetworkIcon chainId={wallet.chainId} width={16} height={16} />
              }
            >
              {wallet.icon ? (
                <div className="w-10 h-10 p-1">
                  <img
                    src={wallet.icon.trim()}
                    width="36"
                    height="36"
                    className="rounded-md"
                    alt={wallet.name}
                  />
                </div>
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
        <div className="flex flex-col justify-center">
          {!wallet?.account || isENSNameLoading ? (
            <SkeletonBox className="h-5 w-28" />
          ) : ensName ? (
            <div className="font-semibold leading-tight cursor-default">
              {ensName}
            </div>
          ) : (
            <div className="font-semibold leading-tight cursor-default">
              {shortenAddress(wallet.account)}
            </div>
          )}
          {!wallet?.account ? (
            <SkeletonBox className="h-3 w-24" />
          ) : (
            <ClipboardController hideTooltip>
              {({ setCopied, isCopied }) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="blank"
                        onClick={() => setCopied(wallet.account)}
                        className="flex text-xs !justify-start items-center text-muted-foreground !p-0 !h-[unset] !min-h-[unset] leading-none"
                      >
                        {shortenAddress(wallet.account)}
                        <DocumentDuplicateIcon className="w-2.5 h-2.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{isCopied ? 'Copied!' : 'Copy Address'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </ClipboardController>
          )}
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <IconButton
          size={utilButtonSize}
          variant="ghost"
          icon={Cog6ToothIcon}
          onClick={() => setView(SidebarView.Settings)}
          description="Settings"
          name="Settings"
        />
        <DisconnectWalletButton
          onSuccess={() => {
            if (wallet?.namespace === 'stellar') {
              setView(SidebarView.Connect, {
                namespace: 'stellar',
              })
            }
          }}
          namespace={wallet?.namespace ?? 'evm'}
          asChild
        >
          <IconButton
            size={utilButtonSize}
            variant="ghost"
            icon={ArrowLeftOnRectangleIcon}
            description="Disconnect"
            name="Disconnect"
          />
        </DisconnectWalletButton>
        <ConnectMoreWallets namespacesToConnectTo={namespacesToConnectTo}>
          <Button
            fullWidth
            variant="ghost"
            icon={SwitchIcon}
            className="!justify-start"
            onClick={() =>
              setView(SidebarView.Connect, {
                action: 'switch',
                namespace:
                  wallet?.namespace === 'stellar' ? 'stellar' : undefined,
              })
            }
          >
            Switch Wallet
          </Button>
        </ConnectMoreWallets>
      </div>
    </div>
  )
}

const ConnectMoreWallets = ({
  namespacesToConnectTo,
  children,
}: { namespacesToConnectTo: WalletNamespace[]; children?: ReactNode }) => {
  const { isSm } = useBreakpoint('sm')
  const { setView } = useSidebar()

  const utilButtonSize = isSm ? 'xs' : 'sm'
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          size={utilButtonSize}
          variant="ghost"
          icon={PlusCircleIcon}
          description="Wallet Options"
          name="Wallet Options"
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="!p-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2">
          {namespacesToConnectTo?.map((namespace) => (
            <Button
              key={namespace}
              fullWidth
              variant="ghost"
              icon={PlusIcon}
              className="!justify-start"
              onClick={() =>
                setView(SidebarView.Connect, {
                  namespace: namespace,
                })
              }
            >
              Connect {getNameFromNamespace(namespace)} Wallet
            </Button>
          ))}
          {children}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const ConnectedWalletsPopover = ({
  evm,
  svm,
  stellar,
}: {
  evm?: WalletConnection
  svm?: WalletConnection
  stellar?: WalletConnection
}) => {
  const { setView } = useSidebar()

  const { data: ensName } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address: evm?.account ? (evm?.account as `0x${string}`) : undefined,
  })

  const [isOpen, setIsOpen] = useState(false)

  const wallets = useMemo(
    () => [
      ...(evm ? [{ wallet: evm, displayName: ensName ?? undefined }] : []),
      ...(svm ? [{ wallet: svm }] : []),
      ...(stellar ? [{ wallet: stellar }] : []),
    ],
    [evm, ensName, svm, stellar],
  )

  const namespacesToConnectTo = useMemo(() => {
    const connectedNamespaces = wallets?.map(({ wallet }) => wallet.namespace)
    const otherNamespaces = ENABLED_WALLET_NAMESPACES.filter(
      (namespace) => !connectedNamespaces.includes(namespace),
    )
    return otherNamespaces
  }, [wallets])

  return (
    <div className="flex w-full justify-between items-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div className="flex gap-2 items-center">
            <UserCircleIcon
              width={28}
              height={28}
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

        <PopoverContent align="start" className="w-[280px] cursor-default">
          <div className="flex flex-col gap-3">
            <div className="text-muted-foreground text-sm font-medium">
              Connected
            </div>

            {wallets.map(({ wallet, displayName }) => (
              <div
                key={wallet.namespace}
                className="flex justify-between items-center"
              >
                <div className="flex gap-2 items-center">
                  <NetworkIcon
                    chainId={wallet.chainId}
                    width={28}
                    height={28}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm leading-tight">
                      {displayName ?? shortenAddress(wallet.account)}
                    </span>
                    <span className="text-muted-foreground text-xs leading-none">
                      {getChainById(wallet.chainId).name}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 items-center">
                  <ClipboardController hideTooltip>
                    {({ setCopied, isCopied }) => (
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={DocumentDuplicateIcon}
                        onClick={() => setCopied(wallet.account)}
                        description={isCopied ? 'Copied!' : 'Copy Address'}
                        name="Copy"
                      />
                    )}
                  </ClipboardController>

                  <DisconnectWalletButton namespace={wallet.namespace} asChild>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      icon={ArrowLeftOnRectangleIcon}
                      description="Disconnect"
                      name="Disconnect"
                    />
                  </DisconnectWalletButton>

                  <IconButton
                    size="xs"
                    variant="ghost"
                    icon={SwitchIcon}
                    description="Switch Wallet"
                    name="Switch Wallet"
                    onClick={() =>
                      setView(SidebarView.Connect, {
                        action: 'switch',
                        namespace: wallet.namespace,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-1">
        <IconButton
          className="p-1"
          size="xs"
          icon={Cog6ToothIcon}
          onClick={() => setView(SidebarView.Settings)}
          description="Settings"
          name="Settings"
        />
        {namespacesToConnectTo?.length ? (
          <ConnectMoreWallets namespacesToConnectTo={namespacesToConnectTo} />
        ) : null}
      </div>
    </div>
  )
}
