import { Request, Response } from 'express'
import { serializePoolsBinary } from 'sushi/router'
import { CHAIN_ID } from '../../config.js'
import extractor from '../../extractor.js'
import { querySchema } from './schema.js'

const MIN_STATE_UPDATE_INTERVAL = 2_000

const stateIds: number[] = []
const diffBins: Uint8Array[] = []
const poolNums: number[] = []
let allPoolsBin: Uint8Array | undefined = undefined
let allPoolsStateId = 0

function updateLastState(force = false): number {
  const newStateId = Date.now()
  const lastStateId =
    stateIds.length > 0 ? (stateIds[stateIds.length - 1] as number) : 0
  if (!force && newStateId < lastStateId + MIN_STATE_UPDATE_INTERVAL)
    return lastStateId // updated recently
  const newPools = extractor.getCurrentPoolCodesUpdate()
  const diff = serializePoolsBinary(newPools, {
    stateId: newStateId,
    prevStateId: lastStateId,
  })
  stateIds.push(newStateId)
  diffBins.push(diff)
  poolNums.push(newPools.length)
  return newStateId
}

function makeNewAllPoolsBin(newstateId: number) {
  allPoolsStateId = newstateId
  const pools = extractor.getCurrentPoolCodes()
  allPoolsBin = serializePoolsBinary(pools, {
    stateId: allPoolsStateId,
    prevStateId: 0,
  })
}

function concatDiffs(diffs: Uint8Array[]): Uint8Array {
  if (diffs.length === 1) return diffs[0] as Uint8Array
  const length = diffs.reduce((a, b) => a + b.length, 0)
  const res = new Uint8Array(length)
  let pos = 0
  diffs.forEach((d) => {
    res.set(d, pos)
    pos += d.length
  })
  return res
}

// i > j => arr[i] >= arr[j]
// returns the index of the element in arr or -1
function binarySearch(arr: number[], elem: number): number {
  let start = 0
  let end = arr.length - 1
  while (start <= end) {
    const mid = Math.floor((start + end) / 2)
    const diff = (arr[mid] as number) - elem
    if (diff === 0) return mid
    else if (diff < 0) start = mid + 1
    else end = mid - 1
  }
  return -1
}

function getCombinedDiff(stateId: number): Uint8Array {
  let from = binarySearch(stateIds, stateId)
  if (from >= 0) {
    // state was found in the history
    updateLastState()
    return concatDiffs(diffBins.slice(from + 1))
  }
  // unknown state
  from = binarySearch(stateIds, allPoolsStateId)
  if (from >= 0 && allPoolsBin !== undefined) {
    // allpools is not stale
    updateLastState()
    return concatDiffs([allPoolsBin, ...diffBins.slice(from + 1)])
  }
  // make new allPoolsBin
  const newstateId = updateLastState(true)
  makeNewAllPoolsBin(newstateId)
  return allPoolsBin as Uint8Array
}

async function handler(req: Request, res: Response) {
  res.setHeader(
    'Cache-Control',
    'maxage=1, s-maxage=1, stale-while-revalidate=59',
  )
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  const { stateId } = querySchema.parse(req.query)

  // const start = performance.now()
  const data = getCombinedDiff(stateId ?? 0)
  // const timing = Math.round(performance.now() - start)
  // console.log(
  //   `Pools binary serialization: ${poolCodes.length} pools ${timing}ms`,
  // )

  res.setHeader('Content-Type', 'application/octet-stream')
  res.set('Content-Type', 'application/octet-stream')
  return res.end(data)
}

export default handler
