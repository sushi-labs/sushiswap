import numeral from 'numeral'

export const formatUSD = (value: string | number, inputString = '$0.00a'): string => {
  if (typeof value === 'string') value = Number(value)
  if (value === 0) return '$0.00'
  if (value < 0.000001) return '<$0.01'
  if (value < 0.0001) return numeral(value).format('$0.000000a')
  if (value < 0.001) return numeral(value).format('$0.0000a')
  if (value < 0.01) return numeral(value).format('$0.000a')
  return numeral(value).format(inputString)
}
