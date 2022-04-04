import Numeral from 'numeral'

export const formatUSD = (value: string) => Numeral(value).format('($0.00a)')
