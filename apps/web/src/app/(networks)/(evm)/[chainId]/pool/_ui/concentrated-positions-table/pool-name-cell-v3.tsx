import { Badge } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import type { Row } from '@tanstack/react-table'
import { type FC, useMemo } from 'react'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { formatPercent } from 'sushi'
import { type EvmCurrency, SushiSwapProtocol, unwrapEvmToken } from 'sushi/evm'
import { ProtocolBadge } from '../../../_ui/protocol-badge'

export const PoolNameCellV3: FC<
  Row<ConcentratedLiquidityPositionWithV3Pool>
> = ({ original }) => {
  const [_token0, _token1]: [EvmCurrency, EvmCurrency] = useMemo(
    () => [
      unwrapEvmToken(original.pool.token0),
      unwrapEvmToken(original.pool.token1),
    ],
    [original],
  )
  return (
    <div className="flex items-center gap-5">
      <div className="flex">
        {_token0 && _token1 && (
          <Badge
            className="border-2 border-background rounded-full z-[11]"
            position="bottom-right"
            badgeContent={
              <NetworkIcon chainId={original.chainId} width={14} height={14} />
            }
          >
            <Currency.IconList iconWidth={26} iconHeight={26}>
              <Currency.Icon disableLink currency={_token0} />
              <Currency.Icon disableLink currency={_token1} />
            </Currency.IconList>
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-sm flex items-center gap-1 text-primary">
          {_token0?.symbol} <span className="font-normal text-primary">/</span>{' '}
          {_token1?.symbol}{' '}
        </span>
        <div className="flex gap-1">
          {ProtocolBadge[SushiSwapProtocol.SUSHISWAP_V3 as SushiSwapProtocol]}
          <div className="text-muted-foreground bg-muted text-[10px] px-2 rounded-full">
            {formatPercent(original.fee / 1000000)}
          </div>
        </div>
      </div>
    </div>
  )
}
