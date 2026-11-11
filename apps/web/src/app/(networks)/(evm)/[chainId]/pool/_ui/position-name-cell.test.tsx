import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { EvmChainId, EvmNative, EvmToken, evmNativeAddress } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { PositionNameCell } from './position-name-cell'

const state = vi.hoisted(() => ({ loading: false }))

const currency0 = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 'AAA',
  name: 'Token A',
})
const currency1 = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000002',
  decimals: 6,
  symbol: 'BBB',
  name: 'Token B',
})

vi.mock('src/lib/wagmi/hooks/tokens/use-currency-with-cache', () => ({
  useCurrencyWithCache: ({ address }: { address: string }) => ({
    data: state.loading
      ? undefined
      : address === evmNativeAddress
        ? EvmNative.fromChainId(EvmChainId.ETHEREUM)
        : address === currency0.address
          ? currency0
          : currency1,
  }),
}))

it.each(['V3', 'V4'] as const)(
  'renders the currency pair and fee for %s',
  (version) => {
    const markup = renderToStaticMarkup(
      <PositionNameCell
        chainId={EvmChainId.ETHEREUM}
        currency0={currency0.address}
        currency1={currency1.address}
        version={version}
        fee={3000}
      />,
    )
    expect(markup).toContain('AAA')
    expect(markup).toContain('BBB')
    expect(markup).toContain(version)
    expect(markup).toContain('0.3%')
  },
)

it('renders native currency and dynamic fees', () => {
  const markup = renderToStaticMarkup(
    <PositionNameCell
      chainId={EvmChainId.ETHEREUM}
      currency0={evmNativeAddress}
      currency1={currency1.address}
      version="V4"
      fee="dynamic"
    />,
  )
  expect(markup).toContain('ETH')
  expect(markup).toContain('BBB')
  expect(markup).toContain('Dynamic')
})

it('waits for currency metadata in either version', () => {
  state.loading = true
  for (const version of ['V3', 'V4'] as const) {
    const markup = renderToStaticMarkup(
      <PositionNameCell
        chainId={EvmChainId.ETHEREUM}
        currency0={currency0.address}
        currency1={currency1.address}
        version={version}
        fee={3000}
      />,
    )
    expect(markup).not.toContain('AAA')
    expect(markup).not.toContain('0.3%')
    expect(markup).not.toContain(version)
  }
  state.loading = false
})
