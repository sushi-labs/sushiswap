import numeral from 'numeral'

export const formatPercent = (value: any) => {
  if (value === 0) {
    return '0.00%'
  }

  if (value < 0.0001) {
    return '<0.01%'
  }

  if (value > 1000) {
    return '>100000%'
  }

  return numeral(value).format('(0.00%)')
}
