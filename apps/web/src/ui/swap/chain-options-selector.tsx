import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  SUPPORTED_CHAIN_IDS,
  TWAP_SUPPORTED_CHAIN_IDS,
  XSWAP_SUPPORTED_CHAIN_IDS,
  getSortedChainIds,
} from 'src/config'
import { useIsCrossChain } from 'src/lib/hooks/useIsCrossChain'
import { useTradeMode } from 'src/lib/hooks/useTradeMode'
import { EvmChainKey } from 'sushi'
import type { EvmChainId } from 'sushi/chain'

export const ChainOptionsSelector = ({
  size = 'sm',
  networks,
  onNetworkSelect,
}: {
  size?: 'sm' | 'lg'
  networks?: number[]
  onNetworkSelect?: (network: number) => void
}) => {
  const { isCrossChain } = useIsCrossChain()
  const { tradeMode } = useTradeMode()

  const defaultNetworks =
    tradeMode === 'dca' || tradeMode === 'limit'
      ? getSortedChainIds(TWAP_SUPPORTED_CHAIN_IDS)
      : tradeMode === 'fiat'
        ? getSortedChainIds(SUPPORTED_CHAIN_IDS)
        : isCrossChain
          ? getSortedChainIds(XSWAP_SUPPORTED_CHAIN_IDS)
          : getSortedChainIds(SUPPORTED_CHAIN_IDS)

  const iconSize = size === 'sm' ? 16 : 24
  const _networks = networks ?? defaultNetworks

  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const gapPx = 6
    const iconWidth = size === 'sm' ? 26 : 34
    const slotWidth = iconWidth + gapPx

    const containerWidth = container.clientWidth - 6
    const rawFit = Math.floor(containerWidth / slotWidth)

    // reserve one slot for the overflow-menu button if we actually have overflow
    const fitCount =
      rawFit < _networks.length && rawFit > 0 ? rawFit - 1 : rawFit

    setVisibleCount(fitCount)
  }, [size, _networks])

  useLayoutEffect(() => {
    if (!containerRef.current) return

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(containerRef.current)

    const onResize = () => requestAnimationFrame(measure)

    window.addEventListener('resize', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [measure])

  const { visible, overflow } = useMemo(() => {
    const visible = _networks.slice(0, visibleCount)
    const overflow = _networks.slice(visibleCount)
    return {
      visible,
      overflow,
    }
  }, [visibleCount, _networks])

  return (
    <div className="flex items-center gap-x-1.5 w-full" ref={containerRef}>
      {visible.map((chainId) => (
        <TooltipProvider key={chainId}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <NetworkButton
                tabIndex={-1}
                onClick={() => onNetworkSelect?.(chainId)}
                iconSize={iconSize}
                chainId={chainId}
              />
            </TooltipTrigger>
            <TooltipContent className="border-black/5 dark:border-white/5 !rounded-md bg-white/20 dark:bg-black/20">
              {EvmChainKey[chainId as EvmChainId].toLocaleUpperCase()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {overflow.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={classNames(
                'border border-black/10  dark:border-white/10 rounded-md p-1 flex items-center justify-center',
                size === 'sm'
                  ? 'w-[26px] h-[26px] min-h-[26px] min-w-[26px]'
                  : 'w-[34px] h-[34px] min-h-[34px] min-w-[34px]',
              )}
            >
              <EllipsisHorizontalIcon
                width={iconSize}
                height={iconSize}
                className="text-slate-500 dark:text-slate-400"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="max-h-[195px] overflow-y-auto hide-scrollbar !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
          >
            <DropdownMenuGroup>
              {overflow.map((chainId) => (
                <DropdownMenuItem
                  className="pr-10"
                  key={chainId}
                  onClick={() => onNetworkSelect?.(chainId)}
                >
                  <NetworkButton
                    iconSize={iconSize}
                    chainId={chainId}
                    className="border-none"
                  />
                  <span className="ml-2">
                    {EvmChainKey[chainId as EvmChainId].toLocaleUpperCase()}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}

export const NetworkButton = forwardRef<
  HTMLButtonElement,
  {
    chainId: number
    iconSize: number
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ chainId, iconSize, className, ...props }, ref) => (
  <button
    ref={ref}
    {...props}
    type="button"
    className={classNames(
      'border border-black/10 dark:border-white/10 rounded-md p-1 flex items-center justify-center',
      className,
    )}
  >
    <NetworkIcon
      type="square"
      className="rounded-[3px]"
      chainId={chainId}
      width={iconSize}
      height={iconSize}
    />
  </button>
))
NetworkButton.displayName = 'NetworkButton'
