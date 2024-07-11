import { SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { formatPercent, formatUSD } from 'sushi/format'

import { QuestionMarkCircleIcon } from '@heroicons/react-v1/solid'
import { PortfolioWalletToken } from '@sushiswap/graph-client/data-api'

export const TOKEN_ICON_COLUMN: ColumnDef<PortfolioWalletToken, unknown> = {
  id: 'icon',
  header: 'icon',
  cell: (props) =>
    // get token
    props.row.original.logoUrl ? (
      // render logo 64x64
      <img
        src={props.row.original.logoUrl}
        alt={props.row.original.name}
        className="w-8 h-8"
      />
    ) : (
      // render network icon
      // question mark icon
      <QuestionMarkCircleIcon className="w-8 h-8" />
    ),
  meta: {
    skeleton: <SkeletonCircle radius={26} />,
  },
}

export const NAME_SYMBOL_AMOUNT_COLUMN: ColumnDef<
  PortfolioWalletToken,
  unknown
> = {
  id: 'name',
  header: 'Name',
  cell: (props) =>
    (
        <div className="flex flex-col w-full">
        <span>
        {props.row.original.name}
        </span>
        <span
          className={classNames(
            'text-xs',
          )}
        >
        {props.row.original.amount.toFixed(6)}  {props.row.original.symbol}
        </span>
      </div>
    ),
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex items-center">
          <SkeletonCircle radius={26} />
          <SkeletonCircle radius={26} className="-ml-[12px]" />
        </div>
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
  size: 300,
}

export const USD_COLUMN: ColumnDef<PortfolioWalletToken, unknown> = {
  id: 'usd',
  header: '$',
  cell: (props) =>
    formatUSD(props.row.original.amountUSD).includes('NaN') ? (
      '$0.00'
    ) : (
      //   `${formatUSD(props.row.original.amountUSD)} ${props.row.original.price24hChange}`)
      <div className="flex flex-col w-full">
        <span className={classNames('text-xs')}>
          {formatUSD(props.row.original.amountUSD)}
        </span>
        <span
          className={classNames(
            'text-xs',
            props.row.original.price24hChange > 0 ? 'text-green' : 'text-red',
          )}
        >
          {props.row.original.price24hChange > 0 ? '+' : '-'}
          {formatPercent(Math.abs(props.row.original.price24hChange))}
        </span>
      </div>
    ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
