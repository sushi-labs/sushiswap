import numeral from 'numeral'

export const formatPercent = (value: any) => numeral(value).format('0.00%')
