import type { ChainId } from 'sushi/chain'
import type { Address, ID, SushiSwapProtocol, Token } from 'sushi/types'

export type SushiPoolBase = {
  id: ID
  address: Address
  name: string
  chainId: ChainId

  token0: Token
  token1: Token

  swapFee: number
  // twapEnabled: boolean

  reserve0: bigint
  reserve1: bigint
  liquidity: bigint

  liquidityUSD: number

  volumeUSD: number

  feesUSD: number

  // token0Price: bigint
  // token1Price: bigint

  txCount: bigint

  protocol: SushiSwapProtocol
}
