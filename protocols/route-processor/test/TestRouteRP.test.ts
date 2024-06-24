import { createForkWithRP } from '@sushiswap/tines-sandbox'
import { routeProcessor5Abi } from 'sushi/abi'
import { http, Abi, Address, Hex, PublicClient, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'

import RouteProcessor5 from '../artifacts/contracts/RouteProcessor5.sol/RouteProcessor5.json' assert {
  type: 'json',
}
interface RP {
  abi: Abi
  address: Address
}

const RP5_TEST_INSTANCE = {
  abi: routeProcessor5Abi as Abi,
  address: '0x3e1116ea5034f5d73a7b530071709d54a4109f5f' as Address,
}

async function testRoute(args: {
  // transport?: Transport
  // providerURL?: string
  // chain: Chain
  client: PublicClient

  account?: Address
  RPInRoute: Address
  RPInstance: RP
  tokenIn: Address
  amountIn: bigint
  tokenOut: Address
  amountOutMin: bigint
  to: Address
  route: Hex
}) {
  const routeNew = args.route
    .toLowerCase()
    .replaceAll(
      args.RPInRoute.substring(2).toLowerCase(),
      args.RPInstance.address.substring(2).toLowerCase(),
    )
  if (args.to === args.RPInRoute) args.to = args.RPInstance.address

  try {
    const res = await args.client.simulateContract({
      account: args.account,
      address: args.RPInstance.address,
      abi: args.RPInstance.abi,
      functionName: 'processRoute',
      args: [
        args.tokenIn,
        args.amountIn,
        args.tokenOut,
        args.amountOutMin,
        args.to,
        routeNew,
      ],
      value:
        args.tokenIn === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          ? args.amountIn
          : 0n,
    })
    console.log('Result:', res)
  } catch (e) {
    console.log('Throw:', e)
  }
}

// returns 'ERC20: transfer from the zero address' in tests
it.skip('Ethereum case 1', async () => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    ),
  }) as PublicClient
  await testRoute({
    client,
    RPInRoute: '0x3e1116ea5034f5d73a7b530071709d54a4109f5f',
    RPInstance: RP5_TEST_INSTANCE,
    tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    amountIn: 1000000000000000000n,
    tokenOut: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    amountOutMin: 0n,
    to: '0x3e1116ea5034f5d73a7b530071709d54a4109f5f',
    route:
      '0x0301ffff02013e1116ea5034f5d73a7b530071709d54a4109f5fC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc202bfff00eC8C342bc3E07F05B9a782bc34e7f04fB9B44502003e1116ea5034f5d73a7b530071709d54a4109f5f000bb8ffff00795065dCc9f64b5614C407a6EFDC400DA6221FB000e06F8d30AC334c857Fc8c380C85969C150f38A6A000bb8046B3595068778DD592e39A122f4f5a5cF09C90fE200e06F8d30AC334c857Fc8c380C85969C150f38A6A013e1116ea5034f5d73a7b530071709d54a4109f5f000bb8',
  })
})

// returns 'ERC20: transfer from the zero address' in tests
it('Ethereum case 1 fork', async () => {
  const fork = await createForkWithRP(
    `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    20161000n,
    1,
    routeProcessor5Abi as Abi,
    RouteProcessor5.bytecode as Hex,
  )
  await testRoute({
    client: fork.client,
    RPInRoute: '0x3e1116ea5034f5d73a7b530071709d54a4109f5f',
    RPInstance: {
      abi: routeProcessor5Abi as Abi,
      address: fork.RouteProcessorAddress as Address,
    },
    tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    amountIn: 1000000000000000000n,
    tokenOut: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    amountOutMin: 0n,
    to: '0x3e1116ea5034f5d73a7b530071709d54a4109f5f',
    route:
      '0x0301ffff02013e1116ea5034f5d73a7b530071709d54a4109f5fC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc201C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc202bfff00eC8C342bc3E07F05B9a782bc34e7f04fB9B44502003e1116ea5034f5d73a7b530071709d54a4109f5f000bb8ffff00795065dCc9f64b5614C407a6EFDC400DA6221FB000e06F8d30AC334c857Fc8c380C85969C150f38A6A000bb8046B3595068778DD592e39A122f4f5a5cF09C90fE200e06F8d30AC334c857Fc8c380C85969C150f38A6A013e1116ea5034f5d73a7b530071709d54a4109f5f000bb8',
  })
})
