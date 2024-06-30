import { SkeletonCircle, SkeletonText, classNames } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { formatUSD, formatPercent } from 'sushi/format'

import { QuestionMarkCircleIcon } from '@heroicons/react-v1/solid'
import { PortfolioPosition } from '@sushiswap/graph-client/data-api'
import { SushiSwapProtocol } from 'sushi/types'

export const ProtocolBadge: Record<SushiSwapProtocol, JSX.Element> = {
  // [Protocol.BENTOBOX_STABLE]: (
  //   <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
  //     Trident Stable
  //   </div>
  // ),
  // [Protocol.BENTOBOX_CLASSIC]: (
  //   <div className="whitespace-nowrap bg-green/20 text-green text-[10px] px-2 rounded-full">
  //     Trident Classic
  //   </div>
  // ),
  [SushiSwapProtocol.SUSHISWAP_V2]: (
    <div className="whitespace-nowrap bg-pink/20 text-pink text-[10px] px-2 rounded-full w-7">
      V2
    </div>
  ),
  [SushiSwapProtocol.SUSHISWAP_V3]: (
    <div className="whitespace-nowrap bg-blue/20 text-blue text-[10px] px-2 rounded-full w-7">
      V3
    </div>
  ),
}

export const ICON_COLUMN: ColumnDef<PortfolioPosition, unknown> = {
  id: 'icon',
  header: 'icon',
  cell: (props) => (
    // get token

    <div className="flex items-center w-full gap-2">
      {props.row.original.token0.logoUrl ? (
        <img
          src={props.row.original.token0.logoUrl}
          alt={props.row.original.token0.name}
          className="w-8 h-8"
        />
      ) : (
        <QuestionMarkCircleIcon className="w-8 h-8" />
      )}

      {props.row.original.token1.logoUrl ? (
        <img
          src={props.row.original.token1.logoUrl}
          alt={props.row.original.token1.name}
          className="w-8 h-8"
        />
      ) : (
        <QuestionMarkCircleIcon className="w-8 h-8" />
      )}
    </div>
  ),
  meta: {
    skeleton: <SkeletonCircle radius={26} />,
  },
}

export const NAME_SYMBOL_AMOUNT_COLUMN: ColumnDef<PortfolioPosition, unknown> =
  {
    id: 'name',
    header: 'Name',
    cell: (props) => (
      <>
        <div className="flex flex-col w-full">
          <span>
            {`${props.row.original.token0.symbol} / ${props.row.original.token1.symbol}`}
          </span>
          <span className={classNames('text-xs')}>
            {ProtocolBadge[props.row.original.protocol]}{' '}
            {formatPercent(props.row.original.swapFee)}
          </span>
        </div>
      </>
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

export const USD_COLUMN: ColumnDef<PortfolioPosition, unknown> = {
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

        {
          <div className="flex flex-row w-full items-center">
            {props.row.original?.range === 'IN_RANGE' ? (
              // green dot
              <>
                <div className="bg-green-400 w-2 h-2 rounded-full" />

                <span className={classNames('text-xs')}>In Range</span>
              </>
            ) : props.row.original?.range === 'OUT_RANGE' ? (
              // red dot
              <>
                <div className="bg-yellow-600 w-2 h-2 rounded-full" />

                <span className={classNames('text-xs')}>Out of Range</span>
              </>
            ) : (
              <></>
            )}
          </div>
        }
      </div>
    ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
