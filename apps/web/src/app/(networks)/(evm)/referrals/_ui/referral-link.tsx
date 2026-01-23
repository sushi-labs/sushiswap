'use client'

import { Fuul, UserIdentifierType } from '@fuul/sdk'
import { ClipboardCopyIcon } from '@heroicons/react-v1/outline'
import { ClipboardCheckIcon } from '@heroicons/react-v1/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import { Card, IconButton, classNames } from '@sushiswap/ui'
import { useCallback } from 'react'
import { useReferralLink } from 'src/lib/hooks/react-query/referrals'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount, useSignMessage } from 'wagmi'

export const ReferralLink = () => {
  const { address, isConnected } = useAccount()
  const [isCopied, staticCopy] = useCopyClipboard()
  const { signMessageAsync } = useSignMessage()

  const { data: referralLink } = useReferralLink({
    address,
    enabled: isConnected,
  })

  const handleAffiliateCode = useCallback(async () => {
    if (!address) return
    try {
      const affiliateCodeData = await Fuul.getAffiliateCode(
        address,
        UserIdentifierType.EvmAddress,
      )

      if (!affiliateCodeData) {
        const sig = await signMessageAsync({
          message: `I confirm that I am creating the ${address} code`,
        })

        await Fuul.createAffiliateCode({
          userIdentifier: address,
          identifierType: UserIdentifierType.EvmAddress,
          signature: sig,
          code: address,
        })

        const link = await Fuul.generateTrackingLink(
          `${window?.location?.origin}/ethereum/swap`,
          address,
          UserIdentifierType.EvmAddress,
        )
        staticCopy(link)
      } else {
        staticCopy(referralLink || '')
      }
    } catch (error) {
      console.error('Error handling affiliate code:', error)
    }
  }, [address, referralLink, signMessageAsync, staticCopy])

  return (
    <Card className="flex flex-col gap-4 md:flex-row items-start md:justify-between md:items-center w-full p-6 md:p-8">
      <div className="flex flex-col w-full">
        <p className="text-xl font-bold">
          Invite your network to join{' '}
          <span className="text-[#CE2AF6]">Sushi.</span>
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Earn points for every referral, plus a share of their swap volume.
        </p>
      </div>
      {!isConnected ? (
        <ConnectButton />
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-[500px]">
          <div className="relative rounded-full overflow-hidden w-full max-w-[500px] flex p-0.5">
            <div
              className={classNames(
                '!absolute inset-0 rounded-full h-ull w-full max-w-[500px]',
                'bg-gradient-to-r from-blue/50 to-pink/50',
              )}
            />
            <input
              type="text"
              placeholder="https://sushi.com/ethereum/swap?af="
              readOnly
              value={referralLink || ''}
              className="w-full max-w-[500px] bg-slate-50 dark:bg-slate-800 pr-9 font-medium py-2 pl-4 z-[11] bg-gradient-to-r from-blue/[5%] to-pink/[5%] border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <IconButton
              variant="ghost"
              name="Copy Referral Link"
              size="xs"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-[11]"
              onClick={async () => {
                handleAffiliateCode()
              }}
              iconProps={{ className: 'w-3 h-3' }}
              icon={isCopied ? ClipboardCheckIcon : ClipboardCopyIcon}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
