import { ArrowRightIcon } from '@heroicons/react-v1/solid'
import {
  type RecentSwap,
  TokenListV2ChainIds,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Collapsible,
  Currency,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SkeletonBox,
  SkeletonCircle,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo, useState } from 'react'
import { NativeAddress } from 'src/lib/constants'
import {
  captializeFirstLetter,
  getChangeSign,
  getTextColor,
} from 'src/lib/helpers'
import { useRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { useSwapTokenSelect } from 'src/lib/hooks/useTokenSelect'
import { getNetworkKey } from 'src/lib/network'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { formatUSD } from 'sushi'
import { EvmNative, EvmToken } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useNetworkContext } from './network-provider'

export const Recent = ({ onClose }: { onClose?: () => void }) => {
  const { address } = useAccount()
  const {
    state: { selectedNetwork },
  } = useNetworkContext()

  const chainIds = useMemo(() => {
    if (selectedNetwork && isTokenListV2ChainId(selectedNetwork)) {
      return [selectedNetwork]
    }
    return [...TokenListV2ChainIds]
  }, [selectedNetwork])

  const {
    data: recentSwaps,
    isLoading,
    isError,
  } = useRecentSwaps({
    walletAddress: address,
    chainIds: chainIds,
  })

  if (!address) {
    return <ConnectButton className="w-full" variant="secondary" />
  }

  if (!isLoading && isError) {
    return (
      <p className="my-8 text-sm italic text-center text-red-500">
        An error occurred while fetching recent swaps. Please try again.
      </p>
    )
  }

  if (recentSwaps?.length === 0 && !isLoading && !isError) {
    return (
      <p className="my-8 text-sm italic text-center text-muted-foreground dark:text-pink-200">
        You haven&apos;t traded any tokens so far
        {selectedNetwork
          ? ` on ${captializeFirstLetter(getNetworkKey(selectedNetwork))}`
          : ''}
        .
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 col-span-3 gap-0">
      <div className="sticky top-0 z-[19  ] grid grid-cols-5 col-span-5 text-xs bg-white lg:bg-slate-50 dark:bg-slate-900 lg:dark:bg-slate-800 text-slate-700 dark:text-pink-100">
        <div className="w-full col-span-3 pl-2 font-medium">Token Pair</div>
        <div className="w-full font-medium text-left whitespace-nowrap">
          Amount Traded
        </div>
        <div className="w-full col-span-1 pr-2 font-medium text-right">
          <Popover>
            <PopoverTrigger asChild>
              <span className="underline cursor-pointer decoration-dotted">
                PnL
              </span>
            </PopoverTrigger>

            <PopoverContent
              side="left"
              sideOffset={8}
              className="border-black/5 dark:border-white/10 !rounded-md bg-white/20 dark:bg-black/20"
            >
              <div className="max-w-[250px] px-1 py-2 text-black dark:text-pink-100 text-sm">
                Profit or loss calculated as the difference in USD value of the
                asset on the day it was bought and the day it was sold.
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid w-full grid-cols-5 col-span-5 gap-2">
        {isLoading
          ? Array(3)
              .fill(null)
              .map((_, index) => <RecentSwapSkeleton key={index} />)
          : recentSwaps?.map((recentSwap, idx) => (
              <RecentItem
                onClose={onClose}
                key={`${idx}_${recentSwap?.time}`}
                recentSwap={recentSwap}
              />
            ))}
      </div>
    </div>
  )
}

const RecentItem = ({
  recentSwap,
  onClose,
}: { recentSwap: RecentSwap; onClose?: () => void }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isMd } = useBreakpoint('md')
  const { tokenIn, tokenOut } = recentSwap

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
        <div className="flex items-center w-full col-span-3 gap-2">
          <Currency.IconList
            iconWidth={24}
            iconHeight={24}
            className="border-none"
          >
            <Currency.Icon
              disableLink
              currency={
                tokenIn.address === NativeAddress
                  ? // @TODO remove typecast once chainId type is resolved
                    EvmNative.fromChainId(tokenIn.chainId)
                  : new EvmToken({
                      address: tokenIn.address,
                      name: tokenIn.name,
                      symbol: tokenIn.symbol,
                      chainId: tokenIn.chainId,
                      decimals: tokenIn.decimals,

                      metadata: {
                        approved: tokenIn.approved,
                      },
                    })
              }
              width={24}
              height={24}
            />
            <Currency.Icon
              disableLink
              currency={
                tokenOut.address === NativeAddress
                  ? EvmNative.fromChainId(tokenOut.chainId)
                  : new EvmToken({
                      address: tokenOut.address,
                      name: tokenOut.name,
                      symbol: tokenOut.symbol,
                      chainId: tokenOut.chainId,
                      decimals: tokenOut.decimals,
                      metadata: {
                        approved: tokenOut.approved,
                      },
                    })
              }
              width={24}
              height={24}
            />
          </Currency.IconList>

          <span className="text-xs font-medium text-slate-900 dark:text-pink-100">
            {tokenIn.symbol}/{tokenOut.symbol}
          </span>

          {isHovered ? (
            <div className="flex items-center">
              <span className="pr-0.5">(</span>
              <NetworkIcon
                type="square"
                chainId={tokenIn.chainId}
                width={16}
                height={16}
                className="rounded-[3px]"
              />
              <ArrowRightIcon className="w-3 h-3 mx-1 text-slate-500" />
              <NetworkIcon
                type="square"
                chainId={tokenOut.chainId}
                width={16}
                height={16}
                className="rounded-[3px]"
              />
              <span className="pl-0.5">)</span>
            </div>
          ) : null}
        </div>

        {isHovered && isMd ? (
          <ActionButtons onClose={onClose} recentSwap={recentSwap} />
        ) : isHovered && !isMd ? null : (
          <>
            <div className="text-left pl-0.5">
              <span className="font-medium text-slate-900 dark:text-pink-100">
                {formatUSD(recentSwap?.amountOutUSD)}
              </span>
            </div>
            <div className="w-full col-span-1 ml-auto text-right">
              <span
                className={classNames(
                  'font-medium',
                  getTextColor(recentSwap?.totalPnl),
                )}
              >
                {getChangeSign(recentSwap?.totalPnl)}
                {formatUSD(recentSwap?.totalPnl)}
              </span>
            </div>
          </>
        )}
        {isHovered && !isMd ? (
          <div className="col-span-5 mt-2">
            <Collapsible open={isHovered}>
              <div className="grid w-full grid-cols-5 col-span-5 gap-2">
                <ActionButtons onClose={onClose} recentSwap={recentSwap} />
              </div>
            </Collapsible>
          </div>
        ) : null}
      </div>
    </>
  )
}

const ActionButtons = ({
  recentSwap,
  onClose,
}: { recentSwap: RecentSwap; onClose?: () => void }) => {
  const { handleTokenInput, handleTokenOutput } = useSwapTokenSelect()

  return (
    <div className="flex items-center justify-end w-full col-span-5 gap-2 lg:col-span-2">
      <Button
        onClick={async () => {
          await handleTokenOutput({
            token: new EvmToken({
              chainId: recentSwap.tokenIn.chainId,
              address: recentSwap.tokenIn.address,
              decimals: recentSwap.tokenIn.decimals,
              symbol: recentSwap.tokenIn.symbol,
              name: recentSwap.tokenIn.name,
            }),
          })
          onClose?.()
        }}
        size="xs"
        className="text-slate-50 w-full lg:w-fit !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500"
      >
        BUY {recentSwap.tokenIn.symbol}
      </Button>

      <Button
        onClick={async () => {
          await handleTokenInput({
            token: new EvmToken({
              chainId: recentSwap.tokenIn.chainId,
              address: recentSwap.tokenIn.address,
              decimals: recentSwap.tokenIn.decimals,
              symbol: recentSwap.tokenIn.symbol,
              name: recentSwap.tokenIn.name,
            }),
          })
          onClose?.()
        }}
        size="xs"
        className="text-slate-50 w-full lg:w-fit bg-red-100 !rounded-full font-semibold hover:bg-red-100 active:bg-red-100/95 focus:bg-red-500"
      >
        SELL {recentSwap.tokenIn.symbol}
      </Button>
    </div>
  )
}

const RecentSwapSkeleton = () => {
  return (
    <div
      className={classNames(
        'text-xs grid col-span-5 grid-cols-5 p-2 transition-colors rounded-md items-center',
      )}
    >
      <div className="flex items-center w-full col-span-3 gap-2">
        <Currency.IconList
          iconWidth={24}
          iconHeight={24}
          className="border-none"
        >
          <SkeletonCircle radius={24} />
          <SkeletonCircle radius={24} />
        </Currency.IconList>
        <SkeletonBox className="w-12 h-4 rounded-md" />
      </div>
      <SkeletonBox className="w-12 h-4 rounded-md" />
      <SkeletonBox className="w-10 h-4 col-span-1 ml-auto rounded-md" />
    </div>
  )
}
