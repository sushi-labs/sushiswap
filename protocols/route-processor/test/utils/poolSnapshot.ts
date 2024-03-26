import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ChainId } from 'sushi/chain'
import { PoolCode } from 'sushi/router'
import {
  makeSerializable,
  restoreAfterSerialization,
  serializer,
} from 'sushi/serializer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// default dir for pools snapshots
const snapshotDirDefault = path.resolve(__dirname, '../pool-snapshots/')

export async function savePoolSnapshot(
  poolCodes: PoolCode[],
  chainId: ChainId,
  blockNumber: number | undefined,
  directory?: string,
) {
  // pools preparation for serialization
  makeSerializable(poolCodes)
  const data = serializer.serialize(poolCodes)
  const obj = JSON.parse(data)
  const humanReadableStr = JSON.stringify(obj, undefined, '  ')
  restoreAfterSerialization(poolCodes)

  directory = directory || snapshotDirDefault
  if (!existsSync(directory)) mkdirSync(directory)
  writeFileSync(
    path.resolve(directory, `${chainId}-${blockNumber}`),
    humanReadableStr,
  )
}

export async function loadPoolSnapshot(
  chainId: ChainId,
  blockNumber: number | undefined,
  directory?: string,
) {
  directory = directory || snapshotDirDefault
  const fileName = path.resolve(directory, `${chainId}-${blockNumber}`)
  if (!existsSync(fileName)) return undefined
  const str = readFileSync(fileName, 'utf8')
  const poolCodes = serializer.deserialize(str) as PoolCode[]
  restoreAfterSerialization(poolCodes)
  return poolCodes
}
