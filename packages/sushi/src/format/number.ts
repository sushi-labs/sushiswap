import numeral from 'numeral'

export const formatNumber = (value: any) => {
  if (value < 0.0001) {
    return '<0.01%'
  }

  return numeral(value).format('(0.00a)')
}
