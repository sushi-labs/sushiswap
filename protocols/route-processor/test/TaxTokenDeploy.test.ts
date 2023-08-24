import { SnapshotRestorer, takeSnapshot } from '@nomicfoundation/hardhat-network-helpers'
import { routeProcessor4Abi } from '@sushiswap/abi'
import { erc20Abi } from '@sushiswap/abi'
import { ChainId, chainName } from '@sushiswap/chain'
import { Native, Token } from '@sushiswap/currency'
import { DataFetcher, Router, RPParams } from '@sushiswap/router'
import { MultiRoute, RouteStatus } from '@sushiswap/tines'
import { Contract } from '@sushiswap/types'
import { config, network } from 'hardhat'
import { Address, Client, createPublicClient, custom, HDAccount, Hex, testActions, walletActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { hardhat } from 'viem/chains'

import RouteProcessor4 from '../artifacts/contracts/RouteProcessor4.sol/RouteProcessor4.json'

async function getTestEnvironment() {
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
    },
    transport: custom(network.provider),
  })
    .extend(testActions({ mode: 'hardhat' }))
    .extend(walletActions)

  const accounts = config.networks.hardhat.accounts as { mnemonic: string }

  const user = mnemonicToAccount(accounts.mnemonic, { accountIndex: 0 })
  const user2 = mnemonicToAccount(accounts.mnemonic, { accountIndex: 1 })

  const chainId = network.config.chainId as ChainId
  const dataFetcher = new DataFetcher(chainId, client)
  dataFetcher.startDataFetching()

  const RouteProcessorTx = await client.deployContract({
    chain: null,
    abi: routeProcessor4Abi,
    bytecode: RouteProcessor4.bytecode as Hex,
    account: user.address,
    args: ['0x0000000000000000000000000000000000000000', []],
  })
  const RouteProcessorAddress = (await client.waitForTransactionReceipt({ hash: RouteProcessorTx })).contractAddress
  if (!RouteProcessorAddress) throw new Error('RouteProcessorAddress is undefined')
  const RouteProcessor = {
    address: RouteProcessorAddress,
    abi: routeProcessor4Abi,
  }

  console.log(`  Network: ${chainName[chainId]}, Forked Block: ${await client.getBlockNumber()}`)
  //console.log('    User creation ...')

  return {
    chainId,
    client,
    rp: RouteProcessor,
    user,
    user2,
    dataFetcher,
    snapshot: await takeSnapshot(),
  } satisfies {
    chainId: ChainId
    client: Client
    rp: Contract<typeof routeProcessor4Abi>
    user: HDAccount
    user2: HDAccount
    dataFetcher: DataFetcher
    snapshot: SnapshotRestorer
  }
}

type TestEnvironment = Awaited<ReturnType<typeof getTestEnvironment>>

async function checkTaxTokenTransfer(env: TestEnvironment, route: MultiRoute): Promise<boolean | undefined> {
  if (route.legs.length >= 2) {
    return await env.client.readContract({
      address: route.toToken.address as Address, //'0x8b2060CC6E55Fa68204B3Bc8B226FC61B3512C1f', //bpsTest
      abi: erc20Abi,
      // @ts-ignore
      functionName: 'transfer',
      args: [env.rp.address, route.amountOutBI],
      account: route.legs[1].poolAddress, // '0x9bd731319718d417f47083c9653de5f35fce5698', // sushiswap pair
    })
  }
}

async function testTaxTokenBuy(
  env: TestEnvironment,
  route: MultiRoute,
  rpParams: RPParams,
  account?: Address
): Promise<number> {
  const amountOutReal = await env.client.readContract({
    address: env.rp.address,
    abi: routeProcessor4Abi,
    // @ts-ignore
    functionName: 'processRoute',
    args: [
      rpParams.tokenIn as Address,
      rpParams.amountIn,
      rpParams.tokenOut as Address,
      0n,
      rpParams.to as Address,
      rpParams.routeCode as Address, // !!!!
    ],
    value: rpParams.value,
    account,
  })
  return route.amountOutBI == 0n ? -1 : Number(amountOutReal - route.amountOutBI) / route.amountOut
}

async function testTaxToken(args: { env: TestEnvironment; taxToken: Token; amountIn?: bigint }) {
  const chainId = args.env.chainId
  const fromToken = Native.onChain(chainId)
  const toToken = args.taxToken
  const amountIn = args.amountIn ?? BigInt(1e18)

  await args.env.dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const pcMap = args.env.dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)

  const route = Router.findBestRoute(pcMap, chainId, fromToken, amountIn, toToken, 30e9)
  if (route.status === RouteStatus.NoWay) {
    console.log('NoWay')
    return
  }
  // console.log(Router.routeToHumanString(pcMap, route, fromToken, toToken))
  // console.log(
  //   'ROUTE:',
  //   route.legs.map(
  //     (l) =>
  //       `${l.tokenFrom.symbol} -> ${l.tokenTo.symbol}  ${l.poolAddress}  ${l.assumedAmountIn} -> ${l.assumedAmountOut}`
  //   )
  // )

  const rpParams = Router.routeProcessor4Params(
    pcMap,
    route,
    fromToken,
    toToken,
    args.env.user.address,
    args.env.rp.address
  )
  if (rpParams === undefined) {
    console.log("Can't create route")
    return
  }

  // try {
  //   await checkTaxTokenTransfer(args.env, route)
  // } catch (e) {
  //   console.log(`Transfer check failed ${toToken.symbol} (${toToken.address}) ${route.amountOutBI} ${e}`)
  //   return
  // }
  try {
    const diff = await testTaxTokenBuy(args.env, route, rpParams, args.env.user.address)
    console.log(
      `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.legs.length - 1} pools` +
        ` diff = ${diff > 0 ? '+' : ''}${diff} `
    )
  } catch (e) {
    console.log('Routing failed. No connection ? ' + e)
  }
}

describe('RouteProcessor4 tax token test for BASE', async function () {
  let env: TestEnvironment

  before(async () => {
    //await reset(`https://lb.drpc.org/ogrpc?network=base&dkey=${process.env.DRPC_ID}`, 3033333)
    env = await getTestEnvironment()
  })

  it('BASE => LCRV', async function () {
    const LCRV = new Token({
      chainId: ChainId.BASE,
      address: '0x8b2060CC6E55Fa68204B3Bc8B226FC61B3512C1f',
      name: 'Left Curve DAO',
      symbol: 'LCRV',
      decimals: 9,
    })
    await testTaxToken({
      env,
      taxToken: LCRV,
      amountIn: BigInt(1e15),
    })
  })

  it('BASE => bpsTEST', async function () {
    const bpsTEST = new Token({
      chainId: ChainId.BASE,
      address: '0x93980959778166ccbB95Db7EcF52607240bc541e',
      name: 'bpsTEST',
      symbol: 'bpsTEST',
      decimals: 18,
    })
    await testTaxToken({
      env,
      taxToken: bpsTEST,
      amountIn: BigInt(1e12),
    })
  })
})
