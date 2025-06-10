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
import { XSWAP_SUPPORTED_CHAIN_IDS, getSortedChainIds } from 'src/config'
import { EvmChainKey } from 'sushi'

const networks = getSortedChainIds(XSWAP_SUPPORTED_CHAIN_IDS)

export const ChainOptionsSelector = ({
  size = 'sm',
  onNetworkSelect,
}: {
  size?: 'sm' | 'lg'
  onNetworkSelect?: (network: number) => void
}) => {
  const iconSize = size === 'sm' ? 16 : 24

  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const gapPx = 4
    const iconWidth = size === 'sm' ? 26 : 34
    const slotWidth = iconWidth + gapPx

    const containerWidth = container.clientWidth - 6
    const rawFit = Math.floor(containerWidth / slotWidth)

    // reserve one slot for the overflow-menu button if we actually have overflow
    const fitCount =
      rawFit < networks.length && rawFit > 0 ? rawFit - 1 : rawFit

    setVisibleCount(fitCount)
  }, [size])

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
    const visible = networks.slice(0, visibleCount)
    const overflow = networks.slice(visibleCount)
    return {
      visible,
      overflow,
    }
  }, [visibleCount])

  return (
    <div
      className="flex items-center justify-between gap-x-1.5 w-full"
      ref={containerRef}
    >
      {visible.map((chainId) => (
        <TooltipProvider key={chainId}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <NetworkButton
                onClick={() => onNetworkSelect?.(chainId)}
                iconSize={iconSize}
                chainId={chainId}
              />
            </TooltipTrigger>
            <TooltipContent className="dark:border-[#FFFFFF14] font-normal !rounded-md bg-[#e9eff5] backdrop-blur-[20px] border-[#00000014] dark:bg-[#151c34]">
              {EvmChainKey[chainId].toLocaleUpperCase()}
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
                className="text-[#0C0C23] dark:text-[#FFF5FA]"
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
                    {EvmChainKey[chainId].toLocaleUpperCase()}
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
      'flex items-center justify-center p-1 border rounded-md border-black/10 dark:border-white/10',
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
