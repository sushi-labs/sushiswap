import numeral from 'numeral'

export const formatPercent = (value: any) => {
  if (value < 0.001) {
    return '0.00%'
  }

  return numeral(value).format('0.00%')
}
