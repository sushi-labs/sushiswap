import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI, Token, Type, WNATIVE } from '@sushiswap/currency'
import { getBigNumber, MultiRoute } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber, Contract } from 'ethers'
import { ethers, network } from 'hardhat'

import { ERC20ABI } from '../ABI/ERC20'
import { WETH9ABI } from '../ABI/WETH9'
import { DataFetcher } from '../scripts/DataFetcher'
import { BentoBox } from '../scripts/liquidityProviders/Trident'
import { Router } from '../scripts/Router'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

class Waiter {
  resolved = false

  async wait() {
    while (!this.resolved) {
      await delay(500)
    }
  }

  resolve() {
    this.resolved = true
  }
}

interface TestEnvironment {
  chainId: ChainId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any
  rp: Contract
  user: SignerWithAddress
  dataFetcher: DataFetcher
}

async function getTestEnvironment(): Promise<TestEnvironment> {
  console.log('Prepare Environment:')

  console.log('    Create DataFetcher ...')
  const provider = ethers.provider
  const chainId = network.config.chainId as ChainId
  const dataFetcher = new DataFetcher(provider, chainId)
  dataFetcher.startDataFetching()

  console.log(`    ChainId=${chainId} RouteProcessor deployment ...`)
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor')
  const routeProcessor = await RouteProcessor.deploy(
    BentoBox[chainId] || '0x0000000000000000000000000000000000000000',
    WNATIVE[chainId].address
  )
  await routeProcessor.deployed()
  console.log('    Block Number:', provider.blockNumber)

  console.log('    User creation ...')
  const [Alice] = await ethers.getSigners()

  return {
    chainId,
    provider,
    rp: routeProcessor,
    user: Alice,
    dataFetcher,
  }
}

// all pool data assumed to be updated
async function makeSwap(
  env: TestEnvironment,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type
): Promise<[BigNumber, number] | undefined> {
  console.log(`Make swap ${fromToken.symbol} -> ${toToken.symbol} amount: ${amountIn.toString()}`)

  if (fromToken instanceof Token) {
    console.log(`    Approve user's ${fromToken.symbol} to the route processor ...`)
    const WrappedBaseTokenContract = await new ethers.Contract(fromToken.address, ERC20ABI, env.user)
    await WrappedBaseTokenContract.connect(env.user).approve(env.rp.address, amountIn)
  }

  console.log('    Create Route ...')
  env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const waiter = new Waiter()
  const router = new Router(env.dataFetcher, fromToken, amountIn, toToken, 30e9)
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString()
    console.log(printed)
    waiter.resolve()
  })
  await waiter.wait()
  router.stopRouting()

  console.log('    Create route processor code ...')
  const rpParams = router.getCurrentRouteRPParams(env.user.address, env.rp.address)
  if (rpParams === undefined) return

  console.log('    Call route processor ...')
  const route = router.getBestRoute() as MultiRoute
  let balanceOutBNBefore: BigNumber
  let toTokenContract: Contract | undefined = undefined
  if (toToken instanceof Token) {
    toTokenContract = await new ethers.Contract(toToken.address, WETH9ABI, env.user)
    balanceOutBNBefore = await toTokenContract.connect(env.user).balanceOf(env.user.address)
  } else {
    balanceOutBNBefore = await env.user.getBalance()
  }
  let tx
  if (rpParams.value)
    tx = await env.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
      { value: rpParams.value }
    )
  else
    tx = await env.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode
    )
  const receipt = await tx.wait()

  console.log("    Fetching user's output balance ...")
  let balanceOutBN: BigNumber
  if (toTokenContract) {
    balanceOutBN = (await toTokenContract.connect(env.user).balanceOf(env.user.address)).sub(balanceOutBNBefore)
  } else {
    balanceOutBN = (await env.user.getBalance()).sub(balanceOutBNBefore)
    balanceOutBN = balanceOutBN.add(receipt.effectiveGasPrice.mul(receipt.gasUsed))
  }
  console.log(`        expected amountOut: ${route.amountOutBN.toString()}`)
  console.log(`        real amountOut:     ${balanceOutBN.toString()}`)
  const slippage = parseInt(balanceOutBN.sub(route.amountOutBN).mul(10_000).div(route.amountOutBN).toString())
  console.log(`        slippage: ${slippage / 100}%`)
  console.log(`        gas use: ${receipt.gasUsed.toString()}`)

  return [balanceOutBN, receipt.blockNumber]
}

async function dataUpdated(env: TestEnvironment, minBlockNumber: number) {
  for (;;) {
    if (env.dataFetcher.getLastUpdateBlock() >= minBlockNumber) return
    await delay(500)
  }
}

async function updMakeSwap(
  env: TestEnvironment,
  fromToken: Type,
  toToken: Type,
  lastCallResult: BigNumber | [BigNumber | undefined, number]
): Promise<[BigNumber | undefined, number]> {
  const [amountIn, waitBlock] = lastCallResult instanceof BigNumber ? [lastCallResult, 1] : lastCallResult
  if (amountIn === undefined) return [undefined, waitBlock] // previous swap failed

  console.log('')
  console.log('Wait data update for min block', waitBlock)
  await dataUpdated(env, waitBlock)
  const res = await makeSwap(env, fromToken, amountIn, toToken)
  expect(res).not.undefined
  if (res === undefined) return [undefined, waitBlock]
  else return res
}

describe('End-to-end Router test', async function () {
  it('Native => SUSHI => Native + Native => WrappedNative => Native', async function () {
    const env = await getTestEnvironment()
    const chainId = env.chainId

    const res1 = await updMakeSwap(env, Native.onChain(chainId), SUSHI[chainId], getBigNumber(1000000 * 1e18))
    const res2 = await updMakeSwap(env, SUSHI[chainId], Native.onChain(chainId), res1)
    const res3 = await updMakeSwap(env, Native.onChain(chainId), WNATIVE[chainId], [getBigNumber(1 * 1e18), res2[1]])
    await updMakeSwap(env, WNATIVE[chainId], Native.onChain(chainId), res3)
  })
})
