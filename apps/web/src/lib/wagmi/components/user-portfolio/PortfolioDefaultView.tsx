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
import { getEvmChainById, isEvmChainId, shortenEvmAddress } from 'sushi/evm'
import { useAccount, useDisconnect } from 'wagmi'
import type { GetEnsNameReturnType } from 'wagmi/actions'
import { PortfolioView } from '.'
import { PortfolioClaimables } from './portfolio-claimables'
import { PortfolioPositions } from './portfolio-positions'
import { PortfolioTokens } from './portfolio-tokens'

enum PortfolioTab {
  Tokens = 'Tokens',
  Positions = 'Positions',
  Claimable = 'Claimable',
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
  const { connector, address, chain } = useAccount()
  const { disconnect } = useDisconnect()

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
    <div className="flex flex-col h-full gap-y-5 overflow-hidden">
      <div className="flex justify-between px-5 py-6 bg-secondary">
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
