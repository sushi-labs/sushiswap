import numeral from 'numeral'

export const formatNumber = (value: any) => {
  return numeral(value).format('(0.00a)')
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
