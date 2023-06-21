import { AbiEvent } from 'abitype'
import { Block, Log, PublicClient, WatchBlocksReturnType } from 'viem'

import { warnLog } from './WarnLog'

class BlockFrame {
  firstNumber?: number
  lastNumber?: number
  hashNumerMap: Map<number, string[]> = new Map()

  // return deleted block hashes
  setFrame(from: number, to: number): string[] {
    let deletedHashes: string[] = []
    if (this.firstNumber != undefined && this.lastNumber != undefined) {
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
    if (this.firstNumber == undefined || this.lastNumber == undefined) return false
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

// - network fail/absence protection
// - restores missed blocks
// - correctly processes removed logs (like undos)
export class LogFilter {
  readonly client: PublicClient
  readonly depth: number
  readonly onNewLogs: (arg?: Log[]) => void // undefined if LogFilter is stopped
  readonly events: AbiEvent[]

  unWatchBlocks?: WatchBlocksReturnType

  lastProcessedBlock?: Block
  processedBlockHash: Set<string> = new Set()
  nextGoalBlock?: Block

  blockHashMap: Map<string, Block> = new Map()
  logHashMap: Map<string, Log[]> = new Map()
  blockFrame: BlockFrame = new BlockFrame()

  constructor(client: PublicClient, depth: number, events: AbiEvent[], onNewLogs: (arg?: Log[]) => void) {
    this.client = client
    this.depth = depth
    this.events = events
    this.onNewLogs = onNewLogs
    this.start()
  }

  start() {
    this.unWatchBlocks = this.client.watchBlocks({
      onBlock: async (block) => {
        this.addBlock(block, true)
      },
    })
  }

  stop() {
    if (!this.unWatchBlocks) return
    this.unWatchBlocks()
    this.unWatchBlocks = undefined
    this.lastProcessedBlock = undefined
    this.processedBlockHash = new Set()
    this.nextGoalBlock = undefined
    this.blockHashMap = new Map()
    this.logHashMap = new Map()
    this.blockFrame.deleteFrame()
    this.onNewLogs() // Signal about stopping
  }

  setNewGoal(blockNumber: number, block: Block): boolean {
    const deletedHashes = this.blockFrame.setFrame(blockNumber - this.depth, blockNumber + this.depth)
    const initProcessedBlocksNumber = this.processedBlockHash.size
    deletedHashes.forEach((hash) => {
      this.blockHashMap.delete(hash)
      this.logHashMap.delete(hash)
      this.processedBlockHash.delete(hash)
    })
    if (initProcessedBlocksNumber > 0 && this.processedBlockHash.size == 0) {
      this.stop()
      return false
    }
    this.nextGoalBlock = block
    return true
  }

  addBlock(block: Block, isGoal: boolean) {
    const blockNumber = block.number === null ? null : Number(block.number)
    if (blockNumber === null || block.hash === null) {
      warnLog(`Incorrect block: number=${blockNumber} hash=${block.hash}`)
      return
    }
    if (isGoal) if (!this.setNewGoal(blockNumber, block)) return
    if (this.blockHashMap.has(block.hash)) return
    if (!this.blockFrame.add(blockNumber, block.hash)) return
    this.blockHashMap.set(block.hash, block)

    Promise.all(
      this.events.map((event) =>
        this.client.getLogs({
          blockHash: block.hash as `0x${string}`,
          event,
        })
      )
    ).then((logss) => {
      const logs = logss
        .reduce((a, b) => a.concat(b), [])
        .sort((a, b) => Number(a.logIndex || 0) - Number(b.logIndex || 0))
      this.logHashMap.set(block.hash || '', logs)
      this.processNewLogs()
    })
    if (this.lastProcessedBlock && !this.blockHashMap.has(block.parentHash))
      this.client.getBlock({ blockHash: block.parentHash }).then((b) => this.addBlock(b, false))
  }

  processNewLogs() {
    if (!this.unWatchBlocks) return
    const upLine: Block[] = []
    let cornerBlock: Block | undefined = this.nextGoalBlock
    for (;;) {
      if (cornerBlock == undefined)
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
        if (b == undefined) return
        if (b.hash == cornerBlock.hash) break
        downLine.push(b)
        b = this.blockHashMap.get(b.parentHash)
      }
    }

    let logs: Log[] = []
    for (let i = 0; i < downLine.length; ++i) {
      const l = this.logHashMap.get(downLine[i].hash || '')
      if (l == undefined) {
        warnLog('Unexpected Error in LogFilter. LogFilter will be restarted')
        this.stop()
        return
      }
      logs = logs.concat(
        l.reverse().map((l) => {
          l.removed = true
          return l
        })
      )
      this.processedBlockHash.delete(downLine[i].hash || '')
    }
    this.lastProcessedBlock = cornerBlock
    for (let i = upLine.length - 1; i >= 0; --i) {
      const l = this.logHashMap.get(upLine[i].hash || '')
      if (l == undefined) break
      logs = logs.concat(
        l.map((l) => {
          l.removed = false
          return l
        })
      )
      this.processedBlockHash.add(upLine[i].hash || '')
      this.lastProcessedBlock = upLine[i]
    }

    if (logs.length > 0) this.onNewLogs(logs)
  }
}
