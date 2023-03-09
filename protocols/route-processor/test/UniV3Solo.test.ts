import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { DataFetcher, Router, UniV3PoolCode } from '@sushiswap/router'
import { PoolCode } from '@sushiswap/router/dist/pools/PoolCode'
import { findMultiRouteExactIn, getBigNumber, UniV3Pool } from '@sushiswap/tines'
import { createRandomUniV3Pool, createUniV3Env } from '@sushiswap/tines-sandbox'
import { BigNumber, Contract } from 'ethers'
import { ethers, network } from 'hardhat'

function closeValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number): boolean {
  const a: number = typeof _a == 'number' ? _a : parseInt(_a.toString())
  const b: number = typeof _b == 'number' ? _b : parseInt(_b.toString())
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number, logInfoIfFalse = '') {
  const res = closeValues(_a, _b, accuracy)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    expect(res).toBe(true)
  }
  return res
}

interface TestEnvironment {
  chainId: ChainId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
  rp: Contract
  user: SignerWithAddress
}

async function getTestEnvironment(): Promise<TestEnvironment> {
  // await network.provider.request({
  //   method: 'hardhat_reset',
  //   params: [],
  // })

  const chainId = network.config.chainId as ChainId
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor2')
  const routeProcessor = await RouteProcessor.deploy(BENTOBOX_ADDRESS[chainId])
  await routeProcessor.deployed()
  const [user] = await ethers.getSigners()

  return {
    chainId,
    provider: ethers.provider,
    rp: routeProcessor,
    user,
  }
}

class FakeDataFetcher extends DataFetcher {
  poolCode: Map<string, PoolCode>

  constructor(testEnv: TestEnvironment, pool: UniV3Pool) {
    super(testEnv.provider, testEnv.chainId)
    this.poolCode = new Map()
    this.poolCode.set(pool.address, new UniV3PoolCode(pool, 'TestProvider'))
  }

  getCurrentPoolCodeMap(): Map<string, PoolCode> {
    return this.poolCode
  }
}

it('UniV3 Solo', async () => {
  const testEnv = await getTestEnvironment()
  const env = await createUniV3Env(ethers)
  const pool = await createRandomUniV3Pool(env, 'test', 100)
  const route = findMultiRouteExactIn(
    pool.tinesPool.token0,
    pool.tinesPool.token1,
    1e18,
    [pool.tinesPool],
    pool.tinesPool.token0,
    50e9
  )
  const dataFetcher = new FakeDataFetcher(testEnv, pool.tinesPool)
  const fromToken = new Token({
    ...route.fromToken,
    chainId: route.fromToken.chainId as number,
    decimals: 18,
  })
  const toToken = new Token({
    ...route.toToken,
    chainId: route.toToken.chainId as number,
    decimals: 18,
  })
  const rpParams = Router.routeProcessor2Params(
    dataFetcher,
    route,
    fromToken,
    toToken,
    testEnv.user.address,
    testEnv.rp.address
  )

  await pool.token0Contract.connect(testEnv.user).approve(testEnv.rp.address, getBigNumber(1e19))

  const balanceOutBNBefore = await pool.token1Contract.balanceOf(testEnv.user.address)
  let tx
  if (rpParams.value)
    tx = await testEnv.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
      { value: rpParams.value }
    )
  else
    tx = await testEnv.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode
    )
  await tx.wait()
  const balanceOutBNAfter = await pool.token1Contract.balanceOf(testEnv.user.address)
  const output = balanceOutBNAfter.sub(balanceOutBNBefore)
  expectCloseValues(output, route.amountOut, 1e-6)
})
