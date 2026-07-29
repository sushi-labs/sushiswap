import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query/trade/types'
import { tradeValidator02 } from 'src/lib/hooks/react-query/trade/validator02'
import { Amount, Percent, Price } from 'sushi'
import {
  EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
  RED_SNWAPPER_ADDRESS,
  SUSHISWAP_V3_QUOTER,
  UI_FEE_COLLECTOR_ADDRESS,
} from 'sushi/evm'
import { http, createPublicClient, defineChain, isHex, parseAbi } from 'viem'
import { describe, expect, test } from 'vitest'
import { applyOutputFee, encodeDirectPoolSwap, getBetterTrade } from './utils'

const LIVE_TESTS_ENABLED = process.env.RUN_LIVE_DIRECT_POOL_TESTS === 'true'
const CHAIN_ID = EvmChainId.ROBINHOOD
const AMOUNT_IN = 1_000_000_000_000_000n
const FEE = 0.0035
const SENDER = '0x56d1670070C8f015c5c5ADF717b8B04012d353C2'
const POOL = '0x0da374E5fEFb5cCBCaBd2113Bd7700232fC5B84F'
const TOKEN = new EvmToken({
  chainId: CHAIN_ID,
  address: '0x66175075f60c893456ee6a0237ed0f548a9023a2',
  decimals: 18,
  symbol: 'SUSHICAT',
  name: 'Sushi Cat',
})
const NATIVE = EvmNative.fromChainId(CHAIN_ID)

const robinhood = defineChain({
  id: CHAIN_ID,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.chain.robinhood.com'] },
  },
})
const client = createPublicClient({
  chain: robinhood,
  transport: http(),
})
const quoterAbi = parseAbi([
  'function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
])

function makeTrade(
  amountIn: bigint,
  amountOut: bigint,
  routingSource: string,
): UseEvmTradeReturn {
  const input = new Amount<EvmCurrency>(NATIVE, amountIn)
  const output = new Amount<EvmCurrency>(TOKEN, amountOut)

  return {
    swapPrice: new Price({ baseAmount: input, quoteAmount: output }),
    priceImpact: new Percent(0),
    amountIn: input,
    amountOut: output,
    minAmountOut: output,
    gasSpent: undefined,
    gasSpentUsd: undefined,
    route: undefined,
    status: 'Success',
    tx: undefined,
    tokenTax: undefined,
    fee: undefined,
    routingSource,
  }
}

describe.skipIf(!LIVE_TESTS_ENABLED)(
  'live aggregator/direct pool comparison',
  () => {
    test('quotes and simulates both paths for the reported launch token', async () => {
      const params = new URL('https://api.sushi.com/swap/v7/4663')
      params.searchParams.set(
        'tokenIn',
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      )
      params.searchParams.set('tokenOut', TOKEN.address)
      params.searchParams.set('amount', AMOUNT_IN.toString())
      params.searchParams.set('maxSlippage', '0.005')
      params.searchParams.set('sender', SENDER)
      params.searchParams.set('simulate', 'false')
      params.searchParams.set('fee', FEE.toString())
      params.searchParams.set('feeBy', 'output')
      params.searchParams.set('feeReceiver', UI_FEE_COLLECTOR_ADDRESS[CHAIN_ID])

      const response = await fetch(params)
      const aggregator = tradeValidator02.parse(await response.json())
      if (aggregator.status !== 'Success' || !aggregator.tx) {
        throw new Error('Aggregator did not return an executable route')
      }
      if (!isHex(aggregator.tx.data)) {
        throw new Error('Aggregator returned invalid calldata')
      }

      const directQuote = await client.readContract({
        address: SUSHISWAP_V3_QUOTER[CHAIN_ID],
        abi: quoterAbi,
        functionName: 'quoteExactInputSingle',
        args: [
          {
            tokenIn: NATIVE.wrap().address,
            tokenOut: TOKEN.address,
            amountIn: AMOUNT_IN,
            fee: 10_000,
            sqrtPriceLimitX96: 0n,
          },
        ],
      })
      const directAmountOut = directQuote[0]
      const aggregatorAmountOut = BigInt(aggregator.assumedAmountOut)
      const aggregatorTrade = makeTrade(
        AMOUNT_IN,
        aggregatorAmountOut,
        'Aggregator',
      )
      const directTrade = makeTrade(AMOUNT_IN, directAmountOut, 'Direct pool')
      const expected =
        directAmountOut > aggregatorAmountOut ? directTrade : aggregatorTrade

      expect(getBetterTrade(aggregatorTrade, directTrade)).toBe(expected)

      const aggregatorSimulation = await client.call({
        account: SENDER,
        to: aggregator.tx.to,
        data: aggregator.tx.data,
        value: aggregator.tx.value,
      })
      expect(aggregatorSimulation.data).toBeDefined()

      const netDirectAmountOut = applyOutputFee(directAmountOut, FEE)
      const directSwap = encodeDirectPoolSwap({
        amountIn: AMOUNT_IN,
        amountOut: directAmountOut,
        amountOutMin: (netDirectAmountOut * 995n) / 1_000n,
        chainId: CHAIN_ID,
        fee: FEE,
        fromToken: NATIVE,
        poolAddress: POOL,
        recipient: SENDER,
        toToken: TOKEN,
      })
      const directSimulation = await client.call({
        account: SENDER,
        to: RED_SNWAPPER_ADDRESS[CHAIN_ID],
        data: directSwap.data,
        value: directSwap.value,
      })
      expect(directSimulation.data).toBeDefined()
    }, 30_000)
  },
)
