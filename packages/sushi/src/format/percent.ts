export const formatPercent = (value: any) => {
  value = value ?? 0
  let negative = false

  if (value < 0) {
    negative = true
    value = Math.abs(value)
  }

  if (value === 0) {
    return '0.00%'
  }

  if (value < 0.0001) {
    return '<0.01%'
  }

  if (value > 1000) {
    return '>100000%'
  }

  value = value * 100

  const decimalCount = Math.min(value.toString().split('.')[1]?.length || 0, 2)

  return `${negative ? '-' : ''}${value.toFixed(decimalCount)}%`
}
