import { Native } from 'sushi/currency'

import { Badge, Button, Currency, SelectIcon } from '@sushiswap/ui'
import { classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import type { Type } from 'sushi/currency'

import { useBreakpoint } from '@sushiswap/hooks'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { USDC } from 'sushi/currency'
import type { Address } from 'viem'
import { isAddress } from 'viem/utils'
import { useChainId } from 'wagmi'
import { Rate } from './rate'

export const ChartHeader = () => {
  const [token, setToken] = useState<Type>(Native.onChain(43114))
  const [isTokenLoading, _setIsTokenLoading] = useState(false)
  const { isMd: isMdScreen } = useBreakpoint('md')
  const connectedChainId = useChainId()
  const searchParams = useSearchParams()
  const _token0 = searchParams.get('token0')
  const token0 =
    _token0 && _token0 === 'NATIVE'
      ? Native.onChain(connectedChainId).wrapped.address
      : _token0
        ? _token0
        : token.wrapped.address

  const { data: token0FromCache } = useTokenWithCache({
    chainId: connectedChainId,
    address: token0 as Address,
    enabled: isAddress(token0, { strict: false }),
    keepPreviousData: false,
  })

  const input0 = token0FromCache ?? Native.onChain(connectedChainId)
  const input1 = USDC[43114]

  const selector = useMemo(() => {
    return (
      <TokenSelectorV2
        type="buy"
        selected={input0}
        chainId={connectedChainId}
        onSelect={(token) => {
          setToken(token)
        }}
        variant={isMdScreen ? 'default' : 'semi-opaque'}
      >
        <Button
          data-state={isTokenLoading ? 'inactive' : 'active'}
          size="lg"
          variant={input0 ? 'secondary' : 'default'}
          id={'swap-to'}
          type="button"
          className={classNames(
            input0 ? 'pl-2 pr-3' : '',
            '!rounded-full !min-h-[40px] !h-[40px] data-[state=inactive]:hidden data-[state=active]:flex bg-slate-200 dark:bg-slate-750',
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
  }, [input0, isTokenLoading, isMdScreen, connectedChainId])

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
