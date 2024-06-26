// import numeral from 'numbro'

// export const formatNumber = (value: any, inputString = '0.[00]a') => {
//   if (typeof value === 'string') value = Number(value)

//   let negative = false
//   if (value < 0) {
//     negative = true
//     value = Math.abs(value)
//   }

//   if (value === 0) return '0.00'
//   if (value < 0.0001) return numeral(value).format('0.[000000]a')
//   if (value < 0.001) return numeral(value).format('0.[0000]a')
//   if (value < 0.01) return numeral(value).format('0.[000]a')
//   return `${negative ? '-' : ''}${numeral(value).format(inputString)}`
// }

export const formatNumber = (
  value: string | number,
  maxDecimalPlaces = 2,
): string => {
  value = value ?? 0
  if (typeof value === 'string') value = Number(value)

  let negative = false
  if (value < 0) {
    negative = true
    value = Math.abs(value)
  }

  if (value === 0) return '0.00'
  if (value < 0.0001) return value.toFixed(6)
  if (value < 0.001) return value.toFixed(4)
  if (value < 0.01) return value.toFixed(3)

  return `${negative ? '-' : ''}${formatValueWithSuffix(
    value,
    maxDecimalPlaces,
  )}`
}

const formatValueWithSuffix = (
  value: number,
  maxDecimalPlaces: number,
): string => {
  const suffixes: string[] = ['', 'k', 'm', 'b', 't']
  let suffixIndex = 0
  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000
    suffixIndex++
  }

  const decimalCount = Math.min(
    value.toString().split('.')[1]?.length || 0,
    maxDecimalPlaces,
  )

  const formattedValue = withoutScientificNotation(value.toFixed(decimalCount))
  return `${formattedValue}${suffixes[suffixIndex]}`
}

/**
 * Convert scientific notation into decimal form, e.g. "-12.34e-5" => "-0.0001234",
 * @param value Number in scientific notation
 * @return Number in decimal form only
 */
export function withoutScientificNotation(value: string): string | undefined {
  if (!value.includes('e')) return value

  if (!value.match(/^-?\d*\.?\d+(e[+-]?\d+)?$/)) return undefined

  const [sign, absValue] = value.startsWith('-')
    ? ['-', value.slice(1)]
    : ['', value]
  const [m, n] = absValue.split('e') as [string, string]
  const [integer, fraction] = m.split('.')

  const mantissa = (integer + (fraction ?? '')).replace(/^0+/, '')
  const exponent = parseInt(n ?? 0) - (fraction ?? '').length

  if (exponent >= 0) {
    return sign + mantissa + '0'.repeat(exponent)
  } else {
    const i = mantissa.length + exponent
    if (i > 0) {
      return `${sign + mantissa.slice(0, i)}.${mantissa.slice(i) || 0}`
    } else {
      return `${sign}0.${'0'.repeat(-i)}${mantissa}`
    }
  }
}
