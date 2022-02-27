import Numeral from 'numeral'

export const toK = (num) => {
  return Numeral(num).format('0.[00]a')
}

export function rawPercent(percentRaw) {
  const percent = parseFloat(String(percentRaw * 100))
  if (!percent || percent === 0) {
    return '0%'
  }
  if (percent < 1 && percent > 0) {
    return '< 1%'
  }
  return percent.toFixed(0) + '%'
}
