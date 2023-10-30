import numeral from 'numeral'

export const formatPercent = (value: any) => {
  const _val = Number(value / 100).toLocaleString('en-US', {
    useGrouping: false,
  })

  if (value < 0.0001) {
    return '<0.01%'
  }

  if (value > 100000) {
    return `${Number.parseFloat(_val).toExponential(3)}%`
  }

  return numeral(value).format('(0.00%)')
}
