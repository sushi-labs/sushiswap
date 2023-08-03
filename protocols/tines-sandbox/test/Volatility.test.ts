import { routeProcessor2Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { RPParams } from '@sushiswap/router'
import { getBigNumber } from '@sushiswap/tines'
import { Address, createPublicClient, http } from 'viem'
import { Chain, mainnet } from 'viem/chains'

import { RP3Address } from './Extractor.test'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function volatilityCheck(args: {
  providerURL: string
  chain: Chain
  RP3Address: Address
  rpParams: RPParams
  account?: Address
}) {
  const transport = http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })

  let startBlockNumber: bigint
  let startTime: number
  let startOutput: number

  client.watchBlockNumber({
    onBlockNumber: async (n) => {
      const now = Date.now()
      startBlockNumber = startBlockNumber ?? n
      startTime = startTime ?? now
      try {
        const amountOut = await client.readContract({
          address: args.RP3Address,
          abi: routeProcessor2Abi,
          // @ts-ignore
          functionName: 'processRoute',
          args: [
            args.rpParams.tokenIn as Address,
            BigInt(args.rpParams.amountIn.toString()),
            args.rpParams.tokenOut as Address,
            0n,
            args.rpParams.to as Address,
            args.rpParams.routeCode as Address, // !!!!
          ],
          value: BigInt(args.rpParams.value?.toString() as string),
          account: args.account,
        })
        startOutput = startOutput ?? Number(amountOut)
        const diff = Number(amountOut) / startOutput - 1
        const sdiff = diff > 0 ? '+' + diff : diff
        console.log(`block: +${n - startBlockNumber} time: +${Math.round((now - startTime) / 1000)}s diff: ${sdiff}`)
      } catch (e) {
        console.log('Routing failed. No connection ?')
      }
    },
  })

  await delay(1000 * 3600 * 24)
}

it.only('Ethereum volatility check for UniV2 WETH-USDC pool', async () => {
  await volatilityCheck({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    RP3Address: RP3Address[ChainId.ETHEREUM] as Address,
    rpParams: {
      tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      amountIn: getBigNumber(1e18),
      tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      amountOutMin: getBigNumber(0),
      to: '0x827179dD56d07A7eeA32e3873493835da2866976',
      routeCode:
        '0x0301ffff0201B4e16d0168e52d35CaCD2c6185b44281Ec28C9DcC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc204C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc200B4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc00827179dD56d07A7eeA32e3873493835da2866976',
      value: getBigNumber(1e18),
    },
  })
})
