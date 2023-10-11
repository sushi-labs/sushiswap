import numeral from 'numeral'

export const formatNumber = (value: any) => {
  return numeral(value).format('(0.00a)')
}
