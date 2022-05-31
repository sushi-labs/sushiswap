// CONVENTION formatFoo -> string

import { getAddress } from '@ethersproject/address'
import { BigNumberish } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, Fraction, JSBI, Price } from '@sushiswap/core-sdk'
// @ts-ignore TYPE NEEDS FIXING
import Numeral from 'numeral'

// @ts-ignore TYPE NEEDS FIXING
export const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const formatK = (value: string) => {
  return Numeral(value).format('0.[00]a')
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  try {
    const parsed = getAddress(address)
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
}

// shorten string to its maximum length using three dots
export function shortenString(string: string, length: number): string {
  if (!string) return ''
  if (length < 5) return string
  if (string.length <= length) return string
  return string.slice(0, 4) + '...' + string.slice(string.length - length + 5, string.length)
}

// using a currency library here in case we want to add more in future
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const decimalFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 4,
})

// @ts-ignore TYPE NEEDS FIXING
export function formatPercent(percentString, fallback = '-') {
  const percent = parseFloat(percentString)

  if (!percent) {
    return fallback
  }

  if (percent === Infinity || percent === 0) {
    return '0%'
  }

  if (percent < 0.0001 && percent > 0) {
    return '< 0.0001%'
  }
  if (percent < 0 && percent > -0.0001) {
    return '< 0.0001%'
  }
  const fixedPercent = percent.toFixed(2)
  if (fixedPercent === '0.00') {
    return '0%'
  }
  if (Number(fixedPercent) > 0) {
    if (Number(fixedPercent) > 100) {
      return `${percent?.toFixed(0).toLocaleString()}%`
    } else {
      return `${fixedPercent}%`
    }
  } else {
    return `${fixedPercent}%`
  }
}

export const formatNumber = (number: any, usd = false, scale = true, decimals = 0) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : '0'
  }
  const num = parseFloat(number)

  if (num > 500000000 && scale) {
    return (usd ? '$' : '') + formatK(num.toFixed(decimals))
  }

  if (num === 0) {
    if (usd) {
      return '$0.00'
    }
    return '0'
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000 || num < -1000) {
    return (
      (num > 1000 ? '' : '-') +
      (usd ? '$' : '') +
      Number(parseFloat(String(Math.abs(num))).toFixed(decimals)).toLocaleString()
    )
  }

  if (usd) {
    if (num < 0.1) {
      return '$' + Number(parseFloat(String(num)).toFixed(4))
    } else {
      const usdString = priceFormatter.format(num)
      return '$' + usdString.slice(1, usdString.length)
    }
  }

  return parseFloat(String(num)).toPrecision(4)
}

export function formatNumberScale(number: any, usd = false) {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0.00' : '0'
  }
  const num = parseFloat(number)
  const wholeNumberLength = String(Math.floor(num)).length

  if (wholeNumberLength >= 13) return (usd ? '$' : '') + (num / Math.pow(10, 12)).toFixed(1) + 'T'
  if (wholeNumberLength >= 10) return (usd ? '$' : '') + (num / Math.pow(10, 9)).toFixed(1) + 'B'
  if (wholeNumberLength >= 7) return (usd ? '$' : '') + (num / Math.pow(10, 6)).toFixed(1) + 'M'
  if (wholeNumberLength >= 4) return (usd ? '$' : '') + (num / Math.pow(10, 3)).toFixed(1) + 'K'

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  return (usd ? '$' : '') + num.toFixed(2)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const formatBalance = (value: BigNumberish, decimals = 18, maxFraction = 0) => {
  const formatted = formatUnits(value, decimals)
  if (maxFraction > 0) {
    const split = formatted.split('.')
    if (split.length > 1) {
      return split[0] + '.' + split[1].substr(0, maxFraction)
    }
  }
  return formatted
}

export function formatCurrencyAmount(amount: CurrencyAmount<Currency> | undefined, sigFigs: number) {
  if (!amount) {
    return '-'
  }

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return '0'
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return '<0.00001'
  }

  return amount.toSignificant(sigFigs)
}

export function formatPrice(price: Price<Currency, Currency> | undefined, sigFigs: number) {
  if (!price) {
    return '-'
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    return '<0.0001'
  }

  return price.toSignificant(sigFigs)
}

export function formatDateAgo(date: Date) {
  const currentDate = new Date()
  const secondsAgo = Math.floor((currentDate.getTime() - date.getTime()) / 1000)

  if (secondsAgo < 60) return `${secondsAgo} Second${secondsAgo === 1 ? '' : 's'} Ago`
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} Minute${secondsAgo / 120 >= 1 ? 's' : ''} Ago`
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} Hour${secondsAgo / 7200 >= 1 ? 's' : ''} Ago`
  if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 86400)} Day${secondsAgo / 172800 >= 1 ? 's' : ''} Ago`
  if (secondsAgo < 31536000)
    return `${Math.floor(secondsAgo / 2592000)} Month${secondsAgo / 5184000 >= 1 ? 's' : ''} Ago`

  return `${Math.floor(secondsAgo / 31536000)} Year${secondsAgo / 63072000 >= 1 ? 's' : ''} Ago`
}

export const formatDate = (date: Date) =>
  `${date.toLocaleDateString('default', { month: 'short' })} ${date.getDate()}, '${String(date.getFullYear()).replace(
    '20',
    ''
  )}`
