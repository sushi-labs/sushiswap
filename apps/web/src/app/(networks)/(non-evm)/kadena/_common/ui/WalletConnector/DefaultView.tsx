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
import { useNativeTokenBalance } from '~kadena/_common/lib/hooks/use-native-token-balance'
import { truncateText } from '~kadena/_common/lib/utils/formatters'
import { getChainwebAddressLink } from '~kadena/_common/lib/utils/kadena-helpers'
import { useKadena } from '~kadena/kadena-wallet-provider'
import type { IProfileView } from './WalletConnector'

type DefaultViewProps = {
  setView: Dispatch<SetStateAction<IProfileView>>
}

export const DefaultView = ({ setView }: DefaultViewProps) => {
  const { handleDisconnect } = useKadena()
  const { activeAccount } = useKadena()
  const [isLoadingPrice, setIsLoadingPrice] = useState(true)
  const { data, isLoading: isLoadingNativeTokenBalance } =
    useNativeTokenBalance({
      account: activeAccount.accountName,
      enabled: true,
    })

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingPrice(false)
    }, 1000)
  }, [])

  const price = '0.68'

  const isLoading = isLoadingNativeTokenBalance || isLoadingPrice

  return (
    <div className="flex flex-col w-full gap-8 p-4">
      <div className="flex justify-between w-full gap-2">
        <div className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-slate-200">
          {activeAccount?.accountName && (
            <JazzIcon diameter={16} address={activeAccount.accountName} />
          )}
          <ClipboardController>
            {({ setCopied }) => (
              <span
                onKeyDown={() => setCopied(activeAccount?.accountName ?? '')}
                className="cursor-pointer"
                onClick={() => setCopied(activeAccount?.accountName ?? '')}
              >
                {truncateText(activeAccount?.accountName ?? '')}
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
                onClick={() => setCopied(activeAccount?.accountName ?? '')}
                name={'Copy Address'}
                description={'Copy Address'}
                size="xs"
              />
            )}
          </ClipboardController>
          <Link
            href={getChainwebAddressLink(activeAccount?.accountName ?? '')}
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
            onClick={handleDisconnect}
            name="Disconnect"
            size="xs"
            description="Disconnect"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        {isLoading || !price || data?.balance === undefined ? (
          <div className="flex items-center gap-2">
            <SkeletonText className="!w-24 mx-auto !h-7" />
            <span className="text-3xl font-medium h-7">KDA</span>
          </div>
        ) : (
          <p className="text-3xl font-medium whitespace-nowrap">
            {formatNumber(data?.balance)} KDA
          </p>
        )}
        {isLoading || !price || data?.balance === undefined ? (
          <SkeletonText className="!w-12 mx-auto" />
        ) : (
          <p className="font-medium text-slate-400">
            {formatUSD(Number(price) * data?.balance)}
          </p>
        )}
      </div>
    </div>
  )
}
