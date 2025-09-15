import { Decimal } from 'decimal.js-light'

export const truncateText = (str: string, n = 5): string => {
  if (str) {
    if (str.length <= n) {
      return str
    }
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`
  }
  return ''
}

export const formatPactDecimal = (value: number): string => {
  const dec = new Decimal(value)
  return dec.toFixed(dec.dp() > 0 ? dec.dp() : 1)
}
