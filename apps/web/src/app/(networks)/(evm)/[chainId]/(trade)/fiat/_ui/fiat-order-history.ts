import { isCrossmintSupportedFiatCurrency } from 'src/config'
import type {
  CrossmintEnvironment,
  CrossmintMoney,
  CrossmintOrder,
} from 'src/lib/crossmint'
import { getChainById } from 'sushi'
import { EvmChainId, type EvmTxHash } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import { SvmChainId } from 'sushi/svm'
import { formatUnits } from 'viem'

const EVM_TRANSACTION_HASH_PATTERN = /^0x[0-9a-fA-F]{64}$/
const SOLANA_TRANSACTION_HASH_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{64,88}$/
const STELLAR_TRANSACTION_HASH_PATTERN = /^[0-9a-fA-F]{64}$/

export interface FiatOrderHistoryRow {
  explorerUrl?: string
  fiatAmount?: CrossmintMoney
  fiatCurrency?: string
  orderId: string
  paymentMethod?: string
  status: string
  timestamp?: string
  tokenAmount?: string
  tokenImageUrl?: string
  tokenSymbol: string
}

export function getFiatOrderHistoryRow(
  order: CrossmintOrder,
  environment: CrossmintEnvironment | undefined,
): FiatOrderHistoryRow {
  const lineItem = order.lineItems?.[0]
  const deliveryToken = lineItem?.delivery?.tokens?.[0]
  const fiatAmount = [
    order.payment?.totalPaid,
    order.payment?.received,
    order.quote?.totalPrice,
    lineItem?.quote?.totalPrice,
  ].find(isFiatMoney)
  const tokenSymbol =
    deliveryToken?.symbol?.trim() || lineItem?.metadata?.name?.trim() || 'Token'
  const timestamp =
    order.createdAt ?? order.quote?.quotedAt ?? lineItem?.delivery?.completedAt

  return {
    explorerUrl: getCrossmintTransactionUrl({
      chain: lineItem?.chain,
      environment,
      txId: lineItem?.delivery?.txId,
    }),
    fiatAmount,
    fiatCurrency:
      fiatAmount?.currency ?? getFiatCurrency(order.payment?.currency),
    orderId: order.orderId,
    paymentMethod: order.payment?.method,
    status: getOrderStatus(order),
    timestamp: isValidTimestamp(timestamp) ? timestamp : undefined,
    tokenAmount: getTokenAmount(deliveryToken, lineItem?.quantity),
    tokenImageUrl: getSafeImageUrl(lineItem?.metadata?.imageUrl),
    tokenSymbol,
  }
}

export function formatFiatOrderMoney(
  money: CrossmintMoney | undefined,
  currency: string | undefined,
  locale: string,
): string {
  const normalizedCurrency = (money?.currency ?? currency)?.toUpperCase()
  const amount = Number(money?.amount)

  if (!money || !Number.isFinite(amount)) {
    return normalizedCurrency ?? '-'
  }

  if (!normalizedCurrency) {
    return formatFiatOrderNumber(money.amount, locale, 2)
  }

  try {
    const formatted = new Intl.NumberFormat(locale, {
      currency: normalizedCurrency,
      style: 'currency',
    }).format(amount)

    return `${formatted} ${normalizedCurrency}`
  } catch {
    return `${formatFiatOrderNumber(money.amount, locale, 2)} ${normalizedCurrency}`
  }
}

export function formatFiatOrderNumber(
  value: string | undefined,
  locale: string,
  maximumFractionDigits = 8,
): string {
  if (!value) return '-'

  const amount = Number(value)

  if (!Number.isFinite(amount)) return value

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(amount)
}

export function formatFiatOrderTimestamp(
  timestamp: string | undefined,
  locale: string,
): string {
  if (!timestamp) return '-'

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function humanizeCrossmintValue(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.toLowerCase() === 'kyc') return 'KYC'
      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    })
    .join(' ')
}

export function shortenFiatOrderId(orderId: string): string {
  if (orderId.length <= 20) return orderId
  return `${orderId.slice(0, 8)}…${orderId.slice(-6)}`
}

function getTokenAmount(
  token:
    | {
        decimals?: number
        quantity?: string
      }
    | undefined,
  lineItemQuantity: number | undefined,
): string | undefined {
  if (token?.quantity) {
    if (
      token.decimals !== undefined &&
      /^\d+$/.test(token.quantity) &&
      token.decimals >= 0
    ) {
      try {
        return formatUnits(BigInt(token.quantity), token.decimals)
      } catch {
        return token.quantity
      }
    }

    return token.quantity
  }

  return lineItemQuantity === undefined ? undefined : String(lineItemQuantity)
}

function getOrderStatus(order: CrossmintOrder): string {
  if (order.phase === 'completed') return 'completed'

  const paymentStatus = order.payment?.status

  if (
    paymentStatus &&
    /cancelled|declined|expired|failed|refunded/.test(
      paymentStatus.toLowerCase(),
    )
  ) {
    return paymentStatus
  }

  return (
    order.lineItems?.find((lineItem) => lineItem.delivery?.status)?.delivery
      ?.status ??
    paymentStatus ??
    order.phase ??
    'unknown'
  )
}

function isFiatMoney(
  money: CrossmintMoney | undefined,
): money is CrossmintMoney {
  return getFiatCurrency(money?.currency) !== undefined
}

function getFiatCurrency(currency: string | undefined): string | undefined {
  if (!currency) return undefined

  const normalizedCurrency = currency.toLowerCase()
  return isCrossmintSupportedFiatCurrency(normalizedCurrency)
    ? normalizedCurrency
    : undefined
}

function isValidTimestamp(timestamp: string | undefined): boolean {
  return timestamp !== undefined && !Number.isNaN(Date.parse(timestamp))
}

function getSafeImageUrl(imageUrl: string | undefined): string | undefined {
  if (!imageUrl) return undefined

  try {
    const url = new URL(imageUrl)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.toString()
      : undefined
  } catch {
    return undefined
  }
}

function getCrossmintTransactionUrl({
  chain,
  environment,
  txId,
}: {
  chain: string | undefined
  environment: CrossmintEnvironment | undefined
  txId: string | undefined
}): string | undefined {
  if (!chain || environment !== 'production' || !txId) return undefined

  const normalizedChain = chain.toLowerCase()

  if (normalizedChain === 'base' && EVM_TRANSACTION_HASH_PATTERN.test(txId)) {
    return getChainById(EvmChainId.BASE).getTransactionUrl(txId as EvmTxHash)
  }

  if (
    normalizedChain === 'solana' &&
    SOLANA_TRANSACTION_HASH_PATTERN.test(txId)
  ) {
    return getChainById(SvmChainId.SOLANA).getTransactionUrl(txId)
  }

  if (
    normalizedChain === 'stellar' &&
    STELLAR_TRANSACTION_HASH_PATTERN.test(txId)
  ) {
    return getChainById(StellarChainId.STELLAR).getTransactionUrl(txId)
  }

  return undefined
}
