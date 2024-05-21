import fs from 'fs'
import { type UseTradeParams, tradeValidator02 } from '@sushiswap/react-query'
import { isSwapApiEnabledChainId } from 'src/config'
import { ChainId } from 'sushi'
import { isRouteProcessor4ChainId } from 'sushi/config'
import { Amount, Native, USDC, USDT, WBTC } from 'sushi/currency'

const RECIPIENT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

type TradeParams = Omit<
  UseTradeParams,
  'chainId' | 'carbonOffset' | 'enabled' | 'recipient'
>

const chainIdArg = process.argv[2]
if (!chainIdArg) {
  throw new Error(
    `Chain ID is required, usage: 'pnpm generate-swaps <chainId>'`,
  )
}

const chainId = Number(chainIdArg)

if (Number.isNaN(chainId)) {
  throw new Error(`Chain ID must be a number, got ${chainIdArg}`)
}

if (!isSwapApiEnabledChainId(chainId)) {
  throw new Error(`Chain ID ${chainId} is not supported by the swap API`)
}

if (!(chainId in USDC) || !(chainId in USDT) || !(chainId in WBTC)) {
  throw new Error(
    `Chain ID ${chainId} does not support one of the required tokens`,
  )
}

const MOCK_DIRECTORY = 'test/swap/mock'

// // To make sure we're in the right place
if (!fs.existsSync(MOCK_DIRECTORY)) {
  throw new Error(`Directory ${MOCK_DIRECTORY} does not exist`)
}

fs.rmSync(MOCK_DIRECTORY, { recursive: true })
fs.mkdirSync(MOCK_DIRECTORY)

// ! COPIED FROM packages/react-query/src/hooks/trade/useTrade.ts
const API_BASE_URL =
  process.env['API_BASE_URL'] ||
  process.env['NEXT_PUBLIC_API_BASE_URL'] ||
  'https://api.sushi.com'

function getApiVersion(chainId: ChainId) {
  if (isRouteProcessor4ChainId(chainId)) {
    return '/v4'
  }
  return ''
}

const getSwapApiResult = async ({
  fromToken,
  toToken,
  amount,
  gasPrice = 50n,
  slippagePercentage,
  source,
}: TradeParams) => {
  const params = new URL(
    `${API_BASE_URL}/swap${getApiVersion(chainId)}/${chainId}`,
  )

  params.searchParams.set(
    'tokenIn',
    `${
      fromToken?.isNative
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : fromToken?.wrapped.address
    }`,
  )
  params.searchParams.set(
    'tokenOut',
    `${
      toToken?.isNative
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : toToken?.wrapped.address
    }`,
  )
  params.searchParams.set('amount', `${amount?.quotient.toString()}`)
  params.searchParams.set('maxPriceImpact', `${+slippagePercentage / 100}`)
  params.searchParams.set('gasPrice', `${gasPrice}`)
  params.searchParams.set('to', RECIPIENT)
  params.searchParams.set('preferSushi', 'true')
  if (source !== undefined) params.searchParams.set('source', `${source}`)

  console.log(params.toString())

  const res = await fetch(params.toString())
  const json = await res.json()
  const resp = tradeValidator02.parse(json)
  return resp
}
// !

const trades: Record<string, TradeParams> = {}
trades[`${chainId}-native-to-usdc`] = {
  fromToken: Native.onChain(chainId),
  toToken: USDC[chainId as keyof typeof USDC],
  amount: Amount.fromRawAmount(Native.onChain(chainId), 100),
  slippagePercentage: '0.5',
}

trades[`${chainId}-native-to-usdt`] = {
  fromToken: Native.onChain(chainId),
  toToken: USDT[chainId as keyof typeof USDT],
  amount: Amount.fromRawAmount(Native.onChain(chainId), 100),
  slippagePercentage: '0.5',
}

trades[`${chainId}-native-to-wbtc`] = {
  fromToken: Native.onChain(chainId),
  toToken: WBTC[chainId as keyof typeof WBTC],
  amount: Amount.fromRawAmount(Native.onChain(chainId), 100),
  slippagePercentage: '0.5',
}

trades[`${chainId}-unwrap`] = {
  fromToken: Native.onChain(chainId).wrapped,
  toToken: Native.onChain(chainId),
  amount: Amount.fromRawAmount(Native.onChain(chainId), 100),
  slippagePercentage: '0.5',
}

trades[`${chainId}-usdc-to-native`] = {
  fromToken: USDC[chainId as keyof typeof USDC],
  toToken: Native.onChain(chainId),
  amount: Amount.fromRawAmount(USDC[chainId as keyof typeof USDC], 100),
  slippagePercentage: '0.5',
}

trades[`${chainId}-usdc-to-usdt`] = {
  fromToken: USDC[chainId as keyof typeof USDC],
  toToken: USDT[chainId as keyof typeof USDT],
  amount: Amount.fromRawAmount(USDC[chainId as keyof typeof USDC], 100),
  slippagePercentage: '0.5',
}

trades[`${chainId}-usdt-to-native`] = {
  fromToken: USDT[chainId as keyof typeof USDT],
  toToken: Native.onChain(chainId),
  amount: Amount.fromRawAmount(USDT[chainId as keyof typeof USDT], 100),
  slippagePercentage: '0.5',
}

trades[`${chainId}-wrap`] = {
  fromToken: Native.onChain(chainId),
  toToken: Native.onChain(chainId).wrapped,
  amount: Amount.fromRawAmount(Native.onChain(chainId), 100),
  slippagePercentage: '0.5',
}

const main = async () => {
  for (const [name, trade] of Object.entries(trades)) {
    const result = await getSwapApiResult(trade)
    fs.writeFileSync(
      `${MOCK_DIRECTORY}/${name}.json`,
      JSON.stringify(result, null, 2),
    )
  }
}

main().then(() => process.exit(0))
