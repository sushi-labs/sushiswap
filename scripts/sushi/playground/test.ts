import { PrismaClient } from '@prisma/client'
import { ChainId, chainName, chainShortName } from '@sushiswap/chain'

const prisma = new PrismaClient()

async function main() {
  const ethTokens = [
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH_ADDRESS
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC_ADDRESS
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI_ADDRESS
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC_ADDRESS
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT_ADDRESS
    // '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', // SUSHI_ADDRESS
  ]

  const polygonTokens = [
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // WMATIC_ADDRESS
    // '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a', // SUSHI_ADDRESS
    '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', // WETH_ADDRESS
    '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', // WBTC_ADDRESS
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC_ADDRESS
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT_ADDRESS
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI_ADDRESS
  ]

  for (let i = 0; i < ethTokens.length; i++) {
    tinesInfo(ethTokens[i], ChainId.ETHEREUM, ['SushiSwap', 'UniSwap'])
  }

  for (let i = 0; i < polygonTokens.length; i++) {
    tinesInfo(polygonTokens[i], ChainId.POLYGON, ['SushiSwap', 'QuickSwap'])
  }

  //
  // for (const token of ethTokens) {
  // tokenInfo(token, ChainId.ETHEREUM, ['SushiSwap', 'UniSwap'])
  // }

  // for (const token of polygonTokens) {
  //   tokenInfo(token, ChainId.POLYGON, ['SushiSwap', 'QuickSwap'])
  // }
}

// InputToken, outputToken

async function tinesInfo(token: string, chainId: ChainId, protocols: string[]) {
  const result = await prisma.token.findFirst({
    where: {
      address: token,
      chainId: chainId.toString(),
    },
    include: {
      pools0: {
        where: {
          liquidityUSD: { gt: 250 },
          protocol: { in: protocols },
        },
        // include: {
        //   token0: true,
        //   token1: true,
        // },
      },
      pools1: {
        where: {
          liquidityUSD: { gt: 250 },
          protocol: { in: protocols },
        },
        // include: {
        //   token0: true,
        //   token1: true,
        // },
      },
    },
  })
  if (result === null) return
  const pools = [...result.pools0, ...result.pools1]

  console.log(`Testing ${result.symbol} on network: ${chainShortName[chainId]}`)
  for (const protocol of protocols) {
    const poolCount = pools.filter((pool) => pool.protocol === protocol).length
    console.log(`${result.symbol} on ${protocol} has ${poolCount} pools`)
  }

  console.log('---------------------------------------')
}

async function tokenInfo(token: string, chainId: ChainId, protocols: string[]) {
  const result = await prisma.token.findFirst({
    where: {
      address: token,
      chainId: chainId.toString(),
    },
    include: {
      pools0: {
        where: {
          liquidityUSD: { gt: 250 },
          protocol: { in: protocols },
        },
        include: {
          token0: true,
          token1: true,
        },
      },
      pools1: {
        where: {
          liquidityUSD: { gt: 250 },
          protocol: { in: protocols },
        },
        include: {
          token0: true,
          token1: true,
        },
      },
    },
  })
  if (result) {
    console.log(`Chain ${chainName[chainId]} Token: ${result.symbol}`)
    const pools = [result.pools0, result.pools1].flat()
    const pairedWithTokens = Array.from(
      new Set(
        [
          result.pools0.map((pool) =>
            pool.token0Id.toLowerCase() === token.toLowerCase() ? pool.token1.symbol : pool.token0.symbol
          ),
          result.pools1.map((pool) =>
            pool.token0Id.toLowerCase() === token.toLowerCase() ? pool.token1.symbol : pool.token0.symbol
          ),
        ].flat()
      )
    )

    console.log(`token ${result.symbol}(${result.address}) is paired with ${pairedWithTokens.length} other tokens`)
    if (result.symbol === 'DAI' && chainId === ChainId.POLYGON) {
      pairedWithTokens.forEach((tokenSymbol) => {
        console.log(`${result.symbol} is paired with ${tokenSymbol}`)
      })
    }
    // console.log('------')
    // console.log(`Pools: ${pools.join(', ')}`)
    // console.log('------')
    // console.log(`Paired with the following tokens: ${pairedWithTokens.join(', ')}`)
    for (const protocol of protocols) {
      const pairCount = pools.filter((pool) => pool.protocol.toLowerCase() === protocol.toLowerCase()).length
      console.log(`${protocol} Pairs: ${pairCount}`)
    }
  } else {
    console.log('no token found')
  }
  console.log(`----------------`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
