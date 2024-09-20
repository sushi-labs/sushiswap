import { Protocol } from '@sushiswap/database'
import { publicClientConfig } from 'sushi/config'
import { type Address, type PublicClient, createPublicClient } from 'viem'

import {
  erc20Abi_decimals,
  erc20Abi_name,
  erc20Abi_symbol,
  uniswapV2PairAbi_token0,
  uniswapV2PairAbi_token1,
  uniswapV2PairAbi_totalSupply,
  v3baseAbi_fee,
  v3baseAbi_liquidity,
  v3baseAbi_token0,
  v3baseAbi_token1,
} from 'sushi/abi'
import { getChainIdAddressFromId } from 'sushi/format'
import { type ID, SushiSwapProtocol } from 'sushi/types'
import type { getPoolFromDB } from './pool'

interface GetPoolArgs {
  client: PublicClient
  address: Address
  protocol?: Protocol
}

interface Pool {
  tokens: Address[]
  totalSupply: string
  swapFee: number
  twapEnabled: boolean
  protocol: Protocol
}

async function getTokenInfo({ client, address }: GetPoolArgs) {
  const [name, symbol, decimals] = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: erc20Abi_name,
        functionName: 'name',
      },
      {
        address: address,
        abi: erc20Abi_symbol,
        functionName: 'symbol',
      },
      {
        address: address,
        abi: erc20Abi_decimals,
        functionName: 'decimals',
      },
    ],
  })

  return { address, name, symbol, decimals }
}

async function getV2Pool({ client, address }: GetPoolArgs): Promise<Pool> {
  const [token0, token1, totalSupply] = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: uniswapV2PairAbi_token0,
        functionName: 'token0',
      },
      {
        address: address,
        abi: uniswapV2PairAbi_token1,
        functionName: 'token1',
      },
      {
        address: address,
        abi: uniswapV2PairAbi_totalSupply,
        functionName: 'totalSupply',
      },
    ],
  })

  return {
    tokens: [token0, token1],
    totalSupply: totalSupply.toString(),
    swapFee: 0.003,
    twapEnabled: true,
    protocol: Protocol.SUSHISWAP_V2,
  }
}

async function getV3Pool({ client, address }: GetPoolArgs): Promise<Pool> {
  const [token0, token1, liquidity, fee] = await client.multicall({
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: v3baseAbi_token0,
        functionName: 'token0',
      },
      {
        address: address,
        abi: v3baseAbi_token1,
        functionName: 'token1',
      },
      {
        address: address,
        abi: v3baseAbi_liquidity,
        functionName: 'liquidity',
      },
      {
        address: address,
        abi: v3baseAbi_fee,
        functionName: 'fee',
      },
    ],
  })
  return {
    tokens: [token0, token1],
    totalSupply: liquidity.toString(),
    // 500 is 0.05%. divide it by 1M to get the 0.0005 format
    swapFee: fee / 1_000_000,
    twapEnabled: true,
    protocol: Protocol.SUSHISWAP_V3,
  }
}

// Thought ReturnType would be enough, needed to wrap it to make TS happy
export async function getUnindexedPool(
  poolId: ID,
): Promise<Awaited<ReturnType<typeof getPoolFromDB>>> {
  const { chainId, address } = getChainIdAddressFromId(poolId)

  if (chainId in publicClientConfig === false)
    throw new Error('Invalid chain id.')

  const cfg = publicClientConfig[chainId as keyof typeof publicClientConfig]

  const client = createPublicClient({
    chain: cfg.chain,
    transport: cfg.transport,
  }) as PublicClient

  if (!(await client.getBytecode({ address }))) {
    throw new Error('Invalid pool address.')
  }

  let lpTokenName: string
  try {
    const { name } = await getTokenInfo({ client, address })
    lpTokenName = name
  } catch (_e) {
    lpTokenName = 'V3'
  }

  let poolFetcher: (args: GetPoolArgs) => Promise<Pool>
  switch (lpTokenName) {
    case 'SushiSwap LP Token':
      poolFetcher = getV2Pool
      break
    default:
      poolFetcher = getV3Pool
  }

  const pool = await poolFetcher({ client, address })

  const tokens = await Promise.all(
    pool.tokens.map((token) => getTokenInfo({ client, address: token })),
  )

  const poolName = tokens.map(({ symbol }) => symbol).join('-')

  const [token0, token1] = tokens as [
    (typeof tokens)[number],
    (typeof tokens)[number],
  ]

  return {
    id: poolId,
    address,
    chainId,
    name: poolName,

    swapFee: pool.swapFee,

    token0: {
      id: `${chainId}:${token0.address.toLowerCase()}` as ID,
      address: token0.address.toLowerCase() as Address,
      chainId,
      symbol: token0.symbol,
      name: token0.name,
      decimals: token0.decimals,
    },
    token1: {
      id: `${chainId}:${token1.address.toLowerCase()}` as ID,
      address: token1.address.toLowerCase() as Address,
      chainId,
      symbol: token1.symbol,
      name: token1.name,
      decimals: token1.decimals,
    },

    txCount: 0,
    txCount1d: 0,
    txCount1dChange: 0,
    txCount1w: 0,
    txCount1wChange: 0,
    txCount1m: 0,
    txCount1mChange: 0,

    feesUSD: 0,
    feesUSD1d: 0,
    feesUSD1dChange: 0,
    feesUSD1w: 0,
    feesUSD1wChange: 0,
    feesUSD1m: 0,
    feesUSD1mChange: 0,

    volumeUSD: 0,
    volumeUSD1d: 0,
    volumeUSD1dChange: 0,
    volumeUSD1w: 0,
    volumeUSD1wChange: 0,
    volumeUSD1m: 0,
    volumeUSD1mChange: 0,

    reserve0: BigInt(0),
    reserve1: BigInt(0),
    liquidity: BigInt(pool.totalSupply),

    liquidityUSD: 0,
    liquidityUSD1d: 0,
    liquidityUSD1dChange: 0,
    liquidityUSD1wChange: 0,
    liquidityUSD1mChange: 0,

    protocol:
      pool.protocol === 'SUSHISWAP_V2'
        ? SushiSwapProtocol.SUSHISWAP_V2
        : SushiSwapProtocol.SUSHISWAP_V3,

    incentiveApr: 0,
    incentives: [],
    isIncentivized: false,
    wasIncentivized: false,

    hasEnabledSteerVault: false,
    hadEnabledSteerVault: false,
    steerVaults: [],

    feeApr1h: 0,
    feeApr1d: 0,
    feeApr1w: 0,
    feeApr1m: 0,

    totalApr1h: 0,
    totalApr1d: 0,
    totalApr1w: 0,
    totalApr1m: 0,
    token0Price: 0,
    token1Price: 0,
  } as Awaited<ReturnType<typeof getPoolFromDB>>
}
