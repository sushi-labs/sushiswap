import numeral from 'numeral'

export const formatUSD = (value: string) => numeral(value).format('($0.00a)')
