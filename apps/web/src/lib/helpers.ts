export const getTextColor = (value: number, fallbackColor?: string) => {
  if (value === 0) return fallbackColor ?? ''
  return value > 0 ? 'text-green-500' : 'text-red'
}

export const getChangeSign = (value: number) => {
  if (value === 0) return ''
  //formatPercent will add the negative sign
  return value > 0 ? '+' : ''
}
