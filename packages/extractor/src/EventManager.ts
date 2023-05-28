import { AbiEvent } from 'abitype'
import { Address, Log, PublicClient } from 'viem'
import { Filter } from 'viem/dist/types/types/filter'

type LogCallBack = (Log) => void

export class EventManager {
  client: PublicClient
  filterMap: Map<number, [Filter, LogCallBack]> = new Map()
  filterCounter = 0

  constructor(client: PublicClient) {
    this.client = client
    client.watchBlockNumber({ onBlockNumber: (blockNumber) => console.log(blockNumber) })
  }

  async startEventListening(address: Address, event: AbiEvent, callback: LogCallBack): Promise<number> {
    const filter = await this.client.createEventFilter({ address, event })
    this.filterMap.set(this.filterCounter, [filter, callback] as [Filter, LogCallBack])

    await this.client.getFilterChanges({ filter })
    return this.filterCounter++
  }

  async stopEventListening(index: number) {
    const filter = this.filterMap.get(index)
    if (filter) {
      await this.client.uninstallFilter({ filter: filter[0] })
      this.filterMap.delete(index)
    }
  }

  async checkBlock() {
    const promises: Promise<Log[]>[] = []
    const callbacks: LogCallBack[] = []
    for (const [, [filter, callback]] of this.filterMap[Symbol.iterator]()) {
      promises.push(this.client.getFilterChanges({ filter }))
      callbacks.push(callback)
    }
    const result = await Promise.all(promises)
    result.forEach((logs, i) => logs.forEach((l) => callbacks[i](l)))
  }
}
