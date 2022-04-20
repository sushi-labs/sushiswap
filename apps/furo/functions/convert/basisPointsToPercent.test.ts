import { JSBI, Percent } from '@sushiswap/core-sdk'

import { basisPointsToPercent } from './basisPointsToPercent'

describe('#basisPointsToPercent', () => {
  it('converts basis points numbers to percents', () => {
    expect(basisPointsToPercent(100).equalTo(new Percent(JSBI.BigInt(1), JSBI.BigInt(100)))).toBeTruthy()
    expect(basisPointsToPercent(500).equalTo(new Percent(JSBI.BigInt(5), JSBI.BigInt(100)))).toBeTruthy()
    expect(basisPointsToPercent(50).equalTo(new Percent(JSBI.BigInt(5), JSBI.BigInt(1000)))).toBeTruthy()
  })
})
