import fs from 'node:fs'
import {
  type UseEvmTradeParams,
  tradeValidator02,
} from 'src/lib/hooks/react-query'
import { API_BASE_URL } from 'src/lib/swap/api-base-url'
import { publicClientConfig } from 'src/lib/wagmi/config/viem'
import { Amount } from 'sushi'
import { EvmChainId, EvmNative, USDC, USDT, WBTC } from 'sushi/evm'
import { createPublicClient, stringify } from 'viem'
import { getBlockNumber } from 'viem/actions'
import { isSwapApiEnabledChainId } from '../../../src/config'

const sender = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

type TradeParams = Omit<
  UseEvmTradeParams,
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

const getSwapApiResult = async ({
  fromToken,
  toToken,
  amount,
  slippagePercentage,
  source,
}: TradeParams) => {
  const params = new URL(`${API_BASE_URL}/swap/v7/${chainId}`)

  params.searchParams.set(
    'tokenIn',
    `${
      fromToken?.type === 'native'
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : fromToken?.wrap().address
    }`,
  )
  params.searchParams.set(
    'tokenOut',
    `${
      toToken?.type === 'native'
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : toToken?.wrap().address
    }`,
  )
  params.searchParams.set('amount', `${amount?.amount.toString()}`)
  params.searchParams.set('maxSlippage', `${Number(slippagePercentage) / 100}`)
  params.searchParams.set('sender', sender)
  params.searchParams.set('simulate', 'false')

  if (source !== undefined) params.searchParams.set('source', `${source}`)

  const res = await fetch(params.toString())
  const json = await res.json()
  const resp = tradeValidator02.parse(json)
  return resp
}
// !

// Assume 100MATIC for Polygon, 1PROBABLY_ETH for the rest
const nativeAmounts: Partial<Record<EvmChainId, Amount<EvmNative>>> = {
  [EvmChainId.POLYGON]: new Amount(
    EvmNative.fromChainId(EvmChainId.POLYGON),
    1e20,
  ),
}
const nativeAmount =
  nativeAmounts[chainId] || new Amount(EvmNative.fromChainId(chainId), 1e18)

const trades: Record<string, TradeParams> = {}
trades[`${chainId}-native-to-usdc`] = {
  fromToken: EvmNative.fromChainId(chainId),
  toToken: USDC[chainId as keyof typeof USDC],
  amount: nativeAmount,
  slippagePercentage: '0.5',
}

trades[`${chainId}-native-to-usdt`] = {
  fromToken: EvmNative.fromChainId(chainId),
  toToken: USDT[chainId as keyof typeof USDT],
  amount: nativeAmount,
  slippagePercentage: '0.5',
}

trades[`${chainId}-native-to-wbtc`] = {
  fromToken: EvmNative.fromChainId(chainId),
  toToken: WBTC[chainId as keyof typeof WBTC],
  amount: nativeAmount,
  slippagePercentage: '0.5',
}

trades[`${chainId}-unwrap`] = {
  fromToken: EvmNative.fromChainId(chainId).wrap(),
  toToken: EvmNative.fromChainId(chainId),
  amount: nativeAmount,
  slippagePercentage: '0.5',
}

trades[`${chainId}-usdc-to-native`] = {
  fromToken: USDC[chainId as keyof typeof USDC],
  toToken: EvmNative.fromChainId(chainId),
  amount: new Amount(USDC[chainId as keyof typeof USDC], 1e6),
  slippagePercentage: '0.5',
}

trades[`${chainId}-usdc-to-usdt`] = {
  fromToken: USDC[chainId as keyof typeof USDC],
  toToken: USDT[chainId as keyof typeof USDT],
  amount: new Amount(USDC[chainId as keyof typeof USDC], 1e6),
  slippagePercentage: '0.5',
}

trades[`${chainId}-usdt-to-native`] = {
  fromToken: USDT[chainId as keyof typeof USDT],
  toToken: EvmNative.fromChainId(chainId),
  amount: new Amount(USDT[chainId as keyof typeof USDT], 1e6),
  slippagePercentage: '0.5',
}

trades[`${chainId}-wrap`] = {
  fromToken: EvmNative.fromChainId(chainId),
  toToken: EvmNative.fromChainId(chainId).wrap(),
  amount: nativeAmount,
  slippagePercentage: '0.5',
}

const main = async () => {
  const blockNumber = await getBlockNumber(
    createPublicClient(publicClientConfig[chainId]),
  )
  console.log('Block number: ', blockNumber)

  for (const [name, trade] of Object.entries(trades)) {
    const result = await getSwapApiResult(trade)
    fs.writeFileSync(
      `${MOCK_DIRECTORY}/${name}.json`,
      stringify(result, null, 2),
    )
  }
}

main().then(() => process.exit(0))
