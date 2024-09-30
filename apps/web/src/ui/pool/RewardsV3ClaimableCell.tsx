import { Row } from '@tanstack/react-table'
import { FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { AngleRewardsPool } from 'src/lib/hooks/react-query'
import { formatNumber } from 'sushi/format'

export const RewardsV3ClaimableCell: FC<Row<AngleRewardsPool>> = ({
  original,
}) => {
  const unclaimed = useMemo(
    () => Object.values(original.rewardsPerToken).map((el) => el.unclaimed),
    [original],
  )
  const dollarValues = useTokenAmountDollarValues({
    chainId: original.chainId,
    amounts: unclaimed,
  })
  const totalUnclaimedAmountUSD = useMemo(
    () => dollarValues.reduce((acc, cur) => acc + cur, 0),
    [dollarValues],
  )

  return `$${
    totalUnclaimedAmountUSD === 0 ? '0' : formatNumber(totalUnclaimedAmountUSD)
  }`
}
