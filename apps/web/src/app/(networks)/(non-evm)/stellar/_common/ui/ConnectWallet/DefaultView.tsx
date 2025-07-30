// TODO: update to show stellar wallets and balances
import {
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { ClipboardController, IconButton, SkeletonText } from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import Link from 'next/link'
import React, { type Dispatch, type SetStateAction } from 'react'
import { useXlmBalance } from '~stellar/_common/lib/hooks/use-xlm-balance'
import { formatAddress } from '~stellar/_common/lib/utils/formatters'
import { getStellarAddressLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useStellarWallet } from '~stellar/providers'
import type { IProfileView } from './ConnectWalletButton'

type DefaultViewProps = {
  setView: Dispatch<SetStateAction<IProfileView>>
}

export const DefaultView = ({ setView }: DefaultViewProps) => {
  const { connectedAddress, disconnectWallet } = useStellarWallet()
  const { data, isLoading: isLoadingBalance } = useXlmBalance()

  console.log({ data })

  return (
    <div className="flex flex-col gap-8 p-4 w-full">
      <div className="flex justify-between gap-2 w-full">
        <div className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-slate-200">
          {connectedAddress && (
            <JazzIcon diameter={16} address={connectedAddress} />
          )}
          <ClipboardController>
            {({ setCopied }) => (
              <span
                onKeyDown={() => setCopied(connectedAddress ?? '')}
                className="cursor-pointer"
                onClick={() => setCopied(connectedAddress ?? '')}
              >
                {formatAddress(connectedAddress ?? '')}
              </span>
            )}
          </ClipboardController>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            icon={Cog6ToothIcon}
            onClick={() => setView('settings')}
            name="Settings"
            description="Settings"
            size="xs"
          />
          <ClipboardController>
            {({ setCopied }) => (
              <IconButton
                icon={DocumentDuplicateIcon}
                onClick={() => setCopied(connectedAddress ?? '')}
                name={'Copy Address'}
                description={'Copy Address'}
                size="xs"
              />
            )}
          </ClipboardController>
          <Link
            href={getStellarAddressLink(connectedAddress ?? '')}
            target="_blank"
            rel="noopenner noreferrer"
          >
            <IconButton
              icon={LinkIcon}
              size="xs"
              name="View on Explorer"
              description="View on Explorer"
            />
          </Link>
          <IconButton
            icon={ArrowLeftOnRectangleIcon}
            onClick={async () => await disconnectWallet()}
            name="Disconnect"
            size="xs"
            description="Disconnect"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        {isLoadingBalance || data?.balance === undefined ? (
          <div className="flex items-center gap-2">
            <SkeletonText className="!w-24 mx-auto !h-7" />
            <span className="text-3xl font-medium h-7">XLM</span>
          </div>
        ) : (
          <p className="text-3xl font-medium whitespace-nowrap">
            {data?.formattedBalance} XLM
          </p>
        )}
        {/* TODO: show USD value */}
        {/* {isLoadingBalance || data?.formattedBalance === undefined ? (
          <SkeletonText className="!w-12 mx-auto" />
        ) : (
          <p className="font-medium text-slate-400">
            {formatUSD(Number(data?.formattedBalance))}
          </p>
        )} */}
      </div>
    </div>
  )
}
