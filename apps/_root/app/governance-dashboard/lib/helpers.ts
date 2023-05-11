export function formatNumber(num?: number, decimals = 2) {
  if (!num) return 0
  if (Math.abs(num) < 1_000) {
    return num.toLocaleString('EN', { maximumFractionDigits: decimals }) // Return the number itself if it's less than 1,000
  }

  const units = ['k', 'M', 'G', 'T', 'P']
  const exponent = Math.floor(Math.log10(Math.abs(num)) / 3)
  const unit = units[exponent - 1]
  const value = num / 1000 ** exponent

  return `${parseFloat(value.toFixed(1))}${unit}`
}
