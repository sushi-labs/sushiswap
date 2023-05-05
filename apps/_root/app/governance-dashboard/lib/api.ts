import { ChainId } from '@sushiswap/chain'
import { SUSHI_ADDRESS } from '@sushiswap/currency'

export function formatNumber(num: number) {
  if (Math.abs(num) < 1_000) {
    return num // Return the number itself if it's less than 1,000
  }

  const units = ['k', 'M', 'G', 'T', 'P']
  const exponent = Math.floor(Math.log10(Math.abs(num)) / 3)
  const unit = units[exponent - 1]
  const value = num / 1000 ** exponent

  return `${parseFloat(value.toFixed(1))}${unit}`
}

export async function getSushiPriceUSD() {
  const prices = await fetch('https://token-price.sushi.com/v0/1').then((data) => data.json())
  return prices[SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase()]
}
