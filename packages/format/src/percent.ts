import Numeral from 'numeral'

export const formatPercent = (value: string) => Numeral(value).format('0.00%')
