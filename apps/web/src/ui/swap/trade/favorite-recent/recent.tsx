import { ArrowRightIcon } from '@heroicons/react-v1/solid'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Collapsible,
  Currency,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useState } from 'react'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { formatUSD } from 'sushi'
import { Token } from 'sushi/currency'
import { useAccount } from 'wagmi'

export const Recent = () => {
  const { address } = useAccount()

  if (!address) {
    return <ConnectButton className="w-full" variant="secondary" />
  }

  // if(recents.length === 0) {
  // return (

  // 		<p className="italic text-sm text-muted-foreground mt-8 dark:text-pink-200">
  // 			You haven&apos;t traded any tokens so far.
  // 		</p>
  // );
  // }

  return (
    <div className="grid grid-cols-3 col-span-3 gap-0">
      <div className="sticky grid col-span-5 grid-cols-5 top-0 z-20 bg-white md:bg-slate-50 dark:bg-slate-900 md:dark:bg-slate-800 text-xs text-slate-700 dark:text-pink-100">
        <div className="font-medium w-full col-span-3 pl-2">Token Pair</div>
        <div className="font-medium text-left w-full whitespace-nowrap">
          Amount Traded
        </div>
        <div className="font-medium pr-2 col-span-1 w-full text-right">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <span className="decoration-dotted cursor-default underline">
                  PnL
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                sideOffset={8}
                className="border-black/5 dark:border-white/10 !rounded-md bg-white/20 dark:bg-black/20"
              >
                <div className="max-w-[250px] px-1 py-2 text-black dark:text-pink-100 text-sm">
                  Profit or loss calculated as the difference in USD value of
                  the asset on the day it was bought and the day it was sold.
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="grid grid-cols-5 col-span-5 gap-2 w-full">
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
        <RecentItem />
      </div>
    </div>
  )
}

const RecentItem = () => {
  const [isHovered, setIsHovered] = useState(false)
  const { isMd } = useBreakpoint('md')

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={classNames(
          'text-xs grid col-span-5 grid-cols-5 p-2 transition-colors rounded-md items-center',
          isHovered ? 'bg-blue-550/10' : '',
        )}
      >
        <div className="flex items-center gap-2 w-full col-span-3">
          <Currency.IconList iconWidth={32} iconHeight={32}>
            <Currency.Icon
              disableLink
              currency={
                new Token({
                  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                  name: 'Wrapped Ethereum',
                  symbol: 'ETH',
                  chainId: 1,
                  decimals: 18,
                })
              }
              width={32}
              height={32}
            />
            <Currency.Icon
              disableLink
              currency={
                new Token({
                  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                  name: 'USD Coin',
                  symbol: 'USDC',
                  chainId: 1,
                  decimals: 6,
                })
              }
              width={32}
              height={32}
            />
          </Currency.IconList>

          <span className="text-slate-900 text-sm font-medium dark:text-pink-100">
            ETH/USDC
          </span>

          {isHovered ? (
            <div className="flex items-center">
              <span>(</span>
              <NetworkIcon chainId={1} width={16} height={16} />
              <ArrowRightIcon className="w-3 h-3 mx-1 text-slate-500" />
              <NetworkIcon chainId={56} width={16} height={16} />
              <span>)</span>
            </div>
          ) : null}
        </div>

        {isHovered && isMd ? (
          <ActionButtons />
        ) : isHovered && !isMd ? null : (
          <>
            <div className="text-left pl-0.5">
              <span className="text-slate-900 font-medium dark:text-pink-100">
                {formatUSD(0.87)}
              </span>
            </div>
            <div className="ml-auto col-span-1 w-full text-right">
              <span className="font-medium text-green">+5.5%</span>
            </div>
          </>
        )}
        {isHovered && !isMd ? (
          <div className="col-span-5 mt-2">
            <Collapsible open={isHovered}>
              <div className="grid col-span-5 grid-cols-5 gap-2 w-full">
                <ActionButtons />
              </div>
            </Collapsible>
          </div>
        ) : null}
      </div>
    </>
  )
}

const ActionButtons = () => {
  return (
    <div className="flex items-center w-full gap-2 col-span-5 md:col-span-2 justify-end">
      <Button
        size="xs"
        className="text-slate-50 w-full md:w-fit !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500"
      >
        BUY ETH
      </Button>

      <Button
        size="xs"
        className="text-slate-50 w-full md:w-fit bg-red-100 !rounded-full font-semibold hover:bg-red-100 active:bg-red-100/95 focus:bg-red-500"
      >
        SELL ETH
      </Button>
    </div>
  )
}
