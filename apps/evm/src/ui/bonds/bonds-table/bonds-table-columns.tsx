import { Bond } from '@sushiswap/client'
import { ColumnDef } from '@tanstack/react-table'
import formatDistance from 'date-fns/formatDistance'
import { formatPercent } from 'sushi'

export const PAYOUT_ASSET_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'payout-asset',
  header: 'Payout Asset',
  cell: (props) => props.row.original.payoutToken.symbol,
}

export const PRICE_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'price',
  header: 'Price',
  cell: (props) => 'price',
}

export const DISCOUNT_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'discount',
  header: 'Discount',
  cell: (props) => {
    const discount = props.row.original.discount

    if (discount <= 0)
      return <span className="text-red">{formatPercent(discount)}</span>

    return <span className="text-green">{formatPercent(discount)}</span>
  },
}

export const BOND_ASSET_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'bond-asset',
  header: 'Bond Asset',
  cell: (props) => props.row.original.quoteToken.symbol,
}

export const CLIFF_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'cliff',
  header: 'Cliff',
  cell: (props) => {
    if (!props.row.original.vesting) return <>-</>

    switch (props.row.original.vestingType) {
      case 'Fixed-Term':
        return formatDistance(props.row.original.vesting * 1000, 0)
    }
  },
}

export const ISSUER_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'issuer',
  header: 'Issuer',
  cell: (props) => 'issuer',
}
