import {
  createRandomUniV3Pool,
  createUniV3EnvZero,
} from '@sushiswap/tines-sandbox'
import hre from 'hardhat'
import { routeProcessor3Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { BENTOBOX_ADDRESS, BentoBoxChainId } from 'sushi/config'
import { Token } from 'sushi/currency'
import { PoolCode } from 'sushi/router'
import { LiquidityProviders, Router, UniV3PoolCode } from 'sushi/router'
import { type Contract } from 'sushi/types'
import {
  Address,
  Client,
  Hex,
  createPublicClient,
  custom,
  testActions,
  walletActions,
} from 'viem'
import { HDAccount, mnemonicToAccount } from 'viem/accounts'
import { hardhat } from 'viem/chains'

import RouteProcessor3 from '../artifacts/contracts/RouteProcessor3.sol/RouteProcessor3.json' assert {
  type: 'json',
}

const { config, network } = hre

const POLLING_INTERVAL = process.env.ALCHEMY_ID ? 1_000 : 10_000

function closeValues(
  _a: number | bigint,
  _b: number | bigint,
  accuracy: number,
): boolean {
  const a: number = typeof _a === 'number' ? _a : Number(_a)
  const b: number = typeof _b === 'number' ? _b : Number(_b)
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(
  _a: number | bigint,
  _b: number | bigint,
  accuracy: number,
  logInfoIfFalse = '',
) {
  const res = closeValues(_a, _b, accuracy)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    expect(res).toBe(true)
  }
  return res
}

async function getTestEnvironment() {
  const chainId = network.config.chainId as ChainId

  const accounts = config.networks.hardhat.accounts as { mnemonic: string }
  const user = mnemonicToAccount(accounts.mnemonic, { accountIndex: 0 })

  const client = createPublicClient({
    batch: {
      multicall: {
        batchSize: 2048,
        wait: 1,
      },
    },
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 25770160,
        },
      },
      pollingInterval: POLLING_INTERVAL,
    },
    transport: custom(network.provider),
  })
    .extend(testActions({ mode: 'hardhat' }))
    .extend(walletActions)

  const RouteProcessorTx = await client.deployContract({
    chain: null,
    abi: routeProcessor3Abi,
    bytecode: RouteProcessor3.bytecode as Hex,
    account: user.address,
    args: [BENTOBOX_ADDRESS[chainId as BentoBoxChainId], []],
  })
  const RouteProcessorAddress = (
    await client.waitForTransactionReceipt({ hash: RouteProcessorTx })
  ).contractAddress
  if (!RouteProcessorAddress)
    throw new Error('RouteProcessorAddress is undefined')
  const RouteProcessor = {
    address: RouteProcessorAddress,
    abi: routeProcessor3Abi,
  }

  return {
    chainId,
    client,
    rp: RouteProcessor,
    user,
  } satisfies {
    chainId: ChainId
    client: Client
    rp: Contract<typeof routeProcessor3Abi>
    user: HDAccount
  }
}

// type TestEnvironment = Awaited<ReturnType<typeof getTestEnvironment>>

it('UniV3 Solo', async () => {
  const testEnv = await getTestEnvironment()
  const env = await createUniV3EnvZero(testEnv.client)
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
    new UniV3PoolCode(
      pool.tinesPool,
      LiquidityProviders.UniswapV2,
      LiquidityProviders.UniswapV2,
    ),
  )

  //   const pcMap = dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)
  const route = Router.findBestRoute(
    pcMap,
    testEnv.chainId,
    fromToken,
    BigInt(1e18),
    toToken,
    50e9,
  )
  const rpParams = Router.routeProcessor2Params(
    pcMap,
    route,
    fromToken,
    toToken,
    testEnv.user.address,
    testEnv.rp.address,
  )

  await testEnv.client.writeContract({
    ...pool.token0Contract,
    chain: null,
    account: testEnv.user.address,
    functionName: 'approve',
    args: [testEnv.rp.address, BigInt(1e19)],
  })

  const balanceOutBIBefore = await testEnv.client.readContract({
    ...pool.token1Contract,
    functionName: 'balanceOf',
    args: [testEnv.user.address],
  })
  const tx = await env.walletClient.writeContract({
    chain: null,
    ...testEnv.rp,
    functionName: 'processRoute',
    args: [
      rpParams.tokenIn as Address,
      rpParams.amountIn,
      rpParams.tokenOut as Address,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
    ],
    account: env.user,
    value: rpParams.value || 0n,
  })

  await testEnv.client.waitForTransactionReceipt({ hash: tx })
  const balanceOutBIAfter = await testEnv.client.readContract({
    ...pool.token1Contract,
    functionName: 'balanceOf',
    args: [testEnv.user.address],
  })
  const output = balanceOutBIAfter - balanceOutBIBefore
  expectCloseValues(output, route.amountOut, 1e-6)
})
