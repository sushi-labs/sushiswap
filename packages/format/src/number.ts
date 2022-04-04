import Numeral from 'numeral'

export const formatNumber = (value: any) => Numeral(value).format('(0.00a)')
