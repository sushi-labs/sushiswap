import type { EvmAddress, Position, SushiSwapV3Pool } from 'sushi/evm'
import type { Hex } from 'viem'

export interface InfinityHooksRegistration {
  beforeInitialize?: boolean
  afterInitialize?: boolean
  beforeAddLiquidity?: boolean
  afterAddLiquidity?: boolean
  beforeRemoveLiquidity?: boolean
  afterRemoveLiquidity?: boolean
  beforeSwap?: boolean
  afterSwap?: boolean
  beforeDonate?: boolean
  afterDonate?: boolean
  beforeSwapReturnsDelta?: boolean
  afterSwapReturnsDelta?: boolean
  afterMintReturnsDelta?: boolean
  afterBurnReturnsDelta?: boolean
}

export interface SushiSwapV4PoolKey {
  currency0: EvmAddress
  currency1: EvmAddress
  hooks: EvmAddress
  poolManager: EvmAddress
  fee: number
  parameters: {
    tickSpacing: number
    hooksRegistration?: InfinityHooksRegistration
  }
}

export interface EncodedSushiSwapV4PoolKey {
  currency0: EvmAddress
  currency1: EvmAddress
  hooks: EvmAddress
  poolManager: EvmAddress
  fee: number
  parameters: Hex
}

export type SushiSwapV4PoolId = Hex

/**
 * Temporary deployment shape until these values are exported by `sushi`.
 */
export interface SushiSwapV4Deployment {
  clPoolManager: EvmAddress
  clPositionManager: EvmAddress
  permit2: EvmAddress
  deploymentBlock: bigint
}

export interface SushiSwapV4PoolState {
  poolKey: SushiSwapV4PoolKey
  poolId: SushiSwapV4PoolId
  pool: SushiSwapV3Pool | null | undefined
  isInitialized: boolean
  isInitialLoading: boolean
  isError: boolean
}

export interface SushiSwapV4Position {
  tokenId: bigint
  owner: EvmAddress | undefined
  poolKey: SushiSwapV4PoolKey
  poolId: SushiSwapV4PoolId
  position: Position | undefined
}

export interface SushiSwapV4PositionState {
  data: SushiSwapV4Position | undefined
  poolState: SushiSwapV4PoolState | undefined
  isInitialLoading: boolean
  isError: boolean
}

export interface SushiSwapV4LiquidityConfig {
  deployment: SushiSwapV4Deployment
  poolKey: SushiSwapV4PoolKey
  poolId: SushiSwapV4PoolId
  isInitialized: boolean
  owner?: EvmAddress
}
