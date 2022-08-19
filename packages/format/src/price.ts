import numeral from 'numeral'

export const formatUSD = (value: string | number, inputString = '$0.00a') => {
  return numeral(value).format(inputString)
}
