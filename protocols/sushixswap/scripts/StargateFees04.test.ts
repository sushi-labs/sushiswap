import { BigNumber } from 'ethers'
import hre, { ethers } from 'hardhat'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import { ChainId } from '@sushiswap/chain'
import { getBigNumber, getStarGateFeesV04, BridgeState } from '@sushiswap/tines'
import { STARGATE_CHAIN_ID, STARGATE_POOL_ADDRESS, STARGATE_POOL_ID, STARGATE_USDC_ADDRESS } from '@sushiswap/stargate'
import { StargatePoolABI } from './ABI/StargatePoolABI'
import { StargateFeeLibraryABI } from './ABI/StargateFeeLibraryABI'
import { StargateFactoryABI } from './ABI/StargateFactoryABI'
import { ERC20ABI } from './ABI/ERC20ABI'
import { StargateLPStakingABI } from './ABI/StargateLPStakingABI'

export function getRandom(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return getBigNumber(res)
}

describe('Stargate fees', function () {
  it.skip('Some values check', async function () {
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

  it('Ethereum check', async () => {
    const bridgeState = await getStargateBridgeState(
      STARGATE_CHAIN_ID[ChainId.ETHEREUM],
      STARGATE_USDC_ADDRESS[ChainId.ETHEREUM],
      STARGATE_POOL_ID[ChainId.ETHEREUM][STARGATE_USDC_ADDRESS[ChainId.ETHEREUM]],
      STARGATE_CHAIN_ID[ChainId.POLYGON],
      STARGATE_POOL_ID[ChainId.POLYGON][STARGATE_USDC_ADDRESS[ChainId.POLYGON]],
      '0xdbf50791d09603915bd066354a5b45775cfad924'
    )
    console.log(bridgeState)
  })
})

async function getStargateBridgeState(
  srcChainId: number,
  srcTokenAddress: string,
  srcPoolId: number,
  dstChainId: number,
  dstPoolId: number,
  from: string
): Promise<{ state: BridgeState; whitelisted: boolean }> {
  const poolAddress = STARGATE_POOL_ADDRESS[srcChainId][srcTokenAddress]
  const pool = await new ethers.Contract(poolAddress, StargatePoolABI, ethers.getDefaultProvider())
  const tokenAddress = await pool.token()
  const token = await new ethers.Contract(tokenAddress, ERC20ABI, ethers.getDefaultProvider())
  const feeLibraryAddress = await pool.feeLibrary()
  const feeLibrary = await new ethers.Contract(feeLibraryAddress, StargateFeeLibraryABI, ethers.getDefaultProvider())
  const lpStakingAddress = await feeLibrary.lpStaking()
  const lpStaking = await new ethers.Contract(lpStakingAddress, StargateLPStakingABI, ethers.getDefaultProvider())

  const chainPath = await pool.getChainPath(dstChainId, dstPoolId)
  const convertRate = await pool.convertRate()
  const poolBalance = await token.balanceOf(poolAddress)
  const currentAssetSD = poolBalance.div(convertRate)
  const lpAsset = await pool.totalLiquidity()
  const eqFeePool = await pool.eqFeePool()
  const idealBalance = chainPath.idealBalance
  const currentBalance = chainPath.balance
  const lpID = await feeLibrary.poolIdToLpId(srcPoolId)
  const poolInfo = await lpStaking.poolInfo(lpID)
  const allocPointIsPositive = poolInfo.allocPoint.gt(0)
  const whitelisted = await feeLibrary.whitelist(from)

  return {
    state: {
      currentAssetSD,
      lpAsset,
      eqFeePool,
      idealBalance,
      currentBalance,
      allocPointIsPositive,
    },
    whitelisted,
  }
}
