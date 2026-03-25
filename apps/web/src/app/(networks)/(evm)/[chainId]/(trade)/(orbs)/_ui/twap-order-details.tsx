import { fillDelayText, OrderType, Token } from '@orbs-network/spot-react'
import {
  Button,
  classNames,
  FormattedNumber,
  List,
  SkeletonText,
} from '@sushiswap/ui'
import { format, formatDistanceStrict } from 'date-fns'
import { formatUSD, shortenAddress } from 'sushi'
import { EvmChainId, getEvmChainById } from 'sushi/evm'
import { Address } from 'viem'

const PriceRateRow = ({
  price,
  usd,
  fromSymbol,
  toSymbol,
  className,
}: {
  price?: string
  usd?: string
  fromSymbol?: string
  toSymbol?: string
  className?: string
}) => {
  if (!price) {
    return <>-</>
  }
  return (
    <span
      className={classNames(
        'flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar',
        className,
      )}
    >
      1 {fromSymbol} =
      <FormattedNumber number={price} /> {toSymbol}{' '}
      {usd ? (
        <span className="text-muted-foreground text-xs">
          ({formatUSD(usd)})
        </span>
      ) : null}
    </span>
  )
}

const LimitPrice = ({
  limitPrice,
  token0PriceUSD,
  fromSymbol,
  toSymbol,
  valueClassName,
}: {
  limitPrice?: string
  token0PriceUSD?: string
  fromSymbol?: string
  toSymbol?: string
  valueClassName?: string
}) => {
  if (!limitPrice) return null
  return (
    <List.KeyValue
      className="!p-0"
      title={<span className="whitespace-nowrap">Limit price</span>}
      flex
    >
      <PriceRateRow
        className={valueClassName}
        price={limitPrice}
        usd={token0PriceUSD}
        fromSymbol={fromSymbol}
        toSymbol={toSymbol}
      />
    </List.KeyValue>
  )
}

const SellTotal = ({
  inputAmount,
  inputSymbol,
  valueClassName,
}: {
  inputAmount?: string
  inputSymbol?: string
  valueClassName?: string
}) => {
  return (
    <List.KeyValue title="Sell Total" className="!p-0">
      <span className={valueClassName}>
        <FormattedNumber number={inputAmount} /> {inputSymbol}
      </span>
    </List.KeyValue>
  )
}

const NumberOfOrders = ({
  totalChunks,
  valueClassName,
}: {
  totalChunks?: number
  valueClassName?: string
}) => {
  return (
    <List.KeyValue title="Number of Trades" className="!p-0">
      <span className={valueClassName}>{totalChunks}</span>
    </List.KeyValue>
  )
}

const Date = ({ date }: { date?: number }) => {
  if (!date) return <SkeletonText />
  return <>{format(date, "MMMM d, yyyy 'at' h:mm a")}</>
}

const StartDate = ({
  startDate,
  valueClassName,
}: {
  startDate?: number
  valueClassName?: string
}) => {
  return (
    <List.KeyValue title="Start Date" className="!p-0">
      <span className={valueClassName}>
        <Date date={startDate} />
      </span>
    </List.KeyValue>
  )
}

const EndDate = ({
  endDate,
  valueClassName,
}: {
  endDate?: number
  valueClassName?: string
}) => {
  return (
    <List.KeyValue title="Est. End Date" className="!p-0">
      <span className={valueClassName}>
        <Date date={endDate} />
      </span>
    </List.KeyValue>
  )
}

const SellPerOrder = ({
  amountInPerChunk,
  inputSymbol,
  title,
  valueClassName,
}: {
  amountInPerChunk?: string
  inputSymbol?: string
  title?: string
  valueClassName?: string
}) => {
  if (!amountInPerChunk) return null
  return (
    <List.KeyValue title={title ? title : 'Sell per Order'} className="!p-0">
      <span className={valueClassName}>
        <FormattedNumber number={amountInPerChunk} /> {inputSymbol}
      </span>
    </List.KeyValue>
  )
}

const TradeInterval = ({
  fillDelay,
  valueClassName,
}: {
  fillDelay?: number
  valueClassName?: string
}) => {
  if (!fillDelay) return null

  return (
    <List.KeyValue title="Order Interval" className="!p-0">
      <span className={valueClassName}>
        {formatDistanceStrict(0, fillDelay, {
          roundingMethod: 'floor',
        })}
      </span>
    </List.KeyValue>
  )
}

const Recipient = ({
  recipient,
  chainId,
  valueClassName,
}: {
  recipient?: Address
  chainId?: number
  valueClassName?: string
}) => {
  return (
    <List.KeyValue title="Recipient" className="!p-0">
      <span className={valueClassName}>
        <Button variant="link" size="sm" asChild>
          <a
            target="_blank"
            href={getEvmChainById(chainId as EvmChainId).getAccountUrl(
              recipient as Address,
            )}
            rel="noreferrer"
          >
            {shortenAddress(recipient as Address)}
          </a>
        </Button>
      </span>
    </List.KeyValue>
  )
}

const TriggerPrice = ({
  triggerPrice,
  fromToken,
  toToken,
  token0PriceUSD,
  valueClassName,
}: {
  triggerPrice?: string
  fromToken?: Token
  toToken?: Token
  token0PriceUSD?: string
  valueClassName?: string
}) => {
  if (!triggerPrice) return null
  return (
    <List.KeyValue
      className="!p-0"
      title={<span className="whitespace-nowrap">Trigger price</span>}
      flex
    >
      <PriceRateRow
        className={valueClassName}
        price={triggerPrice}
        usd={token0PriceUSD}
        fromSymbol={fromToken?.symbol}
        toSymbol={toToken?.symbol}
      />
    </List.KeyValue>
  )
}

export const DcaChunksRow = ({
  orderType,
  fillDelay,
  totalTrades,
}: {
  orderType?: OrderType
  fillDelay?: number
  totalTrades?: number
}) => {
  if (orderType !== OrderType.TWAP_LIMIT && orderType !== OrderType.TWAP_MARKET)
    return

  return (
    <>
      {`Every ${fillDelayText(fillDelay)} over ${totalTrades} order${
        totalTrades && totalTrades > 1 ? 's' : ''
      }`}
    </>
  )
}

export const TwapOrderDetails = {
  LimitPrice,
  SellTotal,
  NumberOfOrders,
  StartDate,
  EndDate,
  SellPerOrder,
  TradeInterval,
  Recipient,
  TriggerPrice,
  DcaChunksRow,
  PriceRateRow,
  Date,
}
