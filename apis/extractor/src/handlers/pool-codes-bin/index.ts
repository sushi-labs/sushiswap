import { Logger } from '@sushiswap/extractor'
import { Request, Response } from 'express'
import { Token } from 'sushi/currency'
import {
  PoolCode,
  comparePoolArrays,
  deserializePoolsBinary,
  serializePoolsBinary,
} from 'sushi/router'
import { CHAIN_ID, POOLS_SERIALIZATION_INTERVAL } from '../../config/index.js'
import extractor from '../../extractor.js'
import { querySchema } from './schema.js'

const MIN_STATE_UPDATE_INTERVAL = 2_000
const REMOVE_HISTORY_BEFORE = 300_000
const INCREMENTAL_MODE = extractor.config['poolIncrementalMode'] ?? true
const TEST_INCREMENTAL_MODE_CORRECTNESS =
  extractor.config['checkPoolIncrementalModeCorrectness'] ?? false

// ======================== All pools sending ============================

let lastPoolsBlob: Uint8Array = new Uint8Array(0)
let lastPoolsSerializationTime = 0

async function handlerAll(req: Request, res: Response) {
  res.setHeader(
    'Cache-Control',
    'maxage=1, s-maxage=1, stale-while-revalidate=59',
  )
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  if (
    Date.now() - lastPoolsSerializationTime >
    POOLS_SERIALIZATION_INTERVAL(CHAIN_ID)
  ) {
    const start = performance.now()
    const poolCodes = extractor.getCurrentPoolCodes()
    lastPoolsBlob = serializePoolsBinary(poolCodes, {
      stateId: 1,
      prevStateId: 0,
    })
    lastPoolsSerializationTime = Date.now()
    console.log(
      `Pools binary serialization: ${poolCodes.length} pools ${Math.round(
        performance.now() - start,
      )}ms`,
    )
  }
  res.setHeader('Content-Type', 'application/octet-stream')
  res.set('Content-Type', 'application/octet-stream')
  return res.end(lastPoolsBlob)
}

//============================= Only updated pools sended ============================

interface State {
  id: number
  diff: Uint8Array
  poolNum: number
}

const states: State[] = []
let AllPoolsState: State | undefined = undefined

function updateLastState(force = false): number {
  let newStateId = Date.now()
  const lastStateId =
    states.length > 0 ? (states[states.length - 1]?.id as number) : 0
  if (!force && newStateId < lastStateId + MIN_STATE_UPDATE_INTERVAL)
    return lastStateId // updated recently
  if (newStateId === lastStateId) ++newStateId // can be equal theoretically
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
  if (TEST_INCREMENTAL_MODE_CORRECTNESS) testClient.updateAndCheck()
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

function cleanOldHistory() {
  const removeBefore = Date.now() - REMOVE_HISTORY_BEFORE
  for (let i = 0; i < states.length; ++i) {
    if ((states[i] as State).id <= removeBefore) continue
    if (i > 0) states.splice(0, i - 1)
    break
  }
  setTimeout(() => cleanOldHistory(), REMOVE_HISTORY_BEFORE)
}
cleanOldHistory()

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

async function handlerInc(req: Request, res: Response) {
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

class TestClient {
  state = 0
  poolCodesMap: Map<string, PoolCode> = new Map()
  tokenMap: Map<string, Token> = new Map()
  chainId?: number | string | undefined
  checking = false

  updateAndCheck() {
    if (this.checking) return
    this.checking = true
    const states = getStateList(this.state)
    for (let i = 0; i < states.length; ++i) {
      const {
        pools,
        extraData: { stateId, prevStateId },
        finish,
      } = deserializePoolsBinary(
        states[i]?.diff as Uint8Array,
        0,
        (addr: string) => this.tokenMap.get(addr),
      )
      if (pools.length > 0) {
        if (this.chainId === undefined)
          this.chainId = pools[0]?.pool.token0.chainId
        else if (this.chainId !== pools[0]?.pool.token0.chainId)
          Logger.error(
            CHAIN_ID,
            `TestClient Wrong binary data length: expected ${states[i]?.diff.byteLength}, really read ${finish}`,
          )
      }
      if (finish !== states[i]?.diff.byteLength)
        Logger.error(
          CHAIN_ID,
          `TestClient Wrong binary data length: expected ${states[i]?.diff.byteLength}, really read ${finish}`,
        )
      if (prevStateId === 0) {
        this.poolCodesMap.clear()
        this.tokenMap.clear()
      } else if (prevStateId !== this.state) {
        Logger.error(
          CHAIN_ID,
          `TestClient incorrect router state: ${this.state} -> ${prevStateId}`,
        )
      }
      pools.forEach((p) => {
        const t0 = p.pool.token0
        const t1 = p.pool.token1
        this.tokenMap.set(t0.address, t0 as Token)
        this.tokenMap.set(t1.address, t1 as Token)
        this.poolCodesMap.set(p.pool.address, p)
      })
      this.state = stateId
    }
    const poolsReal = extractor.getCurrentPoolCodes()
    const res = comparePoolArrays(
      Array.from(this.poolCodesMap.values()),
      poolsReal,
    )
    if (!res) Logger.error(CHAIN_ID, 'TestClient wrong pools compare')
    this.checking = false
  }
}

const testClient = new TestClient()

async function handler(req: Request, res: Response) {
  if (INCREMENTAL_MODE) return handlerInc(req, res)
  else return handlerAll(req, res)
}

export default handler
