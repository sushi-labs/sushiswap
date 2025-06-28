import {
  Currency,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@sushiswap/ui"
import { DollarCircledIcon } from "@sushiswap/ui/icons/DollarCircled"
import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { TwapFill } from "src/lib/hooks/react-query/twap"
import { formatUSD, shortenHash } from "sushi/format"
import { formatNumber } from "sushi/format"

export const DATE_COLUMN: ColumnDef<TwapFill> = {
  id: "date",
  header: "Date",
  enableSorting: false,
  accessorFn: (row) => row,
  cell: ({ row }) =>
    format(new Date(row.original.timestamp), "MM/dd/yy h:mm a"),
}

export const BUY_COLUMN: ColumnDef<TwapFill> = {
  id: "buy",
  header: "Buy",
  enableSorting: false,

  accessorFn: (row) => row.buyAmount,
  cell: ({ row }) => {
    if (!row.original.buyToken) return null
    return (
      <div className="flex items-center gap-2">
        <Currency.Icon
          currency={row.original?.buyToken}
          width={18}
          height={18}
        />
        <span>
          {formatNumber(row.original.buyAmount, 4)}{" "}
          {row.original.buyToken?.symbol}
        </span>
      </div>
    )
  },
}

export const SELL_COLUMN: ColumnDef<TwapFill> = {
  id: "sell",
  header: "Sell",
  enableSorting: false,

  accessorFn: (row) => row.sellAmount,
  cell: ({ row }) => {
    if (!row.original.sellToken) return null
    return (
      <div className="flex items-center gap-2">
        <Currency.Icon
          currency={row.original.sellToken}
          width={18}
          height={18}
        />
        <span>
          {formatNumber(row.original.sellAmount, 4)}{" "}
          {row.original.sellToken.symbol}
        </span>
      </div>
    )
  },
}

export const VALUE_COLUMN: ColumnDef<TwapFill> = {
  id: "valueUsd",
  header: "Value",
  enableSorting: false,
  accessorFn: (row) => "",
  cell: ({ row }) => <span>{formatUSD(row.original.buyAmountUsd)}</span>,
}

export const PRICE_USD_COLUMN: ColumnDef<TwapFill> = {
  id: "priceUsd",
  enableSorting: false,

  header: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-start gap-1">
            <span>Price</span>
            <span className="inline-flex items-center dark:text-skyblue text-blue font-normal gap-[1px] border-b border-dashed border-current">
              <DollarCircledIcon className="w-3 h-3" />
              <span>USD</span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="dark:bg-black/10 bg-white/10 py-4 px-5 !text-slate-900 dark:!text-pink-100 text-xs"
        >
          <p>Toggle to view price in USD or token pair unit.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  accessorFn: (row) => "",
  cell: ({ row }) => <span>{formatUSD(row.original.sellAmountUsd)}</span>,
}

export const TX_HASH_COLUMN: ColumnDef<TwapFill> = {
  id: "txHash",
  header: "Tx Hash",
  enableSorting: false,
  accessorFn: (row) => row.txHash,
  cell: ({ row }) => {
    if (!row.original.txHash) return null

    return (
      <a
        href={row.original.explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-blue"
      >
        {shortenHash(row.original.txHash)}
      </a>
    )
  },
}
