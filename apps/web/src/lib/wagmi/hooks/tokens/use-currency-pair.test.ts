import { EvmChainId, EvmNative, EvmToken, evmNativeAddress } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { useCurrencyPair } from './use-currency-pair'
import { useCurrencyWithCache } from './use-currency-with-cache'

vi.mock('./use-currency-with-cache', () => ({
  useCurrencyWithCache: vi.fn(),
}))

it.each([
  [false, false, false],
  [true, false, true],
  [false, true, true],
])(
  'preserves currency order and combines loading (%s, %s)',
  (loading0, loading1, isLoading) => {
    const currency0 = EvmNative.fromChainId(EvmChainId.ETHEREUM)
    const currency1 = new EvmToken({
      chainId: EvmChainId.ETHEREUM,
      address: '0x0000000000000000000000000000000000000001',
      decimals: 18,
      symbol: 'AAA',
      name: 'Token A',
    })
    vi.mocked(useCurrencyWithCache)
      .mockReturnValueOnce({ data: currency0, isLoading: loading0 })
      .mockReturnValueOnce({ data: currency1, isLoading: loading1 })
    expect(
      useCurrencyPair({
        chainId: EvmChainId.ETHEREUM,
        address0: evmNativeAddress,
        address1: currency1.address,
      }),
    ).toEqual({ currency0, currency1, isLoading })
    expect(useCurrencyWithCache).toHaveBeenLastCalledWith({
      chainId: EvmChainId.ETHEREUM,
      address: currency1.address,
    })
  },
)

it('passes missing addresses through without substituting a currency', () => {
  vi.mocked(useCurrencyWithCache).mockReturnValue({
    data: undefined,
    isLoading: false,
  })
  expect(
    useCurrencyPair({
      chainId: EvmChainId.ETHEREUM,
      address0: undefined,
      address1: undefined,
    }),
  ).toEqual({ currency0: undefined, currency1: undefined, isLoading: false })
})
