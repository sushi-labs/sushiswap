import { Request, Response } from 'express'
import { serializePoolsBinary } from 'sushi/router'
import { CHAIN_ID } from '../../config.js'
import extractor from '../../extractor.js'
import { querySchema } from './schema.js'

const MIN_STATE_UPDATE_INTERVAL = 2_000

interface State {
  id: number
  diff: Uint8Array
  poolNum: number
}

const states: State[] = []
let AllPoolsState: State | undefined = undefined

function updateLastState(force = false): number {
  const newStateId = Date.now()
  const lastStateId =
    states.length > 0 ? (states[states.length - 1]?.id as number) : 0
  if (!force && newStateId < lastStateId + MIN_STATE_UPDATE_INTERVAL)
    return lastStateId // updated recently
  const newPools = extractor.getCurrentPoolCodesUpdate()
  const diff = serializePoolsBinary(newPools, {
    stateId: newStateId,
    prevStateId: lastStateId,
  })
  states.push({
    id: newStateId,
    diff,
    poolNum: newPools.length,
  })
  return newStateId
}

function makeNewAllPoolsBin(newstateId: number) {
  const pools = extractor.getCurrentPoolCodes()
  const diff = serializePoolsBinary(pools, {
    stateId: newstateId,
    prevStateId: 0,
  })
  AllPoolsState = {
    id: newstateId,
    diff,
    poolNum: pools.length,
  }
}

function concatUint8Arrays(arrs: Uint8Array[]): Uint8Array {
  if (arrs.length === 1) return arrs[0] as Uint8Array
  const length = arrs.reduce((a, b) => a + b.length, 0)
  const res = new Uint8Array(length)
  let pos = 0
  arrs.forEach((d) => {
    res.set(d, pos)
    pos += d.length
  })
  return res
}

// i > j => arr[i] >= arr[j]
// returns the index of the element in arr or -1
function binarySearchState(stateId: number): number {
  let start = 0
  let end = states.length - 1
  while (start <= end) {
    const mid = Math.floor((start + end) / 2)
    const diff = (states[mid]?.id as number) - stateId
    if (diff === 0) return mid
    else if (diff < 0) start = mid + 1
    else end = mid - 1
  }
  return -1
}

function getStateList(stateId: number): State[] {
  const from = binarySearchState(stateId)
  if (from >= 0) {
    // state was found in the history
    updateLastState()
    return states.slice(from + 1)
  }
  // unknown state
  if (AllPoolsState) {
    const from = binarySearchState(AllPoolsState.id)
    if (from >= 0) {
      // AllPoolsState is not stale
      updateLastState()
      return [AllPoolsState, ...states.slice(from + 1)]
    }
  }
  // make new allPoolsBin
  const newstateId = updateLastState(true)
  makeNewAllPoolsBin(newstateId)
  return [AllPoolsState as State]
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

  const start = performance.now()
  const stateList = getStateList(stateId ?? 0)
  const data = concatUint8Arrays(stateList.map((s) => s.diff))
  const poolString = stateList.map((s) => s.poolNum.toString()).join('+')
  const timing = Math.round(performance.now() - start)
  console.log(`Pools binary serialization: ${poolString} pools ${timing}ms`)

  res.setHeader('Content-Type', 'application/octet-stream')
  res.set('Content-Type', 'application/octet-stream')
  return res.end(data)
}

export default handler
