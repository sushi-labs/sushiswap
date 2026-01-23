'use client'

import { Fuul } from '@fuul/sdk'
import { ClipboardCopyIcon } from '@heroicons/react-v1/outline'
import { ClipboardCheckIcon } from '@heroicons/react-v1/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import { Card, IconButton, LinkExternal, classNames } from '@sushiswap/ui'
import { XIcon } from '@sushiswap/ui/icons/XIcon'
import { useReferralLink } from 'src/lib/hooks/react-query/referrals'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'wagmi'

Fuul.init({ apiKey: process.env.NEXT_PUBLIC_FUUL_API_KEY as string })

// const getTweetIntent = (referralLink: string) => {
//   const url = encodeURIComponent(referralLink)
//   const text = encodeURIComponent('Join SushiSwap and start earning!')
//   return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
// }

export const ReferralLink = () => {
  const { address, isConnected } = useAccount()
  const [isCopied, staticCopy] = useCopyClipboard()

  const { data: referralLink } = useReferralLink({
    address,
    enabled: isConnected,
  })

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
                staticCopy(referralLink || '')
              }}
              iconProps={{ className: 'w-3 h-3' }}
              icon={isCopied ? ClipboardCheckIcon : ClipboardCopyIcon}
            />
          </div>

          {/* <div className="flex items-center gap-1 pl-1">
            <p className="text-sm">Share on</p>
            <div className="flex items-center gap-2">
              <LinkExternal href={getTweetIntent(referralLink || '')}>
                <IconButton
                  name="Share on Twitter"
                  variant="secondary"
                  size="sm"
                  icon={XIcon}
                />
              </LinkExternal>
            </div>
          </div> */}
        </div>
      )}
    </Card>
  )
}
