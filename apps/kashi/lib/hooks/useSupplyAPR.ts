import { formatPercent } from '@sushiswap/format'
import { JSBI } from '@sushiswap/math'

import { KashiPair as KashiPairDTO } from '.graphclient'

const PROTOCOL_FEE = JSBI.BigInt('10000') // 10%
const PROTOCOL_FEE_DIVISOR = JSBI.BigInt('100000')

const takeFee = (amount: JSBI) =>
  JSBI.subtract(amount, JSBI.divide(JSBI.multiply(amount, PROTOCOL_FEE), PROTOCOL_FEE_DIVISOR))

export const useSupplyAPR = (pair: KashiPairDTO) => {
  const interestPerYear = takeFee(
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(JSBI.BigInt(pair.accrueInfo.interestPerSecond), JSBI.BigInt(31556952)),
        JSBI.BigInt(pair.utilization)
      ),
      JSBI.BigInt(1e18)
    )
  )

  // TODO: If accrue was called we can show diff APR...
  // encourages/discourages lenders to call accrue
  // const interestPerYearPreview =

  // console.log(pair.id, pair.supplyAPR, interestPerYear.toString())

  // return new Percent(pair.supplyAPR, 1e18).toSignificant(6)

  return formatPercent(pair.totalBorrow.base === '0' ? 0.01 : Math.max(pair.supplyAPR / 1e18, 0.00025))
}
