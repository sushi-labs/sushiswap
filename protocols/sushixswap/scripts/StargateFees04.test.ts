//import { expect } from 'chai'
import { BigNumber } from 'ethers'
import hre from 'hardhat'
import { expect } from 'chai'

describe('Stargate fees', function () {
  it('Some values check', async function () {
    const FeeCalcFactory = await hre.ethers.getContractFactory('StargateFeeV04Extraction')
    const FeeCalcContract = await FeeCalcFactory.deploy()

    const bridgeState = {
      currentAssetSD: BigNumber.from(1e9),
      lpAsset: BigNumber.from(1e9),
      eqFeePool: BigNumber.from(1e9),
      idealBalance: BigNumber.from(1e9),
      currentBalance: BigNumber.from(1e7),
      allocPointIsPositive: false,
    }
    const fees = await FeeCalcContract.getFees(bridgeState, false, 10000)
    const eqFee = parseInt(fees.eqFee.toString())
    const eqReward = parseInt(fees.eqReward.toString())
    const lpFee = parseInt(fees.lpFee.toString())
    const protocolFee = parseInt(fees.protocolFee.toString())

    expect(isFinite(eqFee)).equal(true)
    expect(isFinite(eqReward)).equal(true)
    expect(isFinite(lpFee)).equal(true)
    expect(isFinite(protocolFee)).equal(true)
  })
})
