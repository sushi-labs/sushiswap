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

  console.log(`    ChainId=${chainId} RouteProcessor deployment (may take long time for the first launch)...`)
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
    console.log(`Approve user's ${fromToken.symbol} to the route processor ...`)
    const WrappedBaseTokenContract = await new ethers.Contract(fromToken.address, ERC20ABI, env.user)
    await WrappedBaseTokenContract.connect(env.user).approve(env.rp.address, amountIn)
  }

  console.log('Create Route ...')
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

  console.log('Create route processor code ...')
  const rpParams = router.getCurrentRouteRPParams(env.user.address, env.rp.address)
  if (rpParams === undefined) return

  console.log('Call route processor (may take long time for the first launch)...')
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

  // const trace = await network.provider.send('debug_traceTransaction', [receipt.transactionHash])
  // printGasUsage(trace)

  console.log("Fetching user's output balance ...")
  let balanceOutBN: BigNumber
  if (toTokenContract) {
    balanceOutBN = (await toTokenContract.connect(env.user).balanceOf(env.user.address)).sub(balanceOutBNBefore)
  } else {
    balanceOutBN = (await env.user.getBalance()).sub(balanceOutBNBefore)
    balanceOutBN = balanceOutBN.add(receipt.effectiveGasPrice.mul(receipt.gasUsed))
  }
  console.log(`    expected amountOut: ${route.amountOutBN.toString()}`)
  console.log(`    real amountOut:     ${balanceOutBN.toString()}`)
  const slippage = parseInt(balanceOutBN.sub(route.amountOutBN).mul(10_000).div(route.amountOutBN).toString())
  console.log(`    slippage: ${slippage / 100}%`)
  console.log(`    gas use: ${receipt.gasUsed.toString()}`)

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function printGasUsage(trace: any) {
  printGasUsageRecursive(trace.structLogs as CodeTraceInfo[], 0, '')
}

interface CodeTraceInfo {
  op: string
  depth: number
  gas: number
  gasCost: number
  pc: number
  stack: string[]
  memory: string[]
}

function getStack(data: CodeTraceInfo, depth: number): string {
  const stack = data.stack
  const len = stack.length - 1
  return stack[len - depth]
}

function getStackAddr(data: CodeTraceInfo, depth: number): string {
  const val = getStack(data, depth)
  return '0x' + val.substring(24)
}

function getNumber(data: CodeTraceInfo, depth: number): number {
  const val = getStack(data, depth)
  return parseInt(val, 16)
}

function getMemory(data: CodeTraceInfo, addr: number, len: number): string {
  const word = Math.floor(addr / 32)
  const shift = addr - word * 32
  const mem =
    word < data.memory.length ? data.memory[word] : '0000000000000000000000000000000000000000000000000000000000000000'
  return mem.substring(shift * 2, (shift + len) * 2)
}

function getCallFuncSelector(data: CodeTraceInfo): string {
  const op = data.op
  let dataAddrDepth = 0
  switch (op) {
    case 'CALL':
    case 'CALLCODE':
      dataAddrDepth = 3
      break
    case 'DELEGATECALL':
    case 'STATICCALL':
      dataAddrDepth = 2
      break
    default:
      throw new Error('Unknown call code: ') + op
  }
  const addr = getNumber(data, dataAddrDepth)
  const selector = getMemory(data, addr, 4)
  switch (selector) {
    // some often values
    case '70a08231':
      return 'balanceOf(address)'
    case 'd0e30db0':
      return 'deposit()'
    case 'a9059cbb':
      return 'transfer(address dst, uint256 wad)'
    case '022c0d9f':
      return 'Uni:swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)'
    case '4ffe34db':
      return 'Bento:totals(address)'
    case 'f18d03cc':
      return 'Bento:transfer(address token, address from, address to, uint256 share)'
    case '0902f1ac':
      return 'getReserves()'
    case 'df23b45b':
      return 'StratageData'
    case '02b9446c':
      return 'Bento:Deposit()'
    case 'f7888aec':
      return 'Bento:BalanceOf()'
    default:
      return selector
  }
}

// Returns the last processed code index
function printGasUsageRecursive(trace: CodeTraceInfo[], start: number, prefix: string, gasBefore = -1): number {
  const depth = trace[start].depth
  const gasStart = trace[start].gas
  let lastPrintedGas = gasStart
  if (gasBefore > 0) console.log(`${prefix}gas before function execution ${gasBefore - gasStart}`)

  for (let i = start; i < trace.length; ) {
    const info = trace[i]
    if (info.depth !== depth) {
      console.log(`${prefix}ERROR: UNEXPECTED DEPTH ${info.pc}: ${depth} -> ${info.depth}`)
      return i - 1
    }
    if (info.op.endsWith('CALL')) {
      if (trace[i + 1].depth > depth) {
        // Function call
        console.log(`${prefix}${lastPrintedGas - info.gas} gas`)
        console.log(
          `${prefix}${info.op}(pc=${info.pc}, index=${i}) ${getStackAddr(info, 1)} ${getCallFuncSelector(info)}`
        )
        i = printGasUsageRecursive(trace, i + 1, prefix + '  ', info.gasCost) + 1
        console.log(`${prefix + '  '}call total ${info.gas - trace[i].gas} gas`)
        lastPrintedGas = trace[i].gas
        continue
      }
    }
    if (info.op == 'RETURN' || info.op == 'REVERT' || info.op == 'STOP') {
      if (lastPrintedGas !== gasStart) console.log(`${prefix}${lastPrintedGas - info.gas} gas`)
      console.log(`${prefix}${info.op}(pc=${info.pc}, index=${i}) function execution ${gasStart - info.gas} gas`)
      return i
    }
    if (i < trace.length - 1) {
      const gas = info.gas - trace[i + 1].gas
      if (gas >= 100) console.log(`${prefix}${info.op} - ${gas}`)
    }
    ++i
  }
  return -1
}

// skipped because took too long time. Unskip to check the RP
describe('End-to-end Router test', async function () {
  let env: TestEnvironment
  let chainId: ChainId
  let intermidiateResult: [BigNumber | undefined, number]

  before(async () => {
    env = await getTestEnvironment()
    chainId = env.chainId
  })

  it('Native => SUSHI => Native', async function () {
    const res1 = await updMakeSwap(env, Native.onChain(chainId), SUSHI[chainId], getBigNumber(1000000 * 1e18))
    intermidiateResult = await updMakeSwap(env, SUSHI[chainId], Native.onChain(chainId), res1)
  })

  it('Native => WrappedNative => Native', async function () {
    const res3 = await updMakeSwap(env, Native.onChain(chainId), WNATIVE[chainId], [
      getBigNumber(1 * 1e18),
      intermidiateResult[1],
    ])
    await updMakeSwap(env, WNATIVE[chainId], Native.onChain(chainId), res3)
  })
})
