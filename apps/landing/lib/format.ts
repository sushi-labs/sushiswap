import Numeral from 'numeral'

var priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const toK = (num) => {
  return Numeral(num).format('0.[00]a')
}

export function rawPercent(percentRaw) {
  const percent = parseFloat(percentRaw * 100)
  if (!percent || percent === 0) {
    return '0%'
  }
  if (percent < 1 && percent > 0) {
    return '< 1%'
  }
  return percent.toFixed(0) + '%'
}

export const formattedNum = (number, usd = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : 0
  }
  let num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0), true)
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd
      ? '$' + Number(parseFloat(num).toFixed(0)).toLocaleString()
      : '' + Number(parseFloat(num).toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return '$' + Number(parseFloat(num).toFixed(4))
    } else {
      const usdString = priceFormatter.format(num)
      return '$' + usdString.slice(1, usdString.length)
    }
  }

  return Number(parseFloat(num).toFixed(5))
}

export const formattedCountUp = (number, usd = false) => {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? { prefix: '$', number: 0, suffix: '' } : { prefix: '', number: 0, suffix: '' }
  }
  const num = parseFloat(number)

  if (num > 500000000) {
    const formatted = toK(num.toFixed(0), true)
    const elements = formatted.split('')
    const suffix = elements.pop()
    const number = elements.join('')
    //console.log('formatted:', number, suffix)
    return usd ? { prefix: '$', number: number, suffix: suffix } : { prefix: '', number: number, suffix: suffix }
  }

  if (num === 0) {
    if (usd) {
      return { prefix: '$', number: 0, suffix: '' }
    }
    return { prefix: '', number: 0, suffix: '' }
  }

  if (num < 0.0001 && num > 0) {
    return usd ? { prefix: '< $', number: 0.0001, suffix: '' } : { prefix: '<', number: 0.0001, suffix: '' }
  }

  if (num > 1000) {
    const formatted = Number(parseFloat(num).toFixed(0)).toLocaleString()
    return usd ? { prefix: '$', number: formatted, suffix: '' } : { prefix: '', number: formatted, suffix: '' }
  }

  if (usd) {
    if (num < 0.1) {
      return { prefix: '$', number: Number(parseFloat(num).toFixed(4)), suffix: '' }
    } else {
      const usdString = priceFormatter.format(num)
      return { prefix: '$', number: usdString.slice(1, usdString.length), suffix: '' }
    }
  }

  return Number(parseFloat(num).toFixed(5))
}
