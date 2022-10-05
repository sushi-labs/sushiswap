import { BigNumber } from 'ethers'
import hre, { ethers } from 'hardhat'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import { ChainId, chainIds } from '@sushiswap/chain'
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
  it('Contract Extracted fees = Typescript calculated fees', async function () {
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

  it('Ethereum USDC - Polygon USDC fees check', async () => {
    const from = '0xdbf50791d09603915bd066354a5b45775cfad924'
    const { state, whitelisted } = await getStargateBridgeState_USDC_USDC(
      ChainId.ETHEREUM,
      ChainId.POLYGON,
      '0xdbf50791d09603915bd066354a5b45775cfad924'
    )

    for (let n = 1; n <= 10; ++n) {
      const amountSD = BigNumber.from(10).pow(n + 3)
      if (amountSD.gt(state.currentBalance)) break
      const bridgeFees = await getStargateBridgeFees_USDC_USDC(
        ChainId.ETHEREUM,
        ChainId.POLYGON,
        '0xdbf50791d09603915bd066354a5b45775cfad924',
        amountSD
      )

      const calcFees = getStarGateFeesV04(state, whitelisted, amountSD)

      expect(bridgeFees.eqFee.toString()).equal(calcFees.eqFee.toString())
      expect(bridgeFees.eqReward.toString()).equal(calcFees.eqReward.toString())
      expect(bridgeFees.lpFee.toString()).equal(calcFees.lpFee.toString())
      expect(bridgeFees.protocolFee.toString()).equal(calcFees.protocolFee.toString())
    }
  })
})

async function getStargateBridgeState_USDC_USDC(srcChain: ChainId, dstChain: ChainId, from: string) {
  return getStargateBridgeState(
    STARGATE_CHAIN_ID[srcChain],
    STARGATE_USDC_ADDRESS[srcChain],
    STARGATE_POOL_ID[srcChain][STARGATE_USDC_ADDRESS[srcChain]],
    STARGATE_CHAIN_ID[dstChain],
    STARGATE_POOL_ID[dstChain][STARGATE_USDC_ADDRESS[dstChain]],
    from
  )
}

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

async function getStargateBridgeFees_USDC_USDC(
  srcChain: ChainId,
  dstChain: ChainId,
  from: string,
  amountSD: BigNumber
) {
  return getStargateFees(
    STARGATE_CHAIN_ID[srcChain],
    STARGATE_POOL_ID[srcChain][STARGATE_USDC_ADDRESS[srcChain]],
    STARGATE_USDC_ADDRESS[srcChain],
    STARGATE_CHAIN_ID[dstChain],
    STARGATE_POOL_ID[dstChain][STARGATE_USDC_ADDRESS[dstChain]],
    from,
    amountSD
  )
}

async function getStargateFees(
  srcChainId: number,
  srcPoolId: number,
  srcTokenAddress: string,
  dstChainId: number,
  dstPoolId: number,
  from: string,
  amountSD: BigNumber
) {
  const poolAddress = STARGATE_POOL_ADDRESS[srcChainId][srcTokenAddress]
  const pool = await new ethers.Contract(poolAddress, StargatePoolABI, ethers.getDefaultProvider())
  const feeLibraryAddress = await pool.feeLibrary()
  const feeLibrary = await new ethers.Contract(feeLibraryAddress, StargateFeeLibraryABI, ethers.getDefaultProvider())
  const fees = await feeLibrary.getFees(srcPoolId, dstPoolId, dstChainId, from, amountSD)
  return fees
}
