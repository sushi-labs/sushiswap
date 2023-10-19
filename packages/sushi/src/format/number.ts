import numeral from 'numeral'

export const formatNumber = (value: any) => {
  const _val = Number(value).toLocaleString('en-US', {
    useGrouping: false,
  })

  if (value < 0.0001) {
    return '<0.01%'
  }

  if (value > 100000) {
    return `${Number.parseFloat(_val).toExponential(3)}%`
  }

  return numeral(value).format('(0.00a)')
}
