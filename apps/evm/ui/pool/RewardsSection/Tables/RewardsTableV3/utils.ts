import { Token, tryParseAmount } from '@sushiswap/currency'

export const rewardPerDay = ({
  start,
  end,
  amount,
  tvl,
  token,
}: {
  start: number
  end: number
  amount: number
  tvl: number
  token: Token
}) => {
  const days = (end - start) / 3600 / 24
  return tryParseAmount(((amount / days) * tvl).toFixed(8), token)
}
