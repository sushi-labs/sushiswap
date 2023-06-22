import { LogFilter } from '@sushiswap/extractor'
import { createPublicClient, http, Log, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

// for async case
function expect(condition: boolean, comment: string) {
  if (condition) return
  const err = new Error()
  console.error('Wrong expectation: ' + comment, err.stack)
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
        for (let i = 0; i < logs.length; ) {
          const l = logs[i]
          const bn = Number(l.blockNumber)
          const li = Number(l.logIndex)
          if (l.removed) {
            const prev = logs[i - 1]
            expect(prev.blockHash == l.blockHash, `Removed logs hash are equal ${prev.blockHash} == ${l.blockHash}`)
            expect(Number(prev.logIndex) == li, `Removed logIndexes are equal ${Number(prev.logIndex)} == ${li}`)
            logs.splice(i - 1, 2)
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
      }
    }
  )

  await delay(1000 * 3600 * 24 * 7)
})
