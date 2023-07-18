import { Token, tryParseAmount } from '@sushiswap/currency'

export const rewardPerDay = ({
  start,
  end,
  amount,
  token,
}: {
  start: number
  end: number
  amount: number
  token: Token
}) => {
  const days = (end - start) / 3600 / 24
  return tryParseAmount((amount / days).toFixed(8), token)
}
