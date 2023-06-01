import { Address, PublicClient } from 'viem'
import { MultiCallAggregator } from './MulticallAggregator'
import { UniV3PoolWatcher } from './UniV3PoolWatcher'
import { Token } from '@sushiswap/currency'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { PoolCode } from '@sushiswap/router'

interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  fee: FeeAmount
}

// TODO: PoolCode update cache wuth timer
export class UniV3Extractor {
  providerName: string
  tickHelperContract: Address
  client: PublicClient
  multiCallAggregator: MultiCallAggregator
  pools: UniV3PoolWatcher[] = []

  constructor(client: PublicClient, providerName: string, tickHelperContract: Address) {
    this.providerName = providerName
    this.client = client
    this.multiCallAggregator = new MultiCallAggregator(client)
    this.tickHelperContract = tickHelperContract
  }

  // TODO: stop ?
  // TODO: protection from restarting
  start(pools: PoolInfo[]) {
    this.pools = pools.map((p) => {
      const watcher = new UniV3PoolWatcher(
        this.providerName,
        p.address,
        this.tickHelperContract,
        p.token0,
        p.token1,
        p.fee,
        this.multiCallAggregator
      )
      watcher.updatePoolState()
      return watcher
    })
  }

  getPoolCodes(): PoolCode[] {
    return this.pools.map((p) => p.getPoolCode()).filter((pc) => pc !== undefined) as PoolCode[]
  }
}
