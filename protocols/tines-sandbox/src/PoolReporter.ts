import { FileHandle, mkdir, open } from 'node:fs/promises'
import path from 'path'

export class PoolReporter {
  dir: string
  filePositive?: FileHandle
  fileNegative?: FileHandle

  constructor(..._path: string[]) {
    this.dir = path.resolve(..._path)
    try {
      mkdir(this.dir, { recursive: true })
    } catch (_e) {
      // do nothing
    }
  }

  async _openFiles() {
    try {
      if (!this.filePositive)
        this.filePositive = await open(path.resolve(this.dir, 'whitelist'), 'w')
      if (!this.fileNegative)
        this.fileNegative = await open(path.resolve(this.dir, 'blacklist'), 'w')
    } catch (_e) {}
    console.log(path.resolve(this.dir, 'whitelist'))
  }

  async reportPoolTest(pool: string, res: boolean, reason?: string) {
    await this._openFiles()
    if (res) await this.filePositive?.appendFile(`${pool}\n`)
    else await this.fileNegative?.appendFile(`${pool} // ${reason}\n`)
  }
}
