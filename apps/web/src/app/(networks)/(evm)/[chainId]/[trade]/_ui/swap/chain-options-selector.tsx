import { InformationCircleIcon } from '@heroicons/react-v1/solid'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import {
  Collapsible,
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
import { useCurrentChainId } from 'src/lib/hooks/useCurrentChainId'
import { useNetworkOptions } from 'src/lib/hooks/useNetworkOptions'
import { useTradeMode } from 'src/lib/hooks/useTradeMode'
import { getNetworkName } from 'src/lib/network'
import type { ChainId } from 'sushi'
import type { EvmChainId } from 'sushi/evm'

export const ChainOptionsSelector = ({
  includeAllOption,
  size = 'sm',
  networks,
  onNetworkSelect,
  selectedNetwork,
  canShowMessage,
  networkSelectedClassName,
  networkClassName,
}: {
  includeAllOption: boolean
  size?: 'sm' | 'lg'
  networks?: EvmChainId[]
  onNetworkSelect?: (network: EvmChainId | null) => void
  selectedNetwork?: EvmChainId | null
  canShowMessage?: boolean
  networkSelectedClassName?: string
  networkClassName?: string
}) => {
  const { networkOptions: defaultNetworks } = useNetworkOptions()
  const { tradeMode } = useTradeMode()
  const isTwap = tradeMode === 'limit' || tradeMode === 'dca'
  const { chainId } = useCurrentChainId()

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

    //minus 1 to account for "All" button
    const subAmount = includeAllOption ? 1 : 0
    setVisibleCount(fitCount - subAmount)
  }, [size, _networks, includeAllOption])

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

  const showMessage = Boolean(
    isTwap && chainId !== selectedNetwork && canShowMessage,
  )

  return (
    <div
      className={classNames(
        'flex flex-col  w-full',
        showMessage ? 'gap-y-2' : 'gap-y-0',
      )}
    >
      <Collapsible open={showMessage}>
        <div className="text-xs bg-skyblue/[3%] rounded-xl p-3 text-skyblue flex items-center gap-2">
          <InformationCircleIcon
            width={16}
            height={16}
            className="text-skyblue"
          />
          <p>
            Sushi currently only supports{' '}
            {tradeMode === 'dca' ? 'DCA' : 'limit'} orders for same-chain swaps.
          </p>
        </div>
      </Collapsible>

      <div className="flex items-center gap-x-1.5 w-full" ref={containerRef}>
        {includeAllOption ? (
          <NetworkButton
            tabIndex={-1}
            onClick={() => onNetworkSelect?.(null)}
            iconSize={iconSize}
            chainId={'all'}
            testdata-id={`network-option-all-button`}
            data-selected={selectedNetwork === null}
          />
        ) : null}
        {visible.map((chainId) => (
          <TooltipProvider key={chainId}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <NetworkButton
                  tabIndex={-1}
                  onClick={() => onNetworkSelect?.(chainId)}
                  iconSize={iconSize}
                  chainId={chainId}
                  className={classNames(
                    networkClassName,
                    selectedNetwork === chainId && networkSelectedClassName,
                  )}
                  testdata-id={`network-option-${chainId}-button`}
                  data-selected={selectedNetwork === chainId}
                />
              </TooltipTrigger>
              <TooltipContent className="border-black/5 dark:border-white/5 !rounded-md !bg-[#FFFFFF24] dark:!bg-[#00000028] backdrop-blur-[20px]">
                {getNetworkName(chainId as ChainId)}
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
                  'border border-black/10 dark:border-white/10 rounded-md p-1 flex items-center justify-center',
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
              className="max-h-[195px] overflow-y-auto !bg-slate-50 dark:!bg-slate-800 !backdrop-blur-none"
            >
              <DropdownMenuGroup>
                {overflow.map((chainId) => (
                  <DropdownMenuItem
                    key={chainId}
                    onClick={() => onNetworkSelect?.(chainId)}
                    className={classNames('pr-10')}
                  >
                    <NetworkButton
                      iconSize={iconSize}
                      chainId={chainId}
                      className={'border-none'}
                    />
                    <span className="ml-2">
                      {getNetworkName(chainId as ChainId)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  )
}

export const NetworkButton = forwardRef<
  HTMLButtonElement,
  {
    chainId: EvmChainId | 'all'
    iconSize: number
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ chainId, iconSize, className, ...props }, ref) => (
  <button
    ref={ref}
    {...props}
    type="button"
    className={classNames(
      'border border-black/10 dark:border-white/10 rounded-md p-1 flex items-center justify-center',
      'data-[selected=true]:!border-blue data-[selected=true]:!bg-blue/10 dark:data-[selected=true]:!bg-skyblue/10 dark:data-[selected=true]:!border-skyblue',
      className,
    )}
  >
    {chainId === 'all' ? (
      <span
        className="text-muted-foreground font-medium text-sm flex items-center justify-center"
        style={{
          width: iconSize,
          height: iconSize,
        }}
      >
        All
      </span>
    ) : (
      <NetworkIcon
        type="square"
        className="rounded-[3px]"
        chainId={chainId}
        width={iconSize}
        height={iconSize}
      />
    )}
  </button>
))
NetworkButton.displayName = 'NetworkButton'
