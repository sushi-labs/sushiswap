import { PoolCode } from 'sushi'
import { Address, PublicClient, parseAbiItem } from 'viem'
import { IExtractor } from './IExtractor.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { TokenManager } from './TokenManager.js'

export interface UniV4Config {
  address: Address
}

const poolInitEvent = parseAbiItem(
  'event Initialize(bytes32 indexed id, address indexed currency0, address indexed currency1, uint24 fee, int24 tickSpacing, address hooks)',
)

export class UniV4Extractor extends IExtractor {
  config: UniV4Config
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager

  constructor({
    config,
    client,
    multiCallAggregator,
    tokenManager,
    cacheDir,
  }: {
    config: UniV4Config
    client?: PublicClient
    multiCallAggregator?: MultiCallAggregator
    tokenManager?: TokenManager
    cacheDir: string
  }) {
    super()
    this.config = config

    if (multiCallAggregator === undefined && client === undefined)
      throw new Error(
        'UniV4Extractor: multiCallAggregator or client must not be undefined',
      )
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client as PublicClient)

    this.tokenManager =
      tokenManager ||
      new TokenManager(
        this.multiCallAggregator,
        cacheDir as string,
        `uniV3Tokens-${this.multiCallAggregator.chainId}`,
      )
  }

  async start() {
    const client = this.multiCallAggregator.client
    const logsAll = await client.getLogs({
      address: this.config.address,
      event: poolInitEvent,
      // fromBlock,
      // toBlock,
    })
    console.log(logsAll)
  }

  isStarted() {
    return true
  }

  getPoolsForTokens(): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  } {
    return { prefetched: [], fetching: [] }
  }

  getPoolsBetweenTokenSets(): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  } {
    return { prefetched: [], fetching: [] }
  }

  getCurrentPoolCodes() {
    return []
  }
  getUpdatedPoolCodes() {
    return []
  }
  getTokensPoolsQuantity() {}
}
