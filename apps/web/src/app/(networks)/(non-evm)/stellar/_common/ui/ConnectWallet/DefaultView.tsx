import {
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import {
  ClipboardController,
  IconButton,
  List,
  SkeletonText,
} from '@sushiswap/ui'
import { JazzIcon } from '@sushiswap/ui/icons/JazzIcon'
import Link from 'next/link'
import React, { type Dispatch, type SetStateAction } from 'react'
import { useTokenBalances } from '~stellar/_common/lib/hooks/token/use-token-balance'
import { useXlmBalance } from '~stellar/_common/lib/hooks/token/use-xlm-balance'
import { getBaseTokens } from '~stellar/_common/lib/soroban/token-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'
import {
  formatAddress,
  formatTokenBalance,
} from '~stellar/_common/lib/utils/formatters'
import { getStellarAddressLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { useStellarWallet } from '~stellar/providers'
import type { IProfileView } from './ConnectWalletButton'

type DefaultViewProps = {
  setView: Dispatch<SetStateAction<IProfileView>>
}

export const DefaultView = ({ setView }: DefaultViewProps) => {
  const { connectedAddress, disconnectWallet } = useStellarWallet()
  const { data, isLoading: isLoadingBalance } = useXlmBalance()

  // Get base tokens (excluding XLM since we show it separately)
  const baseTokens: Token[] = getBaseTokens().filter(
    (token: Token) => token.code !== 'XLM',
  )
  const { data: tokenBalances, isLoading: isLoadingTokens } = useTokenBalances(
    connectedAddress,
    baseTokens,
  )

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
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

      {/* XLM Balance Section */}
      <div className="flex flex-col gap-2 justify-center items-center py-2">
        {isLoadingBalance ? (
          <div className="flex items-center gap-2">
            <SkeletonText className="!w-24 mx-auto !h-7" />
            <span className="text-3xl font-medium h-7">XLM</span>
          </div>
        ) : data?.formattedBalance && data.formattedBalance !== '-' ? (
          <p className="text-3xl font-medium whitespace-nowrap">
            {data.formattedBalance} XLM
          </p>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="text-3xl font-medium whitespace-nowrap">0.00 XLM</p>
            <p className="text-xs text-muted-foreground">
              Unable to fetch balance
            </p>
          </div>
        )}
      </div>

      {/* Token Balances Section */}
      {tokenBalances && tokenBalances.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 px-2">
            Token Balances
          </span>
          <List className="!p-0">
            <List.Control className="bg-gray-50 dark:bg-gray-900/50">
              {isLoadingTokens ? (
                <div className="p-4 flex justify-center">
                  <SkeletonText className="!w-32" />
                </div>
              ) : (
                tokenBalances
                  .filter((token) => token.balance > 0n)
                  .map((token) => (
                    <List.KeyValue
                      key={token.contract}
                      title={token.code}
                      className="!py-2"
                    >
                      <span className="text-sm font-medium">
                        {formatTokenBalance(token.balance, token)}
                      </span>
                    </List.KeyValue>
                  ))
              )}
              {!isLoadingTokens &&
                tokenBalances.filter((t) => t.balance > 0n).length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No token balances found
                  </div>
                )}
            </List.Control>
          </List>
        </div>
      )}
    </div>
  )
}
