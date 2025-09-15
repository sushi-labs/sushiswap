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
import { formatNumber, formatUSD } from 'sushi'
import { getKvmChainByKey } from 'sushi/kvm'
import { useKdaPrice } from '~kadena/_common/lib/hooks/use-kda-price'
import { useNativeTokenBalance } from '~kadena/_common/lib/hooks/use-native-token-balance'
import { truncateText } from '~kadena/_common/lib/utils/formatters'
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
      account: activeAccount?.accountName ?? '',
      enabled: true,
    })
  const { data: priceData, isLoading: isLoadingKdaPrice } = useKdaPrice()

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingPrice(false)
    }, 1000)
  }, [])

  const price = priceData?.priceUsd ?? 0

  const isLoading =
    isLoadingNativeTokenBalance || isLoadingPrice || isLoadingKdaPrice

  return (
    <div className="flex flex-col gap-8 p-4 w-full max-w-[280px]">
      <div className="flex gap-2 justify-between w-full">
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
        <div className="flex gap-1 items-center">
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
            href={getKvmChainByKey('kadena').getAccountUrl(
              activeAccount?.accountName ?? '',
            )}
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
      <div className="flex flex-col gap-2 justify-center items-center">
        {isLoading || !price || data?.balance === undefined ? (
          <div className="flex gap-2 items-center">
            <SkeletonText className="!w-24 mx-auto !h-7" />
            <span className="h-7 text-3xl font-medium">KDA</span>
          </div>
        ) : (
          <p className="text-3xl font-medium whitespace-nowrap">
            {formatNumber(data?.balance.toString())} KDA
          </p>
        )}
        {isLoading || !price || data?.balance === undefined ? (
          <SkeletonText className="!w-12 mx-auto" />
        ) : (
          <p className="font-medium text-slate-400">
            {formatUSD(data?.balance.mulHuman(price).toString())}
          </p>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground italic">
        Note: All transactions and balances are on Chain 2.
      </p>
    </div>
  )
}
