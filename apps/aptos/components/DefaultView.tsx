import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Cog6ToothIcon, DocumentDuplicateIcon, LinkIcon } from '@heroicons/react/24/outline'
import { ClipboardController } from '@sushiswap/ui/future/components/ClipboardController'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { JazzIcon } from '@sushiswap/ui'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import React, { Dispatch, SetStateAction } from 'react'
import { ProfileView } from './WalletSelector'
import { providerNetwork } from 'lib/constants'
interface Props {
  balance: number | undefined
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const DefaultView = ({ balance, setView }: Props) => {
  const { account, disconnect } = useWallet()

  let [big, portion] = (balance ? `${balance}` : '0.00').split('.')
  portion = portion ? portion.substring(0, 2) : ''
  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-between gap-3">
        <div className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-slate-200">
          {account?.address && <JazzIcon diameter={16} address={account?.address as string} />}
          <ClipboardController>
            {({ setCopied }) => (
              <span className="cursor-pointer" onClick={() => setCopied(account?.address as string)}>
                {`${account?.address.substring(0, 6)}...${account?.address.substring(66 - 4)}`}
              </span>
            )}
          </ClipboardController>
        </div>
        <div className="flex gap-5">
          <IconButton
            icon={Cog6ToothIcon}
            iconProps={{ width: 18, height: 18 }}
            onClick={() => setView(ProfileView.Settings)}
            description="Settings"
          />
          <ClipboardController hideTooltip>
            {({ setCopied, isCopied }) => (
              <IconButton
                icon={DocumentDuplicateIcon}
                iconProps={{ width: 18, height: 18 }}
                onClick={() => setCopied(account?.address as string)}
                description={isCopied ? 'Copied!' : 'Copy Address'}
              />
            )}
          </ClipboardController>

          <IconButton
            icon={LinkIcon}
            iconProps={{ width: 18, height: 18 }}
            as="a"
            target="_blank"
            href={`https://explorer.aptoslabs.com/account/${account?.address}?network=${providerNetwork}`}
            description="View on Explorer"
          />
          <IconButton
            icon={ArrowLeftOnRectangleIcon}
            iconProps={{ width: 18, height: 18 }}
            onClick={disconnect}
            description="Disconnect"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-3xl font-medium whitespace-nowrap">
          {big}
          {portion && <>.{portion}</>} APT
        </p>
        <p className="font-medium text-slate-400">$0.00</p>
      </div>
    </div>
  )
}
