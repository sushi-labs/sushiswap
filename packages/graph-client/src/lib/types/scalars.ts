import type { BladeChainId } from 'src/subgraphs/data-api/types/BladeChainId.js'
import type { PoolChainId } from 'src/subgraphs/data-api/types/PoolChainId.js'
import type { SushiSwapChainId } from 'src/subgraphs/data-api/types/SushiSwapChainId.js'
import type { TokenListChainId } from 'src/subgraphs/data-api/types/TokenListChainId.js'
import type { TrendingTokensChainId } from 'src/subgraphs/data-api/types/TrendingTokensChainId.js'
import type { ChainId } from 'sushi'
import type { SushiSwapV2ChainId, SushiSwapV3ChainId } from 'sushi/evm'

type JSONValue = string | number | boolean | null | JSONArray | JSONObject

export interface JSONObject {
  [key: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

export type Scalars = {
  BigInt: string
  BigDecimal: string
  Bytes: `0x${string}`
  DateTime: string
  JSON: JSONObject

  ChainId: ChainId

  SushiSwapChainId: SushiSwapChainId
  SushiSwapV2ChainId: SushiSwapV2ChainId
  SushiSwapV3ChainId: SushiSwapV3ChainId

  BladeChainId: BladeChainId

  PoolChainId: PoolChainId

  TokenListChainId: TokenListChainId
  TrendingTokensChainId: TrendingTokensChainId
}
