/* eslint-disable react-hooks/rules-of-hooks */

import { AuctionType } from '@sushiswap/bonds-sdk'
import { Bond } from '@sushiswap/client'
// import { useIsMounted } from '@sushiswap/hooks'
import {
  Badge,
  Currency,
  NetworkIcon,
  SkeletonText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  classNames,
} from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import formatDistance from 'date-fns/formatDistance'
import { formatPercent, formatUSD } from 'sushi'
import { Token } from 'sushi/currency'

const AUCTION_TYPE_BADGE: Record<AuctionType, JSX.Element> = {
  [AuctionType.Dynamic]: (
    <div className="whitespace-nowrap text-cyan-700 bg-cyan-100 text-[10px] font-medium px-2 rounded-full">
      Dynamic
    </div>
  ),
  [AuctionType.Static]: (
    <div className="whitespace-nowrap bg-purple-100 text-purple-800 font-medium text-[10px] px-2 rounded-full">
      Static
    </div>
  ),
}

export const PAYOUT_ASSET_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'payout-asset',
  header: 'Payout Asset',
  cell: (props) => {
    const token = new Token(props.row.original.payoutToken)

    return (
      <div className="flex items-center gap-5">
        <div className="flex">
          <Badge
            className="border-2 border-slate-900 rounded-full z-[11]"
            position="bottom-right"
            badgeContent={
              <NetworkIcon
                chainId={props.row.original.chainId}
                width={14}
                height={14}
              />
            }
          >
            <Currency.IconList iconWidth={26} iconHeight={26}>
              <Currency.Icon disableLink currency={token} />
            </Currency.IconList>
          </Badge>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
            {token.symbol}
            <div
              className={classNames(
                'text-[10px] bg-gray-200 dark:bg-slate-700 rounded-lg px-1 ml-1',
              )}
            />
          </span>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {AUCTION_TYPE_BADGE[props.row.original.auctionType]}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Market Type</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    )
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    headerDescription: 'Token available for purchase',
  },
}

export const PRICE_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'price',
  header: 'Price',
  accessorFn: (row) => row.payoutToken.discountedPriceUSD,
  cell: ({ row: { original } }) => (
    <div className="flex flex-col space-y-1">
      <div className="text-sm font-medium">
        {formatUSD(original.payoutToken.discountedPriceUSD)}
      </div>
      <div className="text-xs text-gray-500">
        {formatUSD(original.payoutToken.priceUSD)} Market
      </div>
    </div>
  ),
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    headerDescription: 'Token price after bond discount',
  },
}

export const DISCOUNT_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'discount',
  header: 'Discount',
  accessorFn: (row) => row.discount,
  cell: (props) => {
    const discount = props.row.original.discount

    if (discount <= 0)
      return <span className="text-red">{formatPercent(discount)}</span>

    return <span className="text-green">{formatPercent(discount)}</span>
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    headerDescription: 'Percentage off current spot price',
  },
}

export const BOND_ASSET_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'bond-asset',
  header: 'Bond Asset',
  cell: (props) => {
    const row = props.row.original

    if (row.quoteToken.pool || row.quoteToken.vault) {
      let token0: Token
      let token1: Token

      if (row.quoteToken.pool) {
        token0 = new Token(row.quoteToken.pool.token0)
        token1 = new Token(row.quoteToken.pool.token1)
      } else {
        token0 = new Token(row.quoteToken.vault.token0)
        token1 = new Token(row.quoteToken.vault.token1)
      }

      return (
        <div className="flex items-center gap-3">
          <Currency.IconList iconWidth={18} iconHeight={18}>
            <Currency.Icon disableLink currency={token0} />
            <Currency.Icon disableLink currency={token1} />
          </Currency.IconList>
          <div className="flex flex-col gap-0.5">
            <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50 whitespace-nowrap">
              {token0.symbol}/{token1.symbol}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {row.quoteToken.name}
            </span>
          </div>
        </div>
      )
    }

    const token = new Token(row.quoteToken)

    return (
      <div className="flex items-center gap-3">
        <Currency.IconList iconWidth={26} iconHeight={26}>
          <Currency.Icon disableLink currency={token} />
        </Currency.IconList>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-50">
            {token.symbol}
          </span>
        </div>
      </div>
    )
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    headerDescription: 'Asset used to purchase the bond',
  },
}

export const VESTING_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'vesting',
  header: 'Vesting',
  accessorFn: (row) => row.vesting,
  cell: (props) => {
    if (!props.row.original.vesting) return <>-</>

    switch (props.row.original.vestingType) {
      case 'Fixed-Term':
        return formatDistance(props.row.original.vesting * 1000, 0)
    }
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
    headerDescription:
      'How long until bought tokens are claimable from the moment they are purchased',
  },
}

export const ISSUER_COLUMN: ColumnDef<Bond, unknown> = {
  id: 'issuer',
  header: 'Issuer',
  cell: (props) => {
    const bond = props.row.original

    if (!bond.issuer) return <>Unknown</>

    return (
      // Cannot use <a> because of some weird SSR behavior
      <div
        onKeyUp={(e) => {
          e.preventDefault()
          window.open(bond.issuer!.link, '_blank')
        }}
        onClick={(e) => {
          e.preventDefault()
          window.open(bond.issuer!.link, '_blank')
        }}
        className="cursor-pointer text-blue hover:underline"
      >
        {bond.issuer.name}
      </div>
    )
  },
  meta: {
    skeleton: <SkeletonText fontSize="lg" />,
  },
}
