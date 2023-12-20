import fs from 'fs'
import path from 'path'

enum TestMode {
  KNOWN_TOKENS = 0,
  ONE_UNKNOWN_TOKEN = 1,
  BOTH_UNKNOWN_TOKENS = 2,
}

const TEST_MODE = TestMode.ONE_UNKNOWN_TOKEN
const REQUEST_PER_SEC = 2
const SWAP_AMOUNT = 10

const CACHE_DIR = '../cache'
const TOKEN_FILES_PREFIX = 'tokens-'
const SERVER_ADDRESS = 'http://localhost:1337'
const USER_ADDRESS = '0xBa8656A5D95087ab4d015f1B68D72cD246FcC6C3' // random address with no contract
const MS_PER_REQUEST = Math.round(1000 / REQUEST_PER_SEC)

interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
}

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

function loadAllTokens(): Record<number, Token[]> {
  const res: Record<number, Token[]> = {}
  const fullDirName = path.resolve(__dirname, CACHE_DIR)
  fs.readdirSync(fullDirName).forEach((fileName) => {
    if (!fileName.startsWith(TOKEN_FILES_PREFIX)) return
    const fullFileName = path.resolve(fullDirName, fileName)
    const chainId = parseInt(fileName.substring(TOKEN_FILES_PREFIX.length))
    const file = fs.readFileSync(fullFileName, 'utf8')
    res[chainId] = file
      .split('\n')
      .map((s) => (s === '' ? undefined : (JSON.parse(s) as Token)))
      .filter((t) => t !== undefined) as Token[]
    res[chainId].unshift({
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Native',
      symbol: 'Native',
      decimals: 18,
    })
  })
  return res
}

function getRandomNetwork(
  totalTokens: number,
  tokenNumber: [number, number][],
): number {
  const num = Math.floor(Math.random() * totalTokens)
  let total = 0
  for (let i = 0; i < tokenNumber.length; ++i) {
    total += tokenNumber[i][1]
    if (total >= num) return tokenNumber[i][0]
  }
  console.assert(false, 'Should not be reached')
  return 0
}

// Arbitrary 2 tokens
function getRandomPair1(num: number): [number, number] {
  const first = Math.floor(Math.random() * num)
  let second = Math.floor(Math.random() * (num - 1))
  if (second >= first) ++second
  return [first, second]
}

// arbitrary token against arbitrary first 5 tokens
function getRandomPair2(num: number): [number, number] {
  const best = Math.min(num - 1, 6)
  const first = Math.floor(Math.random() * best)
  let second = Math.floor(Math.random() * (num - 1))
  if (second >= first) ++second
  return Math.random() < 0.5 ? [first, second] : [second, first]
}

function getRandomPair3(num: number): [number, number] {
  const best = Math.min(num - 1, 6)
  const first = Math.floor(Math.random() * best)
  let second = Math.floor(Math.random() * (best - 1))
  if (second >= first) ++second
  return Math.random() < 0.5 ? [first, second] : [second, first]
}

function getRandomPair(num: number, mode: TestMode): [number, number] {
  const func =
    mode === TestMode.KNOWN_TOKENS
      ? getRandomPair3
      : mode === TestMode.ONE_UNKNOWN_TOKEN
      ? getRandomPair2
      : getRandomPair1
  return func(num)
}

let success = 0
let successTime = 0
let failed = 0
let failedTime = 0

async function makeRequest(
  chainId: number,
  from: Token,
  amount: bigint,
  to: Token,
  recipient: string,
) {
  const startTime = performance.now()
  const requestUrl =
    `${SERVER_ADDRESS}/?chainId=${chainId}` +
    `&tokenIn=${from.address}&tokenOut=${to.address}&amount=${amount}&to=${recipient}`
  let res = 'Failed'
  try {
    const resp = await fetch(requestUrl)
    if (resp.status === 200) {
      const json = (await resp.json()) as string
      const respObj = JSON.parse(json)
      res = respObj.route?.status ?? respObj.status
    } else throw new Error(resp.status.toString())
  } catch (e) {
    const timing = performance.now() - startTime
    ++failed
    failedTime += timing
    console.log(
      'Failed request:',
      //requestUrl,
      `${Math.round((failed / (failed + success)) * 100)}%`,
      `${success > 0 ? Math.round(successTime / success) : 0}ms`,
      `${failed > 0 ? Math.round(failedTime / failed) : 0}ms`,
      (e as Error).message,
    )
    //return 'Failed'
  }
  const timing = performance.now() - startTime
  ++success
  successTime += timing
  console.log(
    `Request: ${chainId} 1e${from.decimals + 1} ${from.symbol}->${
      to.symbol
    } ${res} ${Math.round(timing)}ms ()`,
    `${Math.round((success / (failed + success)) * 100)}%`,
    `${success > 0 ? Math.round(successTime / success) : 0}ms`,
    `${failed > 0 ? Math.round(failedTime / failed) : 0}ms`,
  )
}

async function simulate() {
  const tokens = loadAllTokens()
  const tokenNumber: [number, number][] = Object.entries(tokens).map(
    ([id, tokens]) => [Number(id), tokens.length],
  )
  const totalTokens = tokenNumber.reduce((a, b) => a + b[1], 0)
  for (;;) {
    const delayPromise = delay(MS_PER_REQUEST)
    const chainId = getRandomNetwork(totalTokens, tokenNumber)
    const chainTokens = tokens[chainId]
    const [from, to] = getRandomPair(chainTokens.length, TEST_MODE)
    const amount = BigInt(SWAP_AMOUNT * 10 ** chainTokens[from].decimals)
    // const startTime = performance.now()
    // const res = await
    makeRequest(
      chainId,
      chainTokens[from],
      amount,
      chainTokens[to],
      USER_ADDRESS,
    )
    // const timing = performance.now() - startTime
    // console.log(
    //   `Request: ${chainId} 1e${chainTokens[from].decimals + 1} ${
    //     chainTokens[from].symbol
    //   }->${chainTokens[to].symbol} ${res} ${Math.round(timing)}ms`,
    // )
    await delayPromise
  }
}

simulate()
