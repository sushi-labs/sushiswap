import {
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { ClipboardController, IconButton, SkeletonText } from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import Link from 'next/link'
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { formatNumber, formatUSD } from 'sushi/format'
import { truncateText } from '~kadena/_common/lib/utils/formatters'
import { getChainwebAddressLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { useWalletAdaptersContext } from '~kadena/wallet-adapters-provider'
import { useWalletState } from '~kadena/wallet-provider'
import type { IProfileView } from './WalletConnector'

type DefaultViewProps = {
  setView: Dispatch<SetStateAction<IProfileView>>
}

export const DefaultView = ({ setView }: DefaultViewProps) => {
  const { disconnect } = useWalletAdaptersContext()
  const { account } = useWalletState()
  const [isLoadingPrice, setIsLoadingPrice] = useState(true)
  const [isLoadingBalance, setIsLoadingBalance] = useState(true)

  const data = {
    formattedBalance: 0.123,
    balance: 0.123,
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingPrice(false)
      setIsLoadingBalance(false)
    }, 1000)
  }, [])

  const price = '0.123'

  const isLoading = isLoadingBalance || isLoadingPrice

  return (
    <div className="flex flex-col gap-8 p-4 w-full">
      <div className="flex justify-between gap-2 w-full">
        <div className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-slate-200">
          {account && <JazzIcon diameter={16} address={account} />}
          <ClipboardController>
            {({ setCopied }) => (
              <span
                onKeyDown={() => setCopied(account ?? '')}
                className="cursor-pointer"
                onClick={() => setCopied(account ?? '')}
              >
                {truncateText(account ?? '')}
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
                onClick={() => setCopied(account ?? '')}
                name={'Copy Address'}
                description={'Copy Address'}
                size="xs"
              />
            )}
          </ClipboardController>
          <Link
            href={getChainwebAddressLink(account ?? '')}
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
            onClick={disconnect}
            name="Disconnect"
            size="xs"
            description="Disconnect"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        {isLoading || !price || data?.formattedBalance === undefined ? (
          <div className="flex items-center gap-2">
            <SkeletonText className="!w-24 mx-auto !h-7" />
            <span className="text-3xl font-medium h-7">KDA</span>
          </div>
        ) : (
          <p className="text-3xl font-medium whitespace-nowrap">
            {formatNumber(data?.formattedBalance)} KDA
          </p>
        )}
        {isLoading || !price || data?.formattedBalance === undefined ? (
          <SkeletonText className="!w-12 mx-auto" />
        ) : (
          <p className="font-medium text-slate-400">
            {formatUSD(Number(price) * data?.formattedBalance)}
          </p>
        )}
      </div>
    </div>
  )
}
