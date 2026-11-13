import { renderToStaticMarkup } from 'react-dom/server'
import { Amount } from 'sushi'
import { EvmChainId, EvmNative, EvmToken } from 'sushi/evm'
import { STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import { SvmChainId, SvmNative } from 'sushi/svm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAmountUsd } from './use-amount-usd'

const mocks = vi.hoisted(() => ({
  useCurrencyPrice: vi.fn(),
  price: {
    data: undefined as number | undefined,
    isLoading: false,
    isError: false,
  },
}))

vi.mock(
  'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-currency-price',
  () => ({ useCurrencyPrice: mocks.useCurrencyPrice }),
)

const usdc = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
})
const ether = EvmNative.fromChainId(EvmChainId.ETHEREUM)
const solana = SvmNative.fromChainId(SvmChainId.SOLANA)
const stellar = STELLAR_XLM[StellarChainId.STELLAR]

function getAmountUsd(
  props: Parameters<typeof useAmountUsd>[0],
): ReturnType<typeof useAmountUsd> {
  let result: ReturnType<typeof useAmountUsd> | undefined

  function Probe(): null {
    result = useAmountUsd(props)
    return null
  }

  renderToStaticMarkup(<Probe />)
  if (!result) throw new Error('Amount USD hook did not render')
  return result
}

beforeEach(() => {
  mocks.price = { data: undefined, isLoading: false, isError: false }
  mocks.useCurrencyPrice.mockReset()
  mocks.useCurrencyPrice.mockImplementation(() => mocks.price)
})

describe('useAmountUsd', () => {
  it.each([
    ['six-decimal token', new Amount(usdc, 1_250_000n), 2, 2.5],
    ['EVM native', new Amount(ether, 2_500_000_000_000_000n), 2_000, 5],
    ['Solana native', new Amount(solana, 1_500_000_000n), 100, 150],
    ['Stellar native', new Amount(stellar, 50_000_000n), 0.2, 1],
  ] as const)(
    'converts the %s amount to human units before applying its unit price',
    (_name, amount, price, expected) => {
      mocks.price.data = price

      expect(getAmountUsd({ amount })).toEqual({
        data: expected,
        isLoading: false,
      })
      expect(mocks.useCurrencyPrice).toHaveBeenCalledWith({
        currency: amount.currency,
        enabled: true,
      })
    },
  )

  it('preserves a known zero amount when its unit price is valid', () => {
    mocks.price.data = 2_000

    expect(getAmountUsd({ amount: new Amount(ether, 0n) })).toEqual({
      data: 0,
      isLoading: false,
    })
  })

  it.each([
    undefined,
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])(
    'leaves USD unknown for an invalid or unavailable unit price (%j)',
    (price) => {
      mocks.price.data = price

      expect(getAmountUsd({ amount: new Amount(usdc, 1_000_000n) })).toEqual({
        data: undefined,
        isLoading: false,
      })
    },
  )

  it('does not use cached price data when the price query has failed', () => {
    mocks.price = { data: 2, isLoading: false, isError: true }

    expect(getAmountUsd({ amount: new Amount(usdc, 1_000_000n) })).toEqual({
      data: undefined,
      isLoading: false,
    })
  })

  it.each([undefined, null])(
    'does not price or load a missing amount (%j)',
    (amount) => {
      mocks.price = { data: 2, isLoading: true, isError: false }

      expect(getAmountUsd({ amount })).toEqual({
        data: undefined,
        isLoading: false,
      })
      expect(mocks.useCurrencyPrice).toHaveBeenCalledWith({
        currency: undefined,
        enabled: false,
      })
    },
  )

  it('disables pricing and loading when the USD value is not requested', () => {
    const amount = new Amount(usdc, 1_000_000n)
    mocks.price = { data: 2, isLoading: true, isError: false }

    expect(getAmountUsd({ amount, enabled: false })).toEqual({
      data: undefined,
      isLoading: false,
    })
    expect(mocks.useCurrencyPrice).toHaveBeenCalledWith({
      currency: undefined,
      enabled: false,
    })
  })

  it('reports loading without substituting a zero dollar value', () => {
    mocks.price.isLoading = true

    expect(getAmountUsd({ amount: new Amount(usdc, 1_000_000n) })).toEqual({
      data: undefined,
      isLoading: true,
    })
  })

  it('rejects an overflowing USD result even when the unit price is finite', () => {
    mocks.price.data = Number.MAX_VALUE

    expect(getAmountUsd({ amount: new Amount(usdc, 2_000_000n) })).toEqual({
      data: undefined,
      isLoading: false,
    })
  })
})
