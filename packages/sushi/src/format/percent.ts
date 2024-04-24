import numeral from 'numeral'

export const formatPercent = (value: any) => {
  let negative = false

  if (value < 0) {
    negative = true
    value = Math.abs(value)
  }

  if (value === 0) {
    return '0.00%'
  }

  if (value < 0.0001) {
    return '<0.01%'
  }

  if (value > 1000) {
    return '>100000%'
  }

  return `${negative ? '-' : ''}${numeral(value).format('(0.00%)')}`
}
