import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { BalanceItemType } from 'src/lib/perps/use-balances'
import {
  currencyFormatter,
  getSignForValue,
  getTextColorClass,
} from 'src/lib/perps/utils'
import { truncateString } from 'sushi'
import { useAssetState } from '../../asset-state-provider'
import { columnBodyMeta } from '../column-meta'

export const COIN_COLUMN: ColumnDef<BalanceItemType, unknown> = {
  id: 'coin',
  header: 'Coin',
  accessorFn: (row) => row.coin,
  sortingFn: 'alphanumeric',
  cell: (props) => {
    const {
      mutate: { setActiveAsset },
    } = useAssetState()
    const coin = props.row.original.coin
    const assetName = props.row.original.assetName
    const canSelect =
      props.row.original.marketType === 'spot' &&
      coin !== 'USDC (Spot)' &&
      assetName
    if (!canSelect) {
      return <span className="font-medium whitespace-nowrap">{coin}</span>
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          setActiveAsset(assetName)
        }}
        type="button"
        className="font-semibold text-blue whitespace-nowrap"
      >
        {coin}
      </button>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const TOTAL_BALANCE_COLUMN: ColumnDef<BalanceItemType, unknown> = {
  id: 'totalBalance',
  header: 'Total Balance',
  accessorFn: (row) => row.totalBalance,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.totalBalance) - Number.parseFloat(rowB.totalBalance),
  cell: (props) => {
    const totalBalance = props.row.original.totalBalance
    const coin = props.row.original.coin?.split(' (')[0] ?? ''

    return (
      <span className="font-medium whitespace-nowrap">
        {totalBalance} {coin}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const AVAILABLE_BALANCE_COLUMN: ColumnDef<BalanceItemType, unknown> = {
  id: 'availableBalance',
  header: 'Available Balance',
  accessorFn: (row) => row.availableBalance,
  sortingFn: ({ original: rowA }, { original: rowB }) => {
    return (
      Number.parseFloat(rowA.availableBalance) -
      Number.parseFloat(rowB.availableBalance)
    )
  },
  cell: (props) => {
    const availableBalance = props.row.original.availableBalance
    const coin = props.row.original.coin?.split(' (')[0] ?? ''
    const isPerp = props.row.original.marketType === 'perp'

    if (!isPerp) {
      return (
        <span className="font-medium whitespace-nowrap">
          {availableBalance} {coin}
        </span>
      )
    }
    return (
      <HoverCard openDelay={0}>
        <HoverCardTrigger asChild tabIndex={0}>
          <div className="font-medium underline whitespace-nowrap">
            {availableBalance} {coin}
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          forceMount
          side="top"
          className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
        >
          <p>
            Available balance to open positions ignoring open orders.{' '}
            {availableBalance} {coin} is available to withdraw transfer, or open
            HIP-3 positions.
          </p>
        </HoverCardContent>
      </HoverCard>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const USDC_VALUE_COLUMN: ColumnDef<BalanceItemType, unknown> = {
  id: 'usdcValue',
  header: 'USDC Value',
  accessorFn: (row) => row.usdcValue,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.usdcValue) - Number.parseFloat(rowB.usdcValue),
  cell: (props) => {
    const usdcValue = props.row.original.usdcValue

    return (
      <span className="font-medium whitespace-nowrap">
        {currencyFormatter.format(Number.parseFloat(usdcValue))}
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
export const PNL_COLUMN: ColumnDef<BalanceItemType, unknown> = {
  id: 'pnlRoePc',
  header: 'PNL / (ROE %)',
  accessorFn: (row) => row.pnlRoePc?.pnl,
  sortingFn: ({ original: rowA }, { original: rowB }) =>
    Number.parseFloat(rowA.pnlRoePc?.pnl?.toString() ?? '0') -
    Number.parseFloat(rowB.pnlRoePc?.pnl?.toString() ?? '0'),
  cell: (props) => {
    if (!props.row.original.pnlRoePc) {
      return '-'
    }
    const pnl = props.row.original.pnlRoePc?.pnl ?? 0
    const roePc = props.row.original.pnlRoePc?.roePc ?? 0

    return (
      <span
        className={classNames(
          'font-medium whitespace-nowrap',
          getTextColorClass(pnl),
        )}
      >
        {getSignForValue(pnl)}
        {currencyFormatter.format(Number.parseFloat(pnl.toString()))} / (
        {getSignForValue(roePc)}
        {roePc.toFixed(1)}%)
      </span>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}

export const CONTRACT_COLUMN: ColumnDef<BalanceItemType, unknown> = {
  id: 'contract',
  header: 'Contract',
  cell: (props) => {
    const isPerp = props.row.original.marketType === 'perp'
    const isUSDCSpot = props.row.original.coin === 'USDC (Spot)'
    const contractAddress = props.row.original.token?.tokenId
    const [isCopied, staticCopy] = useCopyClipboard()
    if (isPerp || isUSDCSpot || !contractAddress) {
      return '-'
    }
    return (
      <div className={classNames('font-medium flex items-center gap-1')}>
        <div>{truncateString(contractAddress, 10, 'middle')}</div>
        <button
          className="underline"
          onClick={(e) => {
            e.stopPropagation()
            staticCopy(contractAddress)
          }}
          type="button"
        >
          {isCopied ? (
            <ClipboardCheckIcon className="w-3.5 h-3.5" />
          ) : (
            <ClipboardCopyIcon className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    )
  },
  meta: {
    body: columnBodyMeta,
  },
}
