import { Currency } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import {
  type EvmChainId,
  type EvmCurrency,
  type SushiSwapV3FeeAmount,
  getEvmChainById,
} from 'sushi/evm'

type PoolSetupSummaryProps = {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  chainId: EvmChainId
} & (
  | { version: 'V2'; feeAmount?: never }
  | { version: 'V3'; feeAmount?: SushiSwapV3FeeAmount }
)

export function PoolSetupSummary({
  token0,
  token1,
  chainId,
  version,
  feeAmount,
}: PoolSetupSummaryProps): ReactElement {
  return (
    <div className="flex items-center gap-3">
      {token0 && token1 && (
        <Currency.IconList iconWidth={28} iconHeight={28}>
          <Currency.Icon disableLink currency={token0} />
          <Currency.Icon disableLink currency={token1} />
        </Currency.IconList>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">
          {token0?.symbol} / {token1?.symbol}
        </div>
        <div className="text-sm text-muted-foreground">
          {getEvmChainById(chainId).name} · {version}
          {feeAmount && ` · ${feeAmount / 10000}% fee`}
        </div>
      </div>
    </div>
  )
}
