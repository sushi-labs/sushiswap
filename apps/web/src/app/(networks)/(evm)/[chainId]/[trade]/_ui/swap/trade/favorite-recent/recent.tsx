import { ArrowRightIcon } from '@heroicons/react-v1/solid'
// import {
//   type RecentSwap,
//   TokenListV2ChainIds,
//   isTokenListV2ChainId,
// } from '@sushiswap/graph-client/data-api'
import { useBreakpoint } from '@sushiswap/hooks'
import {
  Collapsible,
  Currency,
  Popover,
  PopoverContent,
  PopoverTrigger,
  // SkeletonBox,
  // SkeletonCircle,
  classNames,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo, useState } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
// import { NativeAddress } from 'src/lib/constants'
import {
  captializeFirstLetter,
  getChangeSign,
  getTextColor,
} from 'src/lib/helpers'
import {
  type LocalRecentSwap,
  filterLocalRecentSwapsByAccountAndChainIds,
  useLocalRecentSwaps,
} from 'src/lib/hooks/react-query/recent-swaps/useLocalRecentSwaps'
// import { useRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
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
    if (selectedNetwork) {
      return [selectedNetwork]
    }
    return [...SUPPORTED_CHAIN_IDS]
  }, [selectedNetwork])

  const { data: localRecentSwaps } = useLocalRecentSwaps()

  const recentSwaps = useMemo(() => {
    if (!address) return []
    if (!localRecentSwaps || localRecentSwaps?.length === 0) return []
    return filterLocalRecentSwapsByAccountAndChainIds({
      swaps: localRecentSwaps,
      account: address,
      chainIds,
    })
  }, [address, chainIds, localRecentSwaps])

  //@dev localRecentSwap does not have PnL data
  //data provider is not fully ready to have this data for us
  // const {
  //   data: recentSwaps,
  //   isLoading,
  //   isError,
  // } = useRecentSwaps({
  //   walletAddress: address,
  //   chainIds: chainIds,
  // })

  if (!address) {
    return <ConnectButton className="w-full" variant="secondary" />
  }

  // if (!isLoading && isError) {
  //   return (
  //     <p className="my-8 text-sm italic text-center text-red-500">
  //       An error occurred while fetching recent swaps. Please try again.
  //     </p>
  //   )
  // }

  if (recentSwaps?.length === 0) {
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
        <div className="w-full font-medium  text-left whitespace-nowrap">
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
      <div className="grid w-full grid-cols-5 col-span-5 gap-2 max-h-[300px] overflow-y-auto">
        {recentSwaps?.map((recentSwap, idx) => (
          <RecentItem
            onClose={onClose}
            key={`${idx}_${recentSwap?.timestamp}`}
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
}: { recentSwap: LocalRecentSwap; onClose?: () => void }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isLg } = useBreakpoint('lg')
  const { token0, token1 } = recentSwap

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
                token0.type === 'native'
                  ? EvmNative.fromChainId(token0.chainId)
                  : new EvmToken({
                      address: token0.address,
                      name: token0.name,
                      symbol: token0.symbol,
                      chainId: token0.chainId,
                      decimals: token0.decimals,
                    })
              }
              width={24}
              height={24}
            />
            <Currency.Icon
              disableLink
              currency={
                token1.type === 'native'
                  ? EvmNative.fromChainId(token1.chainId)
                  : new EvmToken({
                      address: token1.address,
                      name: token1.name,
                      symbol: token1.symbol,
                      chainId: token1.chainId,
                      decimals: token1.decimals,
                    })
              }
              width={24}
              height={24}
            />
          </Currency.IconList>

          <span className="text-xs font-medium text-slate-900 dark:text-pink-100">
            {token0.symbol}/{token1.symbol}
          </span>

          {isHovered ? (
            <div className="flex items-center">
              <span className="pr-0.5">(</span>
              <NetworkIcon
                type="square"
                chainId={token0.chainId}
                width={16}
                height={16}
                className="rounded-[3px]"
              />
              <ArrowRightIcon className="w-3 h-3 mx-1 text-slate-500" />
              <NetworkIcon
                type="square"
                chainId={token1.chainId}
                width={16}
                height={16}
                className="rounded-[3px]"
              />
              <span className="pl-0.5">)</span>
            </div>
          ) : null}
        </div>

        {isHovered && isLg ? (
          <ActionButtons onClose={onClose} recentSwap={recentSwap} />
        ) : isHovered && !isLg ? null : (
          <>
            <div className="text-left pl-2.5">
              <span className="font-medium text-slate-900 dark:text-pink-100">
                {formatUSD(recentSwap?.amount1USD ?? 0)}
              </span>
            </div>
            <div className="w-full col-span-1 ml-auto text-right">
              <span
                className={classNames(
                  'font-medium',
                  //@dev localRecentSwap does not have PnL data
                  //data provider is not fully ready to have this data for us
                  // getTextColor(recentSwap?.totalPnl),
                  getTextColor(0),
                )}
              >
                {/* {getChangeSign(recentSwap?.totalPnl)} */}
                {getChangeSign(0)}
                {/* {formatUSD(recentSwap?.totalPnl)} */}
                {'-'}
              </span>
            </div>
          </>
        )}
        {isHovered && !isLg ? (
          <div className="col-span-5 pt-4">
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
}: { recentSwap: LocalRecentSwap; onClose?: () => void }) => {
  const { handleTokenInput, handleTokenOutput } = useSwapTokenSelect()
  const { token0 } = recentSwap
  return (
    <div className="flex items-center justify-end w-full col-span-5 gap-2 lg:col-span-2">
      <Button
        onClick={async () => {
          await handleTokenOutput({
            token:
              token0.type === 'native'
                ? EvmNative.fromChainId(token0.chainId)
                : new EvmToken({
                    address: token0.address,
                    name: token0.name,
                    symbol: token0.symbol,
                    chainId: token0.chainId,
                    decimals: token0.decimals,
                  }),
          })
          onClose?.()
        }}
        size="xs"
        className="text-slate-50 w-full lg:w-fit !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500 !min-h-[24px] !h-[24px]"
      >
        BUY {recentSwap.token0.symbol}
      </Button>

      <Button
        onClick={async () => {
          await handleTokenInput({
            token:
              token0.type === 'native'
                ? EvmNative.fromChainId(token0.chainId)
                : new EvmToken({
                    address: token0.address,
                    name: token0.name,
                    symbol: token0.symbol,
                    chainId: token0.chainId,
                    decimals: token0.decimals,
                  }),
          })
          onClose?.()
        }}
        size="xs"
        className="text-slate-50 w-full lg:w-fit bg-red-100 !rounded-full font-semibold hover:bg-red-100 active:bg-red-100/95 focus:bg-red-500 !min-h-[24px] !h-[24px]"
      >
        SELL {recentSwap.token0.symbol}
      </Button>
    </div>
  )
}

//@dev currently unused; keeping it here for when useRecentSwaps provides PnL data and skeleton is needed
// const RecentSwapSkeleton = () => {
//   return (
//     <div
//       className={classNames(
//         'text-xs grid col-span-5 grid-cols-5 p-2 transition-colors rounded-md items-center',
//       )}
//     >
//       <div className="flex items-center w-full col-span-3 gap-2">
//         <Currency.IconList
//           iconWidth={24}
//           iconHeight={24}
//           className="border-none"
//         >
//           <SkeletonCircle radius={24} />
//           <SkeletonCircle radius={24} />
//         </Currency.IconList>
//         <SkeletonBox className="w-12 h-4 rounded-md" />
//       </div>
//       <SkeletonBox className="w-12 h-4 rounded-md" />
//       <SkeletonBox className="w-10 h-4 col-span-1 ml-auto rounded-md" />
//     </div>
//   )
// }
