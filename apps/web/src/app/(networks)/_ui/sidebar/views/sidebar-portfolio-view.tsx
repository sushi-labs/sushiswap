import { PlusIcon } from '@heroicons/react-v1/solid'
import {
  ArrowLeftOnRectangleIcon,
  ArrowsRightLeftIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  ClipboardController,
  IconButton,
  LinkExternal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SkeletonBox,
  SkeletonCircle,
} from '@sushiswap/ui'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { SidebarView, useSidebar } from 'src/app/(networks)/_ui/sidebar'
import {
  PortfolioClaimables,
  PortfolioPositions,
  PortfolioTokens,
} from 'src/lib/wagmi/components/user-portfolio'
import { EvmChainId, getEvmChainById, shortenEvmAddress } from 'sushi/evm'
import { useConnection, useDisconnect, useEnsName } from 'wagmi'

enum PortfolioTab {
  Tokens = 'Tokens',
  Positions = 'Positions',
  Claimable = 'Claimable',
  // History = 'History',
}

export const SidebarPortfolioView = () => {
  const { connector, address, chain } = useConnection()
  const { mutate: disconnect } = useDisconnect()
  const { data: ensName, isLoading: isENSNameLoading } = useEnsName({
    chainId: EvmChainId.ETHEREUM,
    address,
  })
  const { setView } = useSidebar()

  const [tab, setTab] = useState(PortfolioTab.Tokens)

  const content = useMemo(() => {
    switch (tab) {
      case PortfolioTab.Tokens:
        return <PortfolioTokens />
      case PortfolioTab.Positions:
        return <PortfolioPositions />
      case PortfolioTab.Claimable:
        return <PortfolioClaimables />
      // case PortfolioTab.History:
      // return <PortfolioHistory />
    }
  }, [tab])

  return (
    <div className="flex flex-col h-full gap-y-5 overflow-hidden rounded-2xl">
      <div className="flex justify-between px-5 py-6 bg-secondary">
        <div>
          <div className="flex gap-x-2 items-center">
            {connector ? (
              connector.icon ? (
                <Image
                  src={connector.icon.trim()}
                  width="40"
                  height="40"
                  className="p-1"
                  alt={connector.name}
                />
              ) : (
                <UserCircleIcon
                  width={40}
                  height={40}
                  className="!text-primary opacity-50"
                />
              )
            ) : (
              <SkeletonCircle radius={40} />
            )}
            {!address || isENSNameLoading ? (
              <SkeletonBox className="h-8 w-32" />
            ) : ensName ? (
              <div>
                <div className="font-semibold">{ensName}</div>
                <div className="text-xs text-muted-foreground">
                  {shortenEvmAddress(address)}
                </div>
              </div>
            ) : (
              <span className="font-semibold">
                {shortenEvmAddress(address)}
              </span>
            )}
          </div>
          <div className="flex gap-x-3 pt-1 px-2">
            <IconButton
              size="xs"
              icon={Cog6ToothIcon}
              onClick={() => setView(SidebarView.Settings)}
              description="Settings"
              name="Settings"
            />
            <ClipboardController hideTooltip>
              {({ setCopied, isCopied }) => (
                <IconButton
                  size="xs"
                  icon={DocumentDuplicateIcon}
                  onClick={() => setCopied(address!)}
                  description={isCopied ? 'Copied!' : 'Copy Address'}
                  name="Copy"
                />
              )}
            </ClipboardController>
            {chain && (
              <LinkExternal
                href={getEvmChainById(chain.id).getAccountUrl(address!)}
              >
                <IconButton
                  size="xs"
                  icon={LinkIcon}
                  description="View on Explorer"
                  name="View on Explorer"
                />
              </LinkExternal>
            )}
            <IconButton
              size="xs"
              icon={ArrowLeftOnRectangleIcon}
              onClick={() => disconnect()}
              description="Disconnect"
              name="Disconnect"
            />
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
      </div>
      <div className="flex px-5 gap-x-2">
        {Object.values(PortfolioTab).map((_tab) => (
          <Button
            key={_tab}
            asChild
            size="xs"
            variant={_tab === tab ? 'secondary' : 'ghost'}
            onClick={() => setTab(_tab)}
            className="select-none"
          >
            {_tab}
          </Button>
        ))}
      </div>
      {content}
    </div>
  )
}
