import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import type { EvmChainId } from 'sushi'
import { isBladeChainId } from 'sushi/config'
import type { Address } from 'viem'
import { graphql } from '../../graphql.js'
// import { SUSHI_DATA_API_HOST } from "sushi/config/subgraph";
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const BladePoolQuery = graphql(
  `
		query BladePool($address: Bytes!, $chainId: BladeChainId!) {
			bladePool(address: $address, chainId: $chainId) {
				id
				address
				chainId
				abi
				tokens {
					liquidity
					liquidityUSD
					targetWeight
					token {
						address
						chainId
						decimals
						id
						name
						symbol
					}
				}
				liquidity
				liquidityUSD
				liquidityUSDChange1d
				volumeUSD
				volumeUSD1d
				volumeUSDChange1d
				volumeUSD1w
				volumeUSDChange1w
				feeUSD1d
				feeApr1d
				totalApr1d
				isDeprecated
				isSingleAssetWithdrawEnabled
				newPoolAddress
				lpTransfersFrom {
					id
					newPoolAddress
					oldPoolAddress
				}
				vaults {
					address
					createdAt
					farm {
						abi
						farmingHelper
					}
					id
					name
					protocolDeposit {
						transferHelper
					}
					type
				}
			}
		}
	`,
)

export type GetBladePool = VariablesOf<typeof BladePoolQuery>

export async function getBladePool(
  variables: GetBladePool,
  options?: RequestOptions,
): Promise<BladePool | null> {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`;
  const url = `https://data-api-staging.data-gcp.sushi.com/graphql`
  const chainId = Number(variables.chainId) as EvmChainId

  if (!isBladeChainId(chainId)) {
    throw new Error('Invalid chainId')
  }

  try {
    const result = await request(
      {
        url,
        document: BladePoolQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )

    const pool = result.bladePool as BladePoolQuery
    if (!pool) return null

    const tokens = pool.tokens.map((t) => {
      const liquidity =
        typeof t.liquidity === 'number' && typeof t.token.decimals === 'number'
          ? BigInt(Math.floor(t.liquidity * 10 ** t.token.decimals))
          : 0n

      return {
        id: t.token.id as `${string}:0x${string}`,
        address: t.token.address as Address,
        chainId: t.token.chainId as EvmChainId,
        decimals: t.token.decimals,
        name: t.token.name,
        symbol: t.token.symbol,
        liquidity,
        liquidityUSD: t.liquidityUSD,
      }
    })

    return {
      id: pool.id as `${string}:0x${string}`,
      address: pool.address as Address,
      abi: pool.abi,
      chainId,
      protocol: 'BLADE',
      liquidity: BigInt(pool.liquidity.toString()),
      liquidityUSD: pool.liquidityUSD,
      volumeUSD: pool.volumeUSD,
      volumeUSD1d: pool.volumeUSD1d,
      feeApr1d: pool.feeApr1d,
      totalApr1d: pool.totalApr1d,
      tokens,
      feesUSD: pool.feeUSD1d,
      txCount: 0,
      txCount1d: 0,
      feesUSD1d: pool.feeUSD1d,
      feesUSD1dChange: 0,
      volumeUSD1dChange: pool.volumeUSDChange1d,
      liquidityUSD1dChange: pool.liquidityUSDChange1d,
      volumeUSD1w: pool.volumeUSD1w,
      feeUSD1d: pool.feeUSD1d,
      isDeprecated: pool.isDeprecated,
      isSingleAssetWithdrawEnabled: pool.isSingleAssetWithdrawEnabled,
    }
  } catch (error) {
    console.error('getBladePool error', error)
    return null
  }
}

// export type BladePool = NonNullable<Awaited<ReturnType<typeof getBladePool>>>

export type BladePoolToken = {
  liquidity: number
  liquidityUSD: number
  targetWeight: number
  token: {
    id: `${string}`
    address: Address
    chainId: number
    decimals: number
    name: string
    symbol: string
  }
}

export type TokenWithLiquidity = {
  id: `${string}:0x${string}`
  address: Address
  chainId: EvmChainId
  decimals: number
  name: string
  symbol: string
  liquidity: bigint
  liquidityUSD: number
}

export type BladePoolVault =
  | {
      id: `${string}`
      address: Address
      createdAt: number
      name: string | null
      type: 'PROTOCOL_DEPOSIT'
      farm: null
      protocolDeposit: {
        transferHelper: Address
      }
    }
  | {
      id: `${string}`
      address: Address
      createdAt: number
      name: string | null
      type: 'FARM'
      farm: {
        abi: string
        farmingHelper: Address
      }
      protocolDeposit: null
    }

export type BladePool = {
  id: `${string}:0x${string}`
  address: Address
  abi: BladePoolAbi
  chainId: EvmChainId
  protocol: string
  liquidity: bigint
  liquidityUSD: number
  liquidityUSD1dChange: number
  volumeUSD: number
  volumeUSD1d: number
  volumeUSD1w: number
  feeUSD1d: number
  feeApr1d: number
  totalApr1d: number
  isDeprecated: boolean
  isSingleAssetWithdrawEnabled: boolean
  tokens: TokenWithLiquidity[]
  feesUSD: number
  txCount: number
  txCount1d: number
  feesUSD1d: number
  feesUSD1dChange: number
  volumeUSD1dChange: number
}

export type BladePoolAbi =
  | 'ClipperPackedVerifiedExchange'
  | 'ClipperApproximateCaravelExchange'
  | 'ClipperVerifiedCaravelExchange'
  | 'ClipperCaravelExchange'
  | 'ClipperVerifiedExchange'
  | 'ClipperDirectExchangeV0'
  | 'ClipperDirectExchangeV1'
  | 'ClipperPackedExchange'
  | 'ClipperPackedOracleVerifiedExchange'
  | 'BladeVerifiedExchange'
  | 'BladeApproximateCaravelExchange'

export type BladePoolLpTransfer = {
  id: string
}

export type BladePoolQuery = {
  id: `${string}:0x${string}`
  address: Address
  chainId: EvmChainId
  abi: BladePoolAbi
  tokens: BladePoolToken[]
  liquidity: bigint
  liquidityUSD: number
  liquidityUSDChange1d: number
  volumeUSD: number
  volumeUSD1d: number
  volumeUSDChange1d: number
  volumeUSD1w: number
  volumeUSDChange1w: number
  feeUSD1d: number
  feeApr1d: number
  totalApr1d: number
  isDeprecated: boolean
  isSingleAssetWithdrawEnabled: boolean
  newPoolAddress: Address | null
  lpTransfersFrom: BladePoolLpTransfer[]
  vaults: BladePoolVault[]
}
