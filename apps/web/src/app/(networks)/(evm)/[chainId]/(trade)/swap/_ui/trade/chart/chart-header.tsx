import { useBreakpoint } from '@sushiswap/hooks'
import { Badge, Button, Currency, SelectIcon } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { useChartContext } from './chart-provider'
import { Rate } from './rate'

export const ChartHeader = () => {
  const { isMd: isMdScreen } = useBreakpoint('md')
  const {
    state: { token1 },
    mutate: { setToken1 },
  } = useChartContext()

  const selector = useMemo(() => {
    return (
      <TokenSelectorV2
        type="buy"
        selected={token1}
        onSelect={(token) => {
          setToken1(token)
        }}
        variant={isMdScreen ? 'default' : 'semi-opaque'}
      >
        <Button
          size="lg"
          variant={token1 ? 'secondary' : 'default'}
          id={'chart-token'}
          type="button"
          className={classNames(
            token1 ? 'pl-1.5 pr-3' : '',
            '!rounded-full h-[47px] bg-slate-200 dark:bg-slate-750',
          )}
        >
          {token1 ? (
            <>
              <div className="w-[37px] h-[37px] mr-0.5">
                <Badge
                  className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11] !-right-[15%] bottom-[3%]"
                  position="bottom-right"
                  badgeContent={
                    <NetworkIcon
                      type="square"
                      className="rounded-[3px]"
                      chainId={token1.chainId}
                      width={15}
                      height={15}
                    />
                  }
                >
                  <Currency.Icon
                    disableLink
                    currency={token1}
                    width={37}
                    height={37}
                  />
                </Badge>
              </div>
              {token1.symbol}
              <SelectIcon />
            </>
          ) : (
            'Select token'
          )}
        </Button>
      </TokenSelectorV2>
    )
  }, [token1, isMdScreen, setToken1])

  return (
    <div className="flex flex-col items-start justify-between w-full gap-4 lg:items-center md:flex-col lg:flex-row lg:gap-0">
      <div>{selector}</div>
      <div>
        <Rate />
      </div>
    </div>
  )
}
