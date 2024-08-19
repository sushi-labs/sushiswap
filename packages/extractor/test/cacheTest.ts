import { PermanentCache } from '../src/PermanentCache.js'

//const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

interface TestExampleRecord {
  address: string
  name: string
  symbol: string
  decimals: number
}

async function testCache() {
  const cache = new PermanentCache<TestExampleRecord>('test-load-cache')
  const records = await cache.getAllRecords()
  if (records.length === 0) console.log('Cache was created')
  else console.log(records.length, 'records were read from cache')
  const randomId = Math.floor(Math.random() * 1e12)
  for (let i = 0; i < 50_000; ++i) {
    const record = {
      address: `addr_${randomId}_${i}`,
      name: `name_${randomId}_${i}`,
      symbol: `symb_${randomId}_${i}`,
      decimals: i,
    }
    await cache.add(record)
    if (i % 1000 === 0) console.log(i, 'records')
    //await delay(100)
  }
}

testCache()
