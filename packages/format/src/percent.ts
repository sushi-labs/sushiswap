import numeral from 'numeral'

export const formatPercent = (value: any) => {
  return numeral(value).format('(0.00%)')
}
