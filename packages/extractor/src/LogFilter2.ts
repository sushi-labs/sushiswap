import { AbiEvent } from 'abitype'
import {
  Block,
  Log,
  PublicClient,
  WatchBlocksReturnType,
  encodeEventTopics,
} from 'viem'

import { repeatAsync } from './Utils'
import { warnLog } from './WarnLog'

export enum LogFilterType {
  Native, // getFilterChanges - is not supported widely
  OneCall, // one eth_getLogs call for all topict - the most preferrable
  MultiCall, // separete eth_getLogs call for each topic - for those systems that fail at OneCall
  SelfFilter, // Topic filtering doesn't support for provider. Filtering on the client
}

class BlockFrame {
  firstNumber?: number
  lastNumber?: number
  hashNumerMap: Map<number, string[]> = new Map()

  // return deleted block hashes
  setFrame(from: number, to: number): string[] {
    let deletedHashes: string[] = []
    if (this.firstNumber !== undefined && this.lastNumber !== undefined) {
      for (let i = this.firstNumber; i < from; ++i) {
        const hashes = this.hashNumerMap.get(i)
        if (hashes !== undefined) {
          deletedHashes = deletedHashes.concat(hashes)
          this.hashNumerMap.delete(i)
        }
      }
      for (let i = to; i < this.lastNumber; ++i) {
        const hashes = this.hashNumerMap.get(i)
        if (hashes !== undefined) {
          deletedHashes = deletedHashes.concat(hashes)
          this.hashNumerMap.delete(i)
        }
      }
    }
    this.firstNumber = from
    this.lastNumber = to
    return deletedHashes
  }

  add(blockNumber: number, blockHash: string): boolean {
    if (this.firstNumber === undefined || this.lastNumber === undefined)
      return false
    if (blockNumber < this.firstNumber) return false
    if (blockNumber >= this.lastNumber) return false
    const hashes = this.hashNumerMap.get(blockNumber)
    if (hashes) hashes.push(blockHash)
    else this.hashNumerMap.set(blockNumber, [blockHash])
    return true
  }

  deleteFrame() {
    this.firstNumber = undefined
    this.lastNumber = undefined
  }
}

interface FilterMy {
  topics: string[]
  onNewLogs: (arg?: Log[]) => void // undefined if LogFilter is stopped
}

// - network fail/absence protection
// - restores missed blocks
// - correctly processes removed logs (like undos)
export class LogFilter2 {
  readonly client: PublicClient
  readonly depth: number
  readonly logType: LogFilterType
  eventsAll: AbiEvent[] = []
  topicsAll: string[] = []
  filters: FilterMy[] = []
  blockProcessing = false

  unWatchBlocks?: WatchBlocksReturnType

  lastProcessedBlock?: Block
  processedBlockHash: Set<string> = new Set()
  nextGoalBlock?: Block

  blockHashMap: Map<string, Block> = new Map()
  logHashMap: Map<string, Log[]> = new Map()
  blockFrame: BlockFrame = new BlockFrame()

  constructor(client: PublicClient, depth: number, logType: LogFilterType) {
    this.client = client
    this.depth = depth
    this.logType = logType
  }

  addFilter(events: AbiEvent[], onNewLogs: (arg?: Log[]) => void) {
    this.eventsAll = this.eventsAll.concat(events)
    const topics = events.map((e) => encodeEventTopics({ abi: [e] })[0])
    this.topicsAll = this.topicsAll.concat(topics)
    this.filters.push({ topics, onNewLogs })
  }

  start() {
    if (this.unWatchBlocks) return // have been started
    if (this.logType == LogFilterType.Native) {
      this.client
        .createEventFilter({ events: this.eventsAll })
        .then((filter) => {
          this.unWatchBlocks = this.client.watchBlocks({
            onBlock: async () => {
              if (this.blockProcessing) return
              this.blockProcessing = true
              try {
                const logs = await this.client.getFilterChanges({ filter })
                this.filters.forEach((f) => {
                  const logsFiltered = logs.filter((l) =>
                    f.topics.includes(l.topics[0] ?? ''),
                  )
                  if (logsFiltered.length > 0) f.onNewLogs(logsFiltered)
                })
              } catch (e) {
                warnLog(this.client.chain?.id, `getFilterChanges failed ${e}`)
                this.stop()
              }
              this.blockProcessing = false
            },
          })
        })
    } else {
      this.unWatchBlocks = this.client.watchBlocks({
        onBlock: async (block) => {
          this.addBlock(block, true)
        },
      })
    }
  }

  stop(signalStopping = true) {
    if (!this.unWatchBlocks) return // is stopped
    this.unWatchBlocks()
    this.unWatchBlocks = undefined
    this.lastProcessedBlock = undefined
    this.processedBlockHash = new Set()
    this.nextGoalBlock = undefined
    this.blockHashMap = new Map()
    this.logHashMap = new Map()
    this.blockFrame.deleteFrame()
    if (signalStopping) this.filters.forEach((f) => f.onNewLogs()) // Signal about stopping
  }

  setNewGoal(blockNumber: number, block: Block): boolean {
    const deletedHashes = this.blockFrame.setFrame(
      blockNumber - this.depth,
      blockNumber + this.depth,
    )
    const initProcessedBlocksNumber = this.processedBlockHash.size
    deletedHashes.forEach((hash) => {
      this.blockHashMap.delete(hash)
      this.logHashMap.delete(hash)
      this.processedBlockHash.delete(hash)
    })
    if (initProcessedBlocksNumber > 0 && this.processedBlockHash.size === 0) {
      this.stop()
      return false
    }
    this.nextGoalBlock = block
    return true
  }

  sortAndProcessLogs(blockHash: string | null, logs: Log[]) {
    const logsSorted = logs.sort(
      (a, b) => Number(a.logIndex || 0) - Number(b.logIndex || 0),
    )
    this.logHashMap.set(blockHash || '', logsSorted)
    this.processNewLogs()
  }

  addBlock(block: Block, isGoal: boolean) {
    const blockNumber = block.number === null ? null : Number(block.number)
    if (blockNumber === null || block.hash === null) {
      warnLog(
        this.client.chain?.id,
        `Incorrect block: number=${blockNumber} hash=${block.hash}`,
      )
      return
    }
    if (isGoal) if (!this.setNewGoal(blockNumber, block)) return
    if (this.blockHashMap.has(block.hash)) return
    if (!this.blockFrame.add(blockNumber, block.hash)) return
    this.blockHashMap.set(block.hash, block)

    const backupPlan = () => {
      warnLog(this.client.chain?.id, `getLog failed for block ${block.hash}`)
      this.stop()
    }

    switch (this.logType) {
      case LogFilterType.OneCall:
        repeatAsync(
          10, // For example dRPC for BSC often 'forgets' recently returned watchBlock blocks. But 'recalls' at second request
          1000,
          async () => {
            const logs = await this.client.transport.request({
              method: 'eth_getLogs',
              params: [{ blockHash: block.hash, topics: [this.topicsAll] }],
            })
            this.sortAndProcessLogs(block.hash, logs as Log[])
          },
          backupPlan,
        )
        break
      case LogFilterType.MultiCall:
        Promise.all(
          this.eventsAll.map((event) =>
            this.client.getLogs({
              blockHash: block.hash as `0x${string}`,
              event,
            }),
          ),
        ).then(
          (logss) => this.sortAndProcessLogs(block.hash, logss.flat()),
          backupPlan,
        )
        break
      case LogFilterType.SelfFilter:
        this.client.getLogs({ blockHash: block.hash as `0x${string}` }).then(
          (logs) =>
            this.sortAndProcessLogs(
              block.hash,
              logs.filter((l) => this.topicsAll.includes(l.topics[0] ?? '')),
            ),
          backupPlan,
        )
        break
      default:
        warnLog(
          this.client.chain?.id,
          `Internal errror: Unknown Log Type: ${this.logType}`,
        )
    }
    if (this.lastProcessedBlock && !this.blockHashMap.has(block.parentHash))
      repeatAsync(
        10,
        1000,
        () =>
          this.client
            .getBlock({ blockHash: block.parentHash })
            .then((b) => this.addBlock(b, false)),
        () =>
          warnLog(
            this.client.chain?.id,
            'getBlock failed !!!!!!!!!!!!!!!!!!!!!!1',
          ),
      )
  }

  processNewLogs() {
    if (!this.unWatchBlocks) return
    const upLine: Block[] = []
    let cornerBlock: Block | undefined = this.nextGoalBlock
    for (;;) {
      if (cornerBlock === undefined)
        if (this.lastProcessedBlock) return
        else break
      if (this.processedBlockHash.has(cornerBlock.hash || '')) break
      upLine.push(cornerBlock)
      cornerBlock = this.blockHashMap.get(cornerBlock.parentHash)
    }

    const downLine: Block[] = []
    if (cornerBlock) {
      let b: Block | undefined = this.lastProcessedBlock
      for (;;) {
        if (b === undefined) return
        if (b.hash === cornerBlock.hash) break
        downLine.push(b)
        b = this.blockHashMap.get(b.parentHash)
      }
    }

    let logs: Log[] = []
    for (let i = 0; i < downLine.length; ++i) {
      const l = this.logHashMap.get(downLine[i].hash || '')
      if (l === undefined) {
        warnLog(this.client.chain?.id, 'Unexpected Error in LogFilter')
        this.stop()
        return
      }
      logs = logs.concat(
        l.reverse().map((l) => {
          l.removed = true
          return l
        }),
      )
      this.processedBlockHash.delete(downLine[i].hash || '')
    }
    this.lastProcessedBlock = cornerBlock
    for (let i = upLine.length - 1; i >= 0; --i) {
      const l = this.logHashMap.get(upLine[i].hash || '')
      if (l === undefined) break
      logs = logs.concat(
        l.map((l) => {
          l.removed = false
          return l
        }),
      )
      this.processedBlockHash.add(upLine[i].hash || '')
      this.lastProcessedBlock = upLine[i]
    }

    this.filters.forEach((f) => {
      const logsFiltered = logs.filter((l) =>
        f.topics.includes(l.topics[0] ?? ''),
      )
      if (logsFiltered.length > 0) f.onNewLogs(logsFiltered)
    })
  }
}
