import { LogFilter } from '@sushiswap/extractor'
import { createPublicClient, http, Log, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

// for async case
function expect(condition: boolean, comment: string) {
  if (condition) return
  const err = new Error()
  console.error(`Wrong expectation: ${comment}`, err.stack)
  process.exit()
}

it.skip('LogFilter correctness test', async () => {
  const transport = http(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`)
  const client = createPublicClient({
    chain: mainnet,
    transport: transport,
  })

  let prevBlockNum = -1
  let prevLogIndex = -1
  const allLogs: Log[] = []

  const filter = new LogFilter(
    client,
    10,
    [
      parseAbiItem('event Transfer(address from, address to, uint256 value)'),
      parseAbiItem('event Approval(address owner, address spender, uint256 value)'),
    ],
    (logs?: Log[]) => {
      console.log(
        logs?.map((l) => [l.blockNumber, l.logIndex, l.removed]),
        'blocks in memory:',
        filter.blockHashMap.size
      )
      if (logs === undefined) filter.start()
      else {
        const start = allLogs.length
        allLogs.splice(start, 0, ...logs)
        for (let i = start; i < allLogs.length; ) {
          const l = allLogs[i]
          const bn = Number(l.blockNumber)
          const li = Number(l.logIndex)
          if (l.removed) {
            const prev = allLogs[i - 1]
            expect(prev.blockHash === l.blockHash, `Removed logs hash are equal ${prev.blockHash} == ${l.blockHash}`)
            expect(Number(prev.logIndex) === li, `Removed logIndexes are equal ${Number(prev.logIndex)} == ${li}`)
            allLogs.splice(i - 1, 2)
            prevBlockNum = bn
            prevLogIndex = -1
            --i
          } else {
            expect(bn >= prevBlockNum, `Block numbers ${bn} >= ${prevBlockNum}`)
            if (bn > prevBlockNum) prevLogIndex = -1
            prevBlockNum = bn

            expect(li > prevLogIndex, `Log indexes ${li} > ${prevLogIndex}`)
            prevLogIndex = li
            ++i
          }
        }
        if (allLogs.length > 10_000) allLogs.splice(0, 5_000)
      }
    }
  )

  await delay(1000 * 3600 * 24 * 7)
})

it.skip('LogFilter completeness test', async () => {
  const transport = http(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`)
  const client = createPublicClient({
    chain: mainnet,
    transport: transport,
  })

  const logHash = (l: Log) => `${l.blockHash}_${l.logIndex}`
  const logsMy: Set<string> = new Set()
  const logsEthalon: Set<string> = new Set()

  let myRemoved = 0
  const filterMy = new LogFilter(
    client,
    10,
    [parseAbiItem('event Transfer(address from, address to, uint256 value)')],
    (logs?: Log[]) => {
      // console.log(
      //   logs?.map((l) => [l.blockNumber, l.logIndex, l.removed]),
      //   'blocks in memory:',
      //   filterMy.blockHashMap.size
      // )
      if (logs === undefined) filterMy.start()
      else
        logs.forEach((l) => {
          if (l.removed) {
            logsMy.delete(logHash(l))
            ++myRemoved
          } else logsMy.add(logHash(l))
        })
    }
  )

  let ethalonRemoved = 0
  const filterEthalon = await client.createEventFilter({
    event: parseAbiItem('event Transfer(address from, address to, uint256 value)'),
  })
  for (let i = 0; ; ++i) {
    await delay(1000 * 10)
    const logs = await client.getFilterChanges({ filter: filterEthalon })
    logs.forEach((l) => {
      if (l.removed) {
        logsEthalon.delete(logHash(l))
        ++ethalonRemoved
      } else logsEthalon.add(logHash(l))
    })
    if (i === 0) {
      // remove initial difference
      const logs0: string[] = []
      logsMy.forEach((l) => {
        if (!logsEthalon.has(l)) logs0.push(l)
      })
      logs0.forEach((l) => logsMy.delete(l))

      const logs1: string[] = []
      logsEthalon.forEach((l) => {
        if (!logsMy.has(l)) logs1.push(l)
      })
      logs1.forEach((l) => logsEthalon.delete(l))
    }
    let uniqueMy = 0,
      uniqueEthalon = 0
    logsMy.forEach((l) => {
      if (!logsEthalon.has(l)) uniqueMy++
    })
    logsEthalon.forEach((l) => {
      if (!logsMy.has(l)) uniqueEthalon++
    })
    console.log(
      `My logs: ${logsMy.size}, eth logs: ${logsEthalon.size}, only my: ${uniqueMy}, only eth: ${uniqueEthalon}` +
        ` my removed: ${myRemoved} eth removed: ${ethalonRemoved}`
    )
  }
})
