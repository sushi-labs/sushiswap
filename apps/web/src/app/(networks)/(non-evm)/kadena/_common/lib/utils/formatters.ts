import { Decimal } from 'decimal.js-light'
import { withoutScientificNotation } from 'sushi'
import TronWeb from 'tronweb'

export const truncateText = (str: string | `0x${string}`, n = 5): string => {
  if (str) {
    if (str.length <= n) {
      return str
    }
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`
  }
  return ''
}

export const hashStringToColor = (str: string) => {
  const hash = _djb2(str)
  const r = (hash & 0xff0000) >> 16
  const g = (hash & 0x00ff00) >> 8
  const b = hash & 0x0000ff
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`
}

const _djb2 = (str: string) => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i) /* hash * 33 + c */
  }
  return hash
}

export const toBigNumber = (amount: string | number) => {
  return TronWeb.toBigNumber(amount)
}

export const formatUnits = (
  amount: string | number,
  decimals: number,
  maxDecimals?: number,
): string => {
  if (Number.isNaN(Number(amount))) {
    return '0'
  }
  const val = TronWeb.toBigNumber(amount).div(10 ** decimals)
  if (Number(val) < 0.0001) {
    return '<0.0001'
  }
  if (maxDecimals) {
    return toBigNumber(
      Number.parseFloat(val.toFixed(maxDecimals)).toString(),
    ).toString(10)
  }
  return toBigNumber(
    Number.parseFloat(val.toFixed(decimals)).toString(),
  ).toString(10)
}

export const formatUnitsForInput = (
  amount: string | number,
  decimals: number,
): string => {
  if (Number.isNaN(Number(amount))) {
    return '0'
  }

  const _decimals = toBigNumber(10).pow(decimals)

  const val = TronWeb.toBigNumber(amount).div(_decimals)
  if (Number.isNaN(val)) {
    return '0'
  }

  return toBigNumber(
    Number.parseFloat(val.toFixed(decimals)).toString(),
  ).toString(10)
}

export const formatNumberWithMaxDecimals = (
  value: string | number,
  maxDecimal = 3,
): string => {
  if (typeof value === 'string') value = Number(value)

  let negative = false
  if (value < 0) {
    negative = true
    value = Math.abs(value)
  }

  if (value > 999_000_000_000_000) return '>999t'
  if (value === 0) return '0.00'
  if (value < 0.0001) return value.toFixed(6)
  if (value < 0.001) return value.toFixed(4)
  if (value < 0.01) return value.toFixed(3)

  return `${negative ? '-' : ''}${Number(Number(value).toFixed(maxDecimal))}`
}

export const formatPactDecimal = (value: number): string => {
  const dec = new Decimal(value)
  return dec.toFixed(dec.dp() > 0 ? dec.dp() : 1)
}

export function formatToMaxDecimals(
  amount: string | number,
  maxDecimals: number,
): string {
  try {
    const normalized =
      typeof amount === 'string'
        ? withoutScientificNotation(amount)
        : String(amount)

    if (!normalized) return '0'

    const value = new Decimal(normalized)
    const truncated = value.toDecimalPlaces(maxDecimals, Decimal.ROUND_DOWN)

    return truncated.toFixed(maxDecimals).replace(/\.?0+$/, '')
  } catch {
    return '0'
  }
}
