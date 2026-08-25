import { Currency, classNames } from '@sushiswap/ui'
import { useCallback } from 'react'
import type { EvmToken } from 'sushi/evm'
import type { TokenSelectorPool } from '../hooks/use-pool-address'
import { useTokenSelectorTheme } from '../token-selector-theme'

interface TokenSelectorPoolRow {
  onSelect(token0: EvmToken, token1: EvmToken): void
  pool: TokenSelectorPool
}

export function TokenSelectorPoolRow({ onSelect, pool }: TokenSelectorPoolRow) {
  const theme = useTokenSelectorTheme()
  const isPerps = theme === 'perps'
  const { token0, token1 } = pool

  const onClick = useCallback(() => {
    onSelect(token0, token1)
  }, [onSelect, token0, token1])

  return (
    <div className="relative h-[64px] py-0.5">
      <button
        type="button"
        aria-label={`Select ${token0.symbol}/${token1.symbol} ${pool.version} pool`}
        testdata-id={`token-selector-pool-row-${pool.address.toLowerCase()}`}
        onClick={onClick}
        className={classNames(
          isPerps
            ? 'hover:bg-white/[0.05] focus-visible:bg-white/[0.07]'
            : 'hover:bg-muted focus-visible:bg-accent',
          'flex h-full w-full items-center gap-4 rounded-lg px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <Currency.IconList iconWidth={40} iconHeight={40}>
          <Currency.Icon disableLink currency={token0} />
          <Currency.Icon disableLink currency={token1} />
        </Currency.IconList>
        <div className="flex min-w-0 flex-col items-start">
          <span
            className={classNames(
              'truncate font-semibold',
              isPerps ? 'text-perps-muted' : 'text-primary',
            )}
          >
            {token0.symbol}/{token1.symbol}
          </span>
          <span
            className={classNames(
              'rounded px-1.5 py-0.5 text-[10px] font-medium uppercase leading-none',
              isPerps
                ? 'bg-white/[0.08] text-perps-muted-50'
                : 'bg-blue text-primary',
            )}
          >
            {pool.version}
          </span>
        </div>
      </button>
    </div>
  )
}
