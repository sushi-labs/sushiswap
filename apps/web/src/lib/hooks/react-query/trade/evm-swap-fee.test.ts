import { Amount, subtractSlippage } from 'sushi'
import { EvmChainId, EvmNative, USDC, USDT } from 'sushi/evm'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type {
  TradeType1,
  UseEvmTradeParams,
  UseEvmTradeQuerySelect,
} from './types'
import { useEvmTrade } from './use-evm-trade'
import { useEvmTradeQuote } from './use-evm-trade-quote'

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock:
    vi.fn<
      (options: {
        queryFn: () => Promise<TradeType1>
        select: UseEvmTradeQuerySelect
      }) => void
    >(),
}))
vi.mock('@tanstack/react-query', () => ({ useQuery: useQueryMock }))
vi.mock('react', () => ({
  useCallback: (callback: unknown) => callback,
  useMemo: (factory: () => unknown) => factory(),
}))
vi.mock('@sushiswap/telemetry', () => ({
  SwapEventName: { SWAP_QUOTE_RECEIVED: 'quote' },
  sendAnalyticsEvent: vi.fn(),
  useTrace: () => ({}),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: '0x1111111111111111111111111111111111111111',
  }),
}))
vi.mock('~evm/_common/ui/price-provider/price-provider/use-prices', () => ({
  usePrices: () => ({ data: undefined }),
}))

const chainId = EvmChainId.ETHEREUM
const fromToken = USDC[chainId]
const toToken = USDT[chainId]
const response = {
  status: 'Success',
  tokens: [fromToken, toToken],
  tokenFrom: 0,
  tokenTo: 1,
  swapPrice: 1.0009876,
  priceImpact: 0,
  amountIn: '10000000',
  assumedAmountOut: '10009876',
  gasSpent: 27796,
}
const params: UseEvmTradeParams = {
  chainId,
  fromToken,
  toToken,
  amount: new Amount(fromToken, 10000000n),
  slippagePercentage: '0.00',
  recipient: undefined,
  enabled: true,
  carbonOffset: false,
}

afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe.each([
  { name: 'quote', useTrade: useEvmTradeQuote },
  { name: 'swap', useTrade: useEvmTrade },
])('$name fees', ({ useTrade }) => {
  it.each([
    { name: 'stable pair at zero slippage', slippage: '0.00', stable: true },
    { name: 'stable pair with slippage', slippage: '0.50', stable: true },
    { name: 'non-exempt pair', slippage: '0.00', stable: false },
  ])('$name', async ({ slippage, stable }) => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => response })
    vi.stubGlobal('fetch', fetchMock)
    const tokenIn = stable ? fromToken : EvmNative.fromChainId(chainId)
    useTrade({
      ...params,
      fromToken: tokenIn,
      amount: new Amount(tokenIn, 10000000n),
      slippagePercentage: slippage,
      fee: 0.0035,
    })
    const options = useQueryMock.mock.calls[0]?.[0]
    if (!options) {
      throw new Error('Missing trade query')
    }
    const trade = options.select(await options.queryFn())
    const url = new URL(fetchMock.mock.calls[0]?.[0])
    const fee = stable ? 0 : 0.0035
    expect(url.searchParams.get('fee')).toBe(String(fee))
    expect(trade.minAmountOut?.amount).toBe(
      subtractSlippage(
        subtractSlippage(new Amount(toToken, 10009876n), fee),
        Number(slippage) / 100,
      ).amount,
    )
    if (stable && slippage === '0.00') {
      expect(trade.minAmountOut?.amount).toBe(trade.amountOut?.amount)
      expect(trade.fee).toBe('$0')
    }
  })
})
