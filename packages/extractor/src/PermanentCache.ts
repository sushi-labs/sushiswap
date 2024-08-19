import { FileHandle, mkdir, open } from 'node:fs/promises'
import path from 'path'

type ResolveFunction = () => void

// Attention !!! No release timeout check !!!!
class Mutex {
  taken = false
  resolves: ResolveFunction[] = []

  async takeTurn(): Promise<void> {
    if (!this.taken) {
      this.taken = true
      return
    }
    return new Promise((res) => this.resolves.push(res))
  }

  returnTurn() {
    const res = this.resolves.shift()
    if (res === undefined) this.taken = false
    else {
      res()
    }
  }
}

// Attention!!! No records with '\n' !!!
export class PermanentCache<CacheRecord> {
  filePath?: string
  file?: FileHandle
  lock: Mutex = new Mutex()

  // type RecordType = Record<Fields, unknown>

  constructor(...paths: string[]) {
    if (paths.length > 0 && paths[0] !== '') {
      const filePath = path.resolve(...paths)
      this.filePath = filePath
    }
  }

  async getAllRecords(): Promise<CacheRecord[]> {
    if (this.filePath === undefined) return []

    let records: CacheRecord[] = []
    await this.lock.takeTurn()
    // read from the beginning
    let file
    try {
      file = await open(this.filePath)
    } catch (_e) {
      this.lock.returnTurn()
      return []
    }
    try {
      const data = await file.readFile('utf8')
      let failCount = 0
      records = data
        .split('\n')
        .filter((r) => r !== '')
        .map((s) => {
          try {
            return JSON.parse(s) as CacheRecord
          } catch (_e) {
            ++failCount
          }
        })
        .filter((r) => r !== undefined) as CacheRecord[]
      await file.close()
      if (failCount > 0)
        console.error(
          `Cache ${this.filePath} error: ${failCount}/${
            records.length + failCount
          } records are incorrect`,
        )
    } catch (_e) {
      throw new Error(
        `Cache ${this.filePath} is fatal incorrect! Please fix it or remove file`,
      )
    }
    this.lock.returnTurn()
    return records
  }

  async add(record: CacheRecord) {
    if (this.filePath === undefined) return
    await this.lock.takeTurn()
    try {
      if (this.file === undefined) {
        try {
          const dirName = path.dirname(this.filePath)
          mkdir(dirName, { recursive: true })
        } catch (_e) {
          // do nothing
        }
        this.file = await open(this.filePath, 'a')
      }
      await this.file.appendFile(`${JSON.stringify(record)}\n`)
    } catch (_e) {
      // don't do anything
    }
    this.lock.returnTurn()
  }
}
