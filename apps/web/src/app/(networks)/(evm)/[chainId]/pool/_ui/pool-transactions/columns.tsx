import { FormattedNumber, SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import formatDistance from 'date-fns/formatDistance'
import { formatUSD, shortenAddress } from 'sushi'
import { type PoolTransaction, PoolTransactionType } from './types'

const SKELETON_META = {
  body: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}

function getSwapLegs(row: PoolTransaction) {
  return row.amount0 < 0
    ? {
        amounts: [row.amount0, row.amount1],
        tokens: [row.pool.token0, row.pool.token1],
      }
    : {
        amounts: [row.amount1, row.amount0],
        tokens: [row.pool.token1, row.pool.token0],
      }
}

function txOriginColumn<T extends PoolTransaction>(): ColumnDef<T, unknown> {
  return {
    id: 'sender',
    header: 'Maker',
    cell: (props) =>
      props.row.original.origin
        ? shortenAddress(props.row.original.origin)
        : '-',
    meta: SKELETON_META,
  }
}

function txAmountInColumn<T extends PoolTransaction>(
  type: PoolTransactionType,
): ColumnDef<T, unknown> {
  return {
    id: 'amounts_in',
    header: type === PoolTransactionType.Swap ? 'Amount in' : 'Token 0',
    cell: (props) => {
      const row = props.row.original
      switch (row.type) {
        case PoolTransactionType.Swap: {
          const { amounts, tokens } = getSwapLegs(row)

          return (
            <span>
              <FormattedNumber number={Math.abs(amounts[0]).toPrecision(6)} />{' '}
              {tokens[0].symbol}
            </span>
          )
        }
        case PoolTransactionType.Mint:
        case PoolTransactionType.Burn:
        case PoolTransactionType.Collect:
          return (
            <span>
              <FormattedNumber number={row.amount0.toPrecision(6)} />{' '}
              {row.pool.token0.symbol}
            </span>
          )
      }
    },
    meta: SKELETON_META,
  }
}

function txAmountOutColumn<T extends PoolTransaction>(
  type: PoolTransactionType,
): ColumnDef<T, unknown> {
  return {
    id: 'amount_out',
    header: type === PoolTransactionType.Swap ? 'Amount out' : 'Token 1',
    cell: (props) => {
      const row = props.row.original
      switch (row.type) {
        case PoolTransactionType.Swap: {
          const { amounts, tokens } = getSwapLegs(row)

          return (
            <span>
              <FormattedNumber number={Math.abs(amounts[1]).toPrecision(2)} />{' '}
              {tokens[1].symbol}
            </span>
          )
        }
        case PoolTransactionType.Mint:
        case PoolTransactionType.Burn:
        case PoolTransactionType.Collect:
          return (
            <span>
              <FormattedNumber number={row.amount1.toPrecision(2)} />{' '}
              {row.pool.token1.symbol}
            </span>
          )
      }
    },
    meta: SKELETON_META,
  }
}

function txAmountUsdColumn<T extends PoolTransaction>(): ColumnDef<T, unknown> {
  return {
    id: 'amountUSD',
    header: 'Amount (USD)',
    cell: (props) => formatUSD(props.row.original.amountUSD),
    meta: SKELETON_META,
  }
}

function txTimeColumn<T extends PoolTransaction>(): ColumnDef<T, unknown> {
  return {
    id: 'time',
    header: 'Time',
    cell: (props) =>
      formatDistance(props.row.original.timestamp * 1000, new Date(), {
        addSuffix: true,
      }),
    meta: SKELETON_META,
  }
}

export function getPoolTransactionColumns<T extends PoolTransaction>(
  type: PoolTransactionType,
): ColumnDef<T, unknown>[] {
  return [
    txOriginColumn<T>(),
    txAmountInColumn<T>(type),
    txAmountOutColumn<T>(type),
    txAmountUsdColumn<T>(),
    txTimeColumn<T>(),
  ]
}
