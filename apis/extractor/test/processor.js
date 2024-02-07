const fs = require('fs')
const path = require('path')

const TestMode = {
  KNOWN_TOKENS: 0,
  ONE_UNKNOWN_TOKEN: 1,
  BOTH_UNKNOWN_TOKENS: 2,
}

const TEST_MODE = TestMode.KNOWN_TOKENS
const SWAP_AMOUNT = 10

const CACHE_DIR = '../cache'
const TOKEN_FILES_PREFIX = 'tokens-'

const USER_ADDRESS = '0xBa8656A5D95087ab4d015f1B68D72cD246FcC6C3' // random address with no contract

function loadAllTokens() {
  const res = {}
  const fullDirName = path.resolve(__dirname, CACHE_DIR)
  fs.readdirSync(fullDirName).forEach((fileName) => {
    if (!fileName.startsWith(TOKEN_FILES_PREFIX)) return
    const fullFileName = path.resolve(fullDirName, fileName)
    const chainId = parseInt(fileName.substring(TOKEN_FILES_PREFIX.length))
    const file = fs.readFileSync(fullFileName, 'utf8')
    res[chainId] = file
      .split('\n')
      .map((s) => (s === '' ? undefined : JSON.parse(s)))
      .filter((t) => t !== undefined)
    res[chainId].unshift({
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Native',
      symbol: 'Native',
      decimals: 18,
    })
  })
  return res
}

function getRandomNetwork(totalTokens, tokenNumber) {
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
function getRandomPair1(num) {
  const first = Math.floor(Math.random() * num)
  let second = Math.floor(Math.random() * (num - 1))
  if (second >= first) ++second
  return [first, second]
}

// arbitrary token against arbitrary first 5 tokens
function getRandomPair2(num) {
  const best = Math.min(num - 1, 6)
  const first = Math.floor(Math.random() * best)
  let second = Math.floor(Math.random() * (num - 1))
  if (second >= first) ++second
  return Math.random() < 0.5 ? [first, second] : [second, first]
}

function getRandomPair3(num) {
  const best = Math.min(num - 1, 6)
  const first = Math.floor(Math.random() * best)
  let second = Math.floor(Math.random() * (best - 1))
  if (second >= first) ++second
  return Math.random() < 0.5 ? [first, second] : [second, first]
}

function getRandomPair(num, mode) {
  const func =
    mode === TestMode.KNOWN_TOKENS
      ? getRandomPair3
      : mode === TestMode.ONE_UNKNOWN_TOKEN
      ? getRandomPair2
      : getRandomPair1
  return func(num)
}

const tokens = loadAllTokens()

// const tokenNumber = Object.entries(tokens).map(([id, tokens]) => [
//   Number(id),
//   tokens.length,
// ])

// const totalTokens = tokenNumber.reduce((a, b) => a + b[1], 0)

function setQuery(context, _, done) {
  // TODO: maybe allow this to be set in the scenario
  // const _chainId = getRandomNetwork(totalTokens, tokenNumber)
  const chainId = 1
  const chainTokens = tokens[chainId]
  const [from, to] = getRandomPair(chainTokens.length, TEST_MODE)
  const amount = BigInt(SWAP_AMOUNT * 10 ** chainTokens[from].decimals)
  context.vars['query'] = {
    ...context.vars['query'],
    chainId: chainId.toString(),
    tokenIn: chainTokens[from].address,
    tokenOut: chainTokens[to].address,
    amount: amount.toString(),
    to: USER_ADDRESS,
  }
  return done()
}

module.exports = {
  setQuery,
}
