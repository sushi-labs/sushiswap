import { Token, tryParseAmount } from '@sushiswap/currency'

export const rewardPerDay = ({
  start,
  end,
  amount,
  tvl,
  userTVL,
  token,
}: {
  start: number
  end: number
  amount: number
  tvl: number
  userTVL: number
  token: Token
}) => {
  const days = (end - start) / 3600 / 24
  return tryParseAmount(((amount / days) * (userTVL / tvl)).toFixed(8), token)
}
