// import numeral from 'numbro'

// export const formatUSD = (
//   value: string | number,
//   inputString = '$0.00a',
// ): string => {
//   if (typeof value === 'string') value = Number(value)

//   let negative = false
//   if (value < 0) {
//     negative = true
//     value = Math.abs(value)
//   }

//   if (value === 0) return '$0.00'
//   if (value < 0.000001) return '<$0.01'
//   if (value < 0.0001) return numeral(value).format('$0.000000a')
//   if (value < 0.001) return numeral(value).format('$0.0000a')
//   if (value < 0.01) return numeral(value).format('$0.000a')
//   return `${negative ? '-' : ''}${numeral(value).format(inputString)}`
// }

export const formatUSD = (value: string | number, inputString = '$0.00a') => {
  value = value ?? 0
  if (typeof value === 'string') value = Number(value)

  let negative = false
  if (value < 0) {
    negative = true
    value = Math.abs(value)
  }

  if (value === 0) return '$0.00'
  if (value < 0.000001) return '<$0.01'
  if (value < 0.0001) return formatValue(value, 6)
  if (value < 0.001) return formatValue(value, 4)
  if (value < 0.01) return formatValue(value, 3)

  return `${negative ? '-' : ''}${formatValueWithSuffix(value, inputString)}`
}

const formatValue = (value: number, decimalPlaces: number) => {
  return `$${value.toFixed(decimalPlaces)}`
}

const formatValueWithSuffix = (value: number, inputString: string) => {
  const suffixes = ['', 'k', 'm', 'b', 't']
  let suffixIndex = 0
  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000
    suffixIndex++
  }

  const format = inputString.replace(/[^0.]/g, '')
  const decimalPlaces = format.split('.')[1]?.length || 0
  return `$${value.toFixed(decimalPlaces)}${suffixes[suffixIndex]}`
}
