import { Currency, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { useCoinGeckoTokenInfo } from 'src/lib/hooks/react-query'
import type { BladePoolAsset } from 'src/lib/pool/blade'
import type { EvmChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { formatPercent, formatUSD } from 'sushi/format'
import { CurrencyFiatIcon } from '../CurrencyFiatIcon'

export type BladePoolsTableMeta = {
  showStableTypes: boolean
}

export const NAME_COLUMN: ColumnDef<BladePoolAsset, unknown> = {
  id: 'name',
  header: 'Name',
  cell: ({ row: { original } }) => {
    if ('stablecoin' in original) {
      return (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5">
            <CurrencyFiatIcon width={20} height={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-sm dark:text-slate-50">
              USD
            </span>
          </div>
        </div>
      )
    }

    const { token } = original

    return (
      <div className="flex items-center gap-3">
        <div className="h-5 w-5">
          <Currency.Icon disableLink currency={token} width={20} height={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-sm dark:text-slate-50">
            {token.symbol}
          </span>
        </div>
      </div>
    )
  },
  meta: {
    body: {
      skeleton: (
        <div className="flex w-full items-center gap-2">
          <SkeletonCircle radius={20} />
          <div className="flex w-full flex-col">
            <SkeletonText fontSize="sm" />
          </div>
        </div>
      ),
    },
  },
  size: 200,
}

function PriceCell(props: { row: BladePoolAsset }) {
  const { data: coinGeckoInfo, isLoading: isCoinGeckoInfoLoading } =
    useCoinGeckoTokenInfo({
      token: 'stablecoin' in props.row ? undefined : props.row.token.wrapped,
      enabled: !('stablecoin' in props.row),
    })

  if (isCoinGeckoInfoLoading) {
    return <SkeletonText fontSize="sm" />
  }

  const price = 'stablecoin' in props.row ? 1 : (coinGeckoInfo?.price ?? 0)
  return <span className="text-sm">{formatUSD(price)}</span>
}

export const PRICE_COLUMN: ColumnDef<BladePoolAsset, unknown> = {
  id: 'price',
  header: 'Price',
  cell: (props) => <PriceCell row={props.row.original} />,
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  size: 100,
}

export const TVL_COLUMN: ColumnDef<BladePoolAsset, unknown> = {
  id: 'liquidityUSD',
  header: 'TVL',
  cell: (props) => formatUSD(props.row.original.liquidityUSD),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  size: 100,
}

export const COMPOSITION_COLUMN: ColumnDef<BladePoolAsset, unknown> = {
  id: 'weight',
  header: 'Pool Composition',
  cell: (props) => formatPercent(props.row.original.weight),
  meta: {
    body: {
      skeleton: <SkeletonText fontSize="lg" />,
    },
  },
  size: 100,
}
