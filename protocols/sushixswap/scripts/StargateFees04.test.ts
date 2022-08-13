import { BigNumber } from 'ethers'
import hre from 'hardhat'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import { getBigNumber, getStarGateFeesV04 } from '@sushiswap/tines'

export function getRandom(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return getBigNumber(res)
}

describe('Stargate fees', function () {
  it('Some values check', async function () {
    const testSeed = '0' // Change it to change random generator values
    const rnd: () => number = seedrandom(testSeed) // random [0, 1)

    const FeeCalcFactory = await hre.ethers.getContractFactory('StargateFeeV04Extraction')
    const FeeCalcContract = await FeeCalcFactory.deploy()

    for (let i = 0; i < 10; ++i) {
      const bridgeState = {
        currentAssetSD: getRandom(rnd, 1e8, 1e20),
        lpAsset: getRandom(rnd, 1e8, 1e20),
        eqFeePool: getRandom(rnd, 1e8, 1e20),
        idealBalance: getRandom(rnd, 1e8, 1e20),
        currentBalance: getRandom(rnd, 1e8, 1e20),
        allocPointIsPositive: rnd() > 0.5,
      }
      const whitelisted = rnd() > 0.5
      const currentBalance = parseInt(bridgeState.currentBalance.toString())

      for (let j = 0; j < 10; ++j) {
        const amountSD = getRandom(rnd, Math.pow(currentBalance, 0.25), currentBalance)

        const feesContract = await FeeCalcContract.getFees(bridgeState, whitelisted, amountSD)
        const feesTypescript = getStarGateFeesV04(bridgeState, whitelisted, amountSD)

        // console.log(feesContract)
        // console.log(feesTypescript)
        // console.log(i, j)

        expect(feesTypescript.eqFee.eq(feesContract.eqFee)).equal(true)
        expect(feesTypescript.eqReward.eq(feesContract.eqReward)).equal(true)
        expect(feesTypescript.lpFee.eq(feesContract.lpFee)).equal(true)
        expect(feesTypescript.protocolFee.eq(feesContract.protocolFee)).equal(true)
      }
    }
  })
})
