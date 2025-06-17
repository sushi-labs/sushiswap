import { useBreakpoint } from '@sushiswap/hooks'
import { Badge, Button, Currency, SelectIcon } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { USDC } from 'sushi/currency'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { useChartContext } from './chart-provider'
import { Rate } from './rate'

export const ChartHeader = () => {
  const { isMd: isMdScreen } = useBreakpoint('md')
  const {
    state: { token0, chainId },
    mutate: { setToken0 },
  } = useChartContext()
  const input0 = token0
  const input1 = chainId in USDC ? USDC[chainId as keyof typeof USDC] : USDC[1]

  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId: token0?.chainId,
    address: token0?.wrapped?.address,
    enabled: !!token0,
  })

  const selector = useMemo(() => {
    return (
      <TokenSelectorV2
        type="buy"
        selected={input0}
        chainId={chainId}
        onSelect={(token) => {
          setToken0(token)
        }}
        variant={isMdScreen ? 'default' : 'semi-opaque'}
      >
        <Button
          size="lg"
          variant={input0 ? 'secondary' : 'default'}
          id={'swap-to'}
          type="button"
          className={classNames(
            input0 ? 'pl-2 pr-3' : '',
            '!rounded-full !min-h-[40px] !h-[40px] bg-slate-200 dark:bg-slate-750',
          )}
        >
          {input0 ? (
            <>
              <div className="w-[23px] h-[23px] mr-0.5">
                <Badge
                  className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11]"
                  position="bottom-right"
                  badgeContent={
                    <NetworkIcon
                      type="square"
                      className="rounded-[3px]"
                      chainId={input0.chainId}
                      width={12}
                      height={12}
                    />
                  }
                >
                  <Currency.Icon
                    disableLink
                    currency={input0}
                    width={23}
                    height={23}
                  />
                </Badge>
              </div>
              {input0.symbol}
              <SelectIcon />
            </>
          ) : (
            'Select token'
          )}
        </Button>
      </TokenSelectorV2>
    )
  }, [input0, isMdScreen, chainId, setToken0])

  return (
    <div className="flex flex-col items-start justify-between w-full gap-4 lg:items-center md:flex-col lg:flex-row lg:gap-0">
      <div>{selector}</div>
      <div>
        <Rate
          token0={{
            symbol: input0?.symbol ?? '',
            amount: 1,
            usdPrice: price ?? 0,
          }}
          token1={{
            symbol: input1?.symbol ?? '',
            amount: 1,
            usdPrice: 1,
          }}
          isLoading={isPriceLoading}
        />
      </div>
    </div>
  )
}
