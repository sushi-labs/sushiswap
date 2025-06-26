export const getTextColor = (value: number) => {
  if (value === 0) return ''
  return value > 0 ? 'text-green-500' : 'text-red'
}

export const getChangeSign = (value: number) => {
  if (value === 0) return ''
  return value > 0 ? '+' : '-'
}
