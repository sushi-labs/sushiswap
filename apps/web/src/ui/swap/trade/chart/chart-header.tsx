import { Native } from 'sushi/currency'

import { Badge, Button, Currency, SelectIcon } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import type { Type } from 'sushi/currency'

import { useBreakpoint } from '@sushiswap/hooks'
import { useState } from 'react'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { USDC } from 'sushi/currency'
import { Rate } from './rate'

export const ChartHeader = () => {
  const [token, setToken] = useState<Type>(Native.onChain(43114))
  const [isTokenLoading, _setIsTokenLoading] = useState(false)
  const { isMd: isMdScreen } = useBreakpoint('md')

  const input0 = token
  const input1 = USDC[43114]

  const selector = useMemo(() => {
    return (
      <TokenSelectorV2
        type="buy"
        selected={token}
        chainId={1}
        onSelect={(token) => {
          setToken(token)
        }}
        variant={isMdScreen ? 'default' : 'semi-opaque'}
      >
        <Button
          data-state={isTokenLoading ? 'inactive' : 'active'}
          size="lg"
          variant={token ? 'secondary' : 'default'}
          id={'swap-to'}
          type="button"
          className={classNames(
            token ? 'pl-2 pr-3' : '',
            '!rounded-full !min-h-[40px] !h-[40px] data-[state=inactive]:hidden data-[state=active]:flex bg-slate-200 dark:bg-slate-750',
          )}
        >
          {token ? (
            <>
              <div className="w-[23px] h-[23px] mr-0.5">
                <Badge
                  className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11]"
                  position="bottom-right"
                  badgeContent={
                    <NetworkIcon
                      type="square"
                      className="rounded-[3px]"
                      chainId={token.chainId}
                      width={12}
                      height={12}
                    />
                  }
                >
                  <Currency.Icon
                    disableLink
                    currency={token}
                    width={23}
                    height={23}
                  />
                </Badge>
              </div>
              {token.symbol}
              <SelectIcon />
            </>
          ) : (
            'Select token'
          )}
        </Button>
      </TokenSelectorV2>
    )
  }, [token, isTokenLoading, isMdScreen])

  return (
    <div className="flex flex-col items-start justify-between w-full gap-4 lg:items-center md:flex-col lg:flex-row lg:gap-0">
      <div>{selector}</div>
      <div>
        <Rate
          token0={{
            symbol: input0?.symbol ?? '',
            amount: 1,
            usdPrice: 21,
          }}
          token1={{
            symbol: input1?.symbol ?? '',
            amount: 1,
            usdPrice: 1,
          }}
        />
      </div>
    </div>
  )
}
