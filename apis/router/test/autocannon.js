const fs = require('fs')
const path = require('path')
const autocannon = require('autocannon')

const TestMode = {
  KNOWN_TOKENS: 0,
  ONE_UNKNOWN_TOKEN: 1,
  BOTH_UNKNOWN_TOKENS: 2,
}

const TEST_MODE = TestMode.KNOWN_TOKENS
const SWAP_AMOUNT = 10

const chainId = 1
const tokensFile = './tokens-1'

function loadAllTokens() {
  const fileName = path.resolve(__dirname, tokensFile)
  const file = fs.readFileSync(fileName, 'utf8')
  const res = file
    .split('\n')
    .map((s) => (s === '' ? undefined : JSON.parse(s)))
    .filter((t) => t !== undefined)
  res.unshift({
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    name: 'Native',
    symbol: 'Native',
    decimals: 18,
  })
  return res
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

const instance = autocannon(
  {
    url: 'http://staging.sushi.com',
    duration: 30,
    requests: [
      // {
      //   method: 'GET',
      //   path: '/200',
      // },
      {
        method: 'GET',
        setupRequest: (req) => {
          const [from, to] = getRandomPair(tokens.length, TEST_MODE)
          const tokenIn = tokens[from]
          const tokenOut = tokens[to]
          const amount = BigInt(SWAP_AMOUNT * 10 ** tokenIn.decimals)
          return {
            ...req,
            path: `/swap/v1/${chainId}?chainId=${chainId}&tokenIn=${
              tokenIn.address
            }&tokenOut=${tokenOut.address}&amount=${amount.toString()}`,
          }
        },
      },
    ],
  },
  console.log,
)

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop()
})

// just render results
autocannon.track(instance, { renderProgressBar: true })
