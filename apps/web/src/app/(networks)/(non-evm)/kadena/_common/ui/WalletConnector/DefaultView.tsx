import {
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { ClipboardController, IconButton, SkeletonText } from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import Link from 'next/link'
import type { Dispatch, SetStateAction } from 'react'
import { formatNumber, formatUSD, truncateString } from 'sushi'
import { getKvmChainByKey } from 'sushi/kvm'
import { useKdaPrice } from '~kadena/_common/lib/hooks/use-kda-price'
import { useNativeTokenBalance } from '~kadena/_common/lib/hooks/use-native-token-balance'
import { useKadena } from '~kadena/kadena-wallet-provider'
import type { IProfileView } from './WalletConnector'

type DefaultViewProps = {
  setView: Dispatch<SetStateAction<IProfileView>>
}

export const DefaultView = ({ setView }: DefaultViewProps) => {
  const { handleDisconnect } = useKadena()
  const { activeAccount } = useKadena()
  const {
    data,
    isLoading: isLoadingNativeTokenBalance,
    error: balanceError,
  } = useNativeTokenBalance({
    account: activeAccount?.accountName ?? '',
    enabled: true,
  })
  const {
    data: priceData,
    isLoading: isLoadingKdaPrice,
    error: priceError,
  } = useKdaPrice()

  const price = priceData?.priceUsd ?? 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <IconButton
            icon={Cog6ToothIcon}
            onClick={() => setView('settings')}
            name="Settings"
            description="Settings"
            size="sm"
          />
          <ClipboardController hideTooltip>
            {({ setCopied }) => (
              <IconButton
                icon={DocumentDuplicateIcon}
                onClick={() => setCopied(activeAccount?.accountName ?? '')}
                name={'Copy Address'}
                description={'Copy Address'}
                size="sm"
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
              size="sm"
              name="View on Explorer"
              description="View on Explorer"
            />
          </Link>
          <IconButton
            icon={ArrowLeftOnRectangleIcon}
            onClick={handleDisconnect}
            name="Disconnect"
            size="sm"
            description="Disconnect"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        {!isLoadingNativeTokenBalance && balanceError ? (
          <p className="text-[10px] text-red italic text-center">
            {balanceError?.message}
          </p>
        ) : isLoadingNativeTokenBalance ||
          !price ||
          data?.balance === undefined ? (
          <div className="flex gap-2 items-center">
            <SkeletonText className="!w-24 mx-auto !h-7" />
            <span className="h-7 text-3xl font-medium">KDA</span>
          </div>
        ) : (
          <p className="text-3xl font-medium whitespace-nowrap">
            {formatNumber(data?.balance.toString())} KDA
          </p>
        )}
        {!isLoadingKdaPrice && priceError ? (
          <p className="text-[10px] text-red italic text-center">
            {priceError?.message}
          </p>
        ) : isLoadingKdaPrice || !price || data?.balance === undefined ? (
          <SkeletonText className="!w-12 mx-auto" />
        ) : (
          <p className="font-medium text-slate-400">
            {formatUSD(data?.balance.mulHuman(price).toString())}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground italic">
          Note: All transactions and balances are on Chain 2.
        </p>
      </div>
    </div>
  )
}
