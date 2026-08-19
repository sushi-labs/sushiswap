'use client'

import { Button } from '@sushiswap/ui'
import { QUICK_BUY_USD_AMOUNTS } from '../../_lib/launchpad-swap'
import type { LaunchpadToken } from '../../types'
import { useQuickBuy } from './quick-buy-provider'

export function QuickBuy({ token }: { token: LaunchpadToken }) {
  const { executeQuickBuy, pending, request } = useQuickBuy()

  return (
    <>
      <div className="relative z-10">
        <div className="grid grid-cols-4 gap-2">
          {QUICK_BUY_USD_AMOUNTS.map((usdAmount) => (
            <Button
              key={usdAmount}
              type="button"
              size="xs"
              variant="perps-secondary"
              loading={
                (pending?.token.id === token.id &&
                  pending.usdAmount === usdAmount) ||
                (request?.token.id === token.id &&
                  request.usdAmount === usdAmount)
              }
              disabled={pending !== undefined || request !== undefined}
              onClick={(event) => {
                event.stopPropagation()
                void executeQuickBuy({
                  token,
                  usdAmount,
                  chainId: token.chainId,
                })
              }}
              aria-label={`Quick buy $${usdAmount} of ${token.symbol} with ETH`}
              className="rounded-lg bg-white/[0.04] py-1.5 text-xs font-medium text-perps-muted-50 transition hover:bg-white/[0.08] hover:text-perps-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              ${usdAmount}
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}
