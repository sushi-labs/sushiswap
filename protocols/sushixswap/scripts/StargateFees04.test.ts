import { BigNumber } from 'ethers'
import hre from 'hardhat'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import { getBigNumber } from '@sushiswap/tines'

interface BridgeState {
  currentAssetSD: BigNumber
  lpAsset: BigNumber
  eqFeePool: BigNumber
  idealBalance: BigNumber
  currentBalance: BigNumber
  allocPointIsPositive: boolean
}

interface Fees {
  eqFee: BigNumber
  eqReward: BigNumber
  lpFee: BigNumber
  protocolFee: BigNumber
}

const ZERO = BigNumber.from(0)
const E14 = BigNumber.from(10).pow(14)
const E13 = BigNumber.from(10).pow(13)
const E17 = BigNumber.from(10).pow(17)
const DENOMINATOR = BigNumber.from(10).pow(18)
const DELTA_1 = BigNumber.from(6000).mul(E14)
const DELTA_2 = BigNumber.from(500).mul(E14)
const LAMBDA_1 = BigNumber.from(40).mul(E14)
const LAMBDA_2 = BigNumber.from(9960).mul(E14)
const LP_FEE = BigNumber.from(10).mul(E13)
const PROTOCOL_FEE = BigNumber.from(50).mul(E13)
const PROTOCOL_SUBSIDY = BigNumber.from(3).mul(E13)
const FIFTY_PERCENT = BigNumber.from(5).mul(E17)
const SIXTY_PERCENT = BigNumber.from(6).mul(E17)

function getStarGateFeesV04(state: BridgeState, whitelisted: boolean, amountSD: BigNumber): Fees {
  const eqReward = getEqReward(state, amountSD)

  // calculate the equilibrium fee
  const { eqFee, protocolSubsidy } = getEquilibriumFee(state, amountSD)

  // calculate protocol and lp fee
  const { protocolFee, lpFee } = whitelisted
    ? { protocolFee: ZERO, lpFee: ZERO }
    : getProtocolAndLpFee(state, amountSD, protocolSubsidy)

  return {
    eqFee,
    eqReward,
    lpFee,
    protocolFee,
  }
}

function getEqReward(state: BridgeState, amountSD: BigNumber): BigNumber {
  if (state.lpAsset.lte(state.currentAssetSD)) {
    return ZERO
  }

  const poolDeficit = state.lpAsset.sub(state.currentAssetSD)
  // assets in pool are < 75% of liquidity provided & amount transferred > 2% of pool deficit
  if (state.currentAssetSD.mul(100).div(state.lpAsset).lt(75) && amountSD.mul(100).gt(poolDeficit.mul(2))) {
    // reward capped at rewardPoolSize
    const eqReward = state.eqFeePool.mul(amountSD).div(poolDeficit)
    if (eqReward.gt(state.eqFeePool)) {
      return state.eqFeePool
    }
    return eqReward
  } else {
    return ZERO
  }
}

function getEquilibriumFee(state: BridgeState, amountSD: BigNumber): { eqFee: BigNumber; protocolSubsidy: BigNumber } {
  const beforeBalance = state.currentBalance
  const idealBalance = state.idealBalance
  const afterBalance = beforeBalance.sub(amountSD)
  const safeZoneMax = idealBalance.mul(DELTA_1).div(DENOMINATOR)
  const safeZoneMin = idealBalance.mul(DELTA_2).div(DENOMINATOR)

  let eqFee = ZERO
  let protocolSubsidy = ZERO
  if (afterBalance.gte(safeZoneMax)) {
    // no fee zone, protocol subsidize it.
    eqFee = amountSD.mul(PROTOCOL_SUBSIDY).div(DENOMINATOR)
    protocolSubsidy = eqFee
  } else if (afterBalance.gte(safeZoneMin)) {
    // safe zone
    const proxyBeforeBalance = beforeBalance.lt(safeZoneMax) ? beforeBalance : safeZoneMax
    eqFee = getTrapezoidArea(LAMBDA_1, ZERO, safeZoneMax, safeZoneMin, proxyBeforeBalance, afterBalance)
  } else {
    // danger zone
    if (beforeBalance.gte(safeZoneMin)) {
      // across 2 or 3 zones
      // part 1
      const proxyBeforeBalance = beforeBalance.lt(safeZoneMax) ? beforeBalance : safeZoneMax
      eqFee = eqFee.add(getTrapezoidArea(LAMBDA_1, ZERO, safeZoneMax, safeZoneMin, proxyBeforeBalance, safeZoneMin))
      // part 2
      eqFee = eqFee.add(getTrapezoidArea(LAMBDA_2, LAMBDA_1, safeZoneMin, ZERO, safeZoneMin, afterBalance))
    } else {
      // only in danger zone
      // part 2 only
      eqFee = eqFee.add(getTrapezoidArea(LAMBDA_2, LAMBDA_1, safeZoneMin, ZERO, beforeBalance, afterBalance))
    }
  }
  return { eqFee, protocolSubsidy }
}

function getProtocolAndLpFee(
  state: BridgeState,
  amountSD: BigNumber,
  protocolSubsidy: BigNumber
): { protocolFee: BigNumber; lpFee: BigNumber } {
  let protocolFee = amountSD.mul(PROTOCOL_FEE).div(DENOMINATOR).sub(protocolSubsidy)
  let lpFee = amountSD.mul(LP_FEE).div(DENOMINATOR)

  // when there are active emissions, give the lp fee to the protocol
  if (state.allocPointIsPositive) {
    protocolFee = protocolFee.add(lpFee)
    lpFee = ZERO
  }

  if (state.lpAsset.isZero()) {
    return { protocolFee, lpFee }
  }

  const isAboveIdeal = state.currentBalance.sub(amountSD).gt(state.idealBalance.mul(SIXTY_PERCENT).div(DENOMINATOR))
  const currentAssetNumerated = state.currentAssetSD.mul(DENOMINATOR).div(state.lpAsset)
  if (currentAssetNumerated.lte(FIFTY_PERCENT) && isAboveIdeal) {
    // x <= 50% => no fees
    protocolFee = ZERO
    lpFee = ZERO
  } else if (currentAssetNumerated.lt(SIXTY_PERCENT) && isAboveIdeal) {
    // 50% > x < 60% => scaled fees &&
    // the resulting transfer does not drain the pathway below 60% o`f the ideal balance,

    // reduce the protocol and lp fee linearly
    // Examples:
    // currentAsset == 101, lpAsset == 200 -> haircut == 5%
    // currentAsset == 115, lpAsset == 200 -> haircut == 75%
    // currentAsset == 119, lpAsset == 200 -> haircut == 95%
    const haircut = currentAssetNumerated.sub(FIFTY_PERCENT).mul(10) // scale the percentage by 10
    protocolFee = protocolFee.mul(haircut).div(DENOMINATOR)
    lpFee = lpFee.mul(haircut).div(DENOMINATOR)
  }

  // x > 60% => full fees
  return { protocolFee, lpFee }
}

function getTrapezoidArea(
  lambda: BigNumber,
  yOffset: BigNumber,
  xUpperBound: BigNumber,
  xLowerBound: BigNumber,
  xStart: BigNumber,
  xEnd: BigNumber
): BigNumber {
  const xBoundWidth = xUpperBound.sub(xLowerBound)

  // xStartDrift = xUpperBound.sub(xStart);
  const yStart = xUpperBound.sub(xStart).mul(lambda).div(xBoundWidth).add(yOffset)

  // xEndDrift = xUpperBound.sub(xEnd)
  const yEnd = xUpperBound.sub(xEnd).mul(lambda).div(xBoundWidth).add(yOffset)

  // compute the area
  const deltaX = xStart.sub(xEnd)
  return yStart.add(yEnd).mul(deltaX).div(2).div(DENOMINATOR)
}

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
