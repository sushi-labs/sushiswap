'use client'

import { ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Button, Currency, classNames } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { EvmToken } from 'sushi/evm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { TokenAvatar } from '../../../_ui/token-avatar'
import type { LaunchpadToken } from '../../../types'

export function SwapPanel({ token }: { token: LaunchpadToken }) {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [amount, setAmount] = useState('0.1')
  const numericAmount = Number(amount) || 0
  const tokenPrice = token.metrics?.priceUsd ?? 0
  const quoteToken = useMemo(
    () =>
      new EvmToken({
        chainId: token.chainId,
        ...token.pool.quoteToken,
      }),
    [token.chainId, token.pool.quoteToken],
  )
  const { data: quoteTokenPriceUsd } = usePrice({
    chainId: token.chainId,
    address: quoteToken.address,
  })
  const quoteTokenPrice = quoteTokenPriceUsd ?? 0
  const output = useMemo(() => {
    if (tokenPrice <= 0 || quoteTokenPrice <= 0) return '—'
    const value =
      side === 'SELL'
        ? (numericAmount * tokenPrice) / quoteTokenPrice
        : (numericAmount * quoteTokenPrice) / tokenPrice
    return value.toLocaleString('en-US', {
      maximumFractionDigits: side === 'SELL' ? 6 : 2,
    })
  }, [numericAmount, quoteTokenPrice, side, tokenPrice])
  const inputUsd =
    numericAmount * (side === 'SELL' ? tokenPrice : quoteTokenPrice)

  function changeSide(nextSide: 'BUY' | 'SELL') {
    setSide(nextSide)
    setAmount(nextSide === 'BUY' ? '0.1' : '100000')
  }

  return (
    <PerpsCard className="p-4 sm:p-5" fullWidth>
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="font-semibold text-perps-muted">
            Trade {token.symbol}
          </div>
          <div className="mt-0.5 text-xs text-perps-muted-50">
            Directly through the launch pool
          </div>
        </div>
        <Button variant="perps-secondary" size="sm" aria-label="Swap settings">
          <Cog6ToothIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-2 rounded-xl bg-white/[0.04] p-1">
        {(['BUY', 'SELL'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => changeSide(item)}
            className={classNames(
              'rounded-lg py-2.5 text-sm font-semibold transition',
              side === item
                ? item === 'BUY'
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                  : 'bg-red/15 text-red shadow-sm'
                : 'text-perps-muted-50 hover:text-perps-muted',
            )}
          >
            {item === 'BUY' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between text-xs text-perps-muted-50">
          <span>You pay</span>
          <span>Balance: 0</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            value={amount}
            inputMode="decimal"
            onChange={(event) => setAmount(event.target.value)}
            aria-label="Swap input amount"
            className="min-w-0 flex-1 bg-transparent text-3xl font-medium tracking-tight text-perps-muted outline-none"
          />
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-2 text-sm font-semibold text-perps-muted shadow-sm"
          >
            {side === 'SELL' ? (
              <TokenAvatar symbol={token.symbol} size="sm" />
            ) : (
              <Currency.Icon
                disableLink
                currency={quoteToken}
                width={32}
                height={32}
              />
            )}
            {side === 'SELL' ? token.symbol : quoteToken.symbol}
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 text-xs text-perps-muted-50">
          {inputUsd > 0 ? `≈ $${inputUsd.toFixed(2)}` : '—'}
        </div>
      </div>

      <div className="my-3 grid grid-cols-4 gap-2">
        {(side === 'BUY'
          ? ['0.1', '0.25', '0.5', '1']
          : ['25%', '50%', '75%', 'Max']
        ).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              if (side === 'BUY') setAmount(preset)
            }}
            className="rounded-lg bg-white/[0.04] py-1.5 text-xs font-medium text-perps-muted-50 transition hover:bg-white/[0.08] hover:text-perps-muted"
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white/[0.04] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
        <div className="text-xs text-perps-muted-50">You receive</div>
        <div className="mt-4 flex items-center gap-3">
          <div className="min-w-0 flex-1 truncate text-3xl font-medium tracking-tight text-perps-muted">
            {output}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-2 text-sm font-semibold text-perps-muted shadow-sm">
            {side === 'SELL' ? (
              <Currency.Icon
                disableLink
                currency={quoteToken}
                width={32}
                height={32}
              />
            ) : (
              <TokenAvatar symbol={token.symbol} size="sm" />
            )}
            {side === 'SELL' ? quoteToken.symbol : token.symbol}
          </div>
        </div>
        <div className="mt-3 text-xs text-perps-muted-50">
          Best route through Sushi V3
        </div>
      </div>

      <Button fullWidth size="xl" variant="perps-default" className="mt-4">
        Connect wallet
      </Button>
    </PerpsCard>
  )
}
