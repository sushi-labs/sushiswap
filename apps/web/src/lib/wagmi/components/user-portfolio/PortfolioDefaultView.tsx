import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  ClipboardController,
  DialogPrimitive,
  IconButton,
  LinkExternal,
  SkeletonBox,
  SkeletonCircle,
} from '@sushiswap/ui'
import Image from 'next/image'
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useMemo,
  useState,
} from 'react'
import { SUPPORTED_NETWORKS } from 'src/config'
import { HeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { type ChainId, evmChains, shortenAddress } from 'sushi'
import { useAccount, useDisconnect } from 'wagmi'
import type { GetEnsNameReturnType } from 'wagmi/actions'
import { PortfolioView } from '.'
import { NotificationBadge } from './notification-badge'
import { PortfolioAssets } from './portfolio-assets/portfolio-assets'
import { PortfolioTokens } from './portfolio-tokens'

enum PortfolioTab {
  Assets = 'Assets',
  Orders = 'Orders',
  Inbox = 'Inbox',
  // History = 'History',
}

interface PortfolioDefaultProps {
  ensName: GetEnsNameReturnType | undefined
  isENSNameLoading: boolean
  setView: Dispatch<SetStateAction<PortfolioView>>
}

export const PortfolioDefaultView: FC<PortfolioDefaultProps> = ({
  setView,
  ensName,
  isENSNameLoading,
}) => {
  const { connector, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()

  const [tab, setTab] = useState(PortfolioTab.Assets)

  const content = useMemo(() => {
    //TODO: update to correct names and content. satart with assets
    switch (tab) {
      case PortfolioTab.Assets:
        // return <PortfolioTokens />;
        return <PortfolioAssets />
      case PortfolioTab.Orders:
        return <>TODO orders</>
      // return <PortfolioPositions />;
      case PortfolioTab.Inbox:
        return <>TODO inbox</>
      // return <PortfolioClaimables />;
      // case PortfolioTab.History:
      // return <PortfolioHistory />
    }
  }, [tab])

  return (
    <div className="flex flex-col h-full gap-y-5 overflow-hidden">
      <div className="flex flex-col gap-2 px-5 py-6 sm:bg-gray-100 bg-slate-100 dark:bg-slate-800 sm:dark:bg-slate-900">
        <DialogPrimitive.Close asChild className={'flex sm:hidden'}>
          <IconButton icon={ArrowLeftIcon} name="Close" variant="ghost" />
        </DialogPrimitive.Close>
        <div className="flex justify-between">
          <div>
            <div className="flex gap-x-2 items-center">
              {connector ? (
                connector.icon ? (
                  <Image
                    src={connector.icon}
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
                    {shortenAddress(address)}
                  </div>
                </div>
              ) : (
                <span className="font-semibold">{shortenAddress(address)}</span>
              )}
            </div>
            <div className="flex gap-x-3 pt-1 px-2">
              <IconButton
                size="xs"
                icon={Cog6ToothIcon}
                onClick={() => setView(PortfolioView.Settings)}
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
              <LinkExternal
                href={evmChains[chainId as ChainId]?.getAccountUrl(address!)}
              >
                <IconButton
                  size="xs"
                  icon={LinkIcon}
                  description="View on Explorer"
                  name="View on Explorer"
                />
              </LinkExternal>
              <IconButton
                size="xs"
                icon={ArrowLeftOnRectangleIcon}
                onClick={() => disconnect()}
                description="Disconnect"
                name="Disconnect"
              />
            </div>
          </div>
          <HeaderNetworkSelector
            className="!px-2.5"
            networks={SUPPORTED_NETWORKS}
            hideNetworkName={true}
          />
        </div>
      </div>
      <div className="flex px-5 gap-x-2">
        {Object.values(PortfolioTab).map((_tab) => (
          <Button
            key={_tab}
            asChild
            size="xs"
            variant={_tab === tab ? 'secondary' : 'ghost'}
            onClick={() => {
              setTab(_tab)
            }}
            className="select-none !gap-1"
          >
            {_tab}
            {_tab === PortfolioTab.Orders ? (
              <NotificationBadge notificationCount={3} size="sm" />
            ) : null}
          </Button>
        ))}
      </div>
      {content}
    </div>
  )
}
