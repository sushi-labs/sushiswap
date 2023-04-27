import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { LiquidityProviders, Router, UniV3PoolCode } from '@sushiswap/router'
import { PoolCode } from '@sushiswap/router/dist/pools/PoolCode'
import { getBigNumber } from '@sushiswap/tines'
import { createRandomUniV3Pool, createUniV3EnvZero } from '@sushiswap/tines-sandbox'
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
  const chainId = network.config.chainId as ChainId
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor3')
  const routeProcessor = await RouteProcessor.deploy(bentoBoxV1Address[chainId as BentoBoxV1ChainId], [])
  await routeProcessor.deployed()
  const [user] = await ethers.getSigners()

  return {
    chainId,
    provider: ethers.provider,
    rp: routeProcessor,
    user,
  }
}

it('UniV3 Solo', async () => {
  const testEnv = await getTestEnvironment()
  const env = await createUniV3EnvZero(ethers)
  const pool = await createRandomUniV3Pool(env, 'test', 100)

  const fromToken = new Token({
    ...pool.tinesPool.token0,
    chainId: testEnv.chainId,
    decimals: 18,
  })
  const toToken = new Token({
    ...pool.tinesPool.token1,
    chainId: testEnv.chainId,
    decimals: 18,
  })
  const pcMap: Map<string, PoolCode> = new Map()
  pcMap.set(
    pool.tinesPool.address,
    new UniV3PoolCode(pool.tinesPool, LiquidityProviders.UniswapV2, LiquidityProviders.UniswapV2)
  )

  //   const pcMap = dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  const route = Router.findBestRoute(pcMap, testEnv.chainId, fromToken, getBigNumber(1e18), toToken, 50e9)
  const rpParams = Router.routeProcessor2Params(
    pcMap,
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
