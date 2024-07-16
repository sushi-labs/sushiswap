import { FileHandle, mkdir, open } from 'node:fs/promises'
import path from 'path'
import { CurvePoolType, RToken } from 'sushi'

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
  }

  async reportPoolTest(
    pool: string,
    list: string,
    res: boolean,
    reason?: string,
    poolType?: CurvePoolType,
    tokens?: RToken[],
  ) {
    await this._openFiles()
    if (res) {
      const toks = tokens?.map((t) => ({
        address: t.address,
        name: t.name,
        symbol: t.symbol,
        decimals: t.decimals,
      }))
      const poolInfo = { pool, poolType, tokens: toks }
      await this.filePositive?.appendFile(
        `${JSON.stringify(poolInfo, undefined, '  ')},\n`,
      )
    } else {
      if (reason) {
        const len = reason.indexOf('\n')
        if (len >= 0) reason = reason.substring(0, len)
      }
      await this.fileNegative?.appendFile(`${pool} (${list}) - ${reason}\n`)
    }
  }
}
