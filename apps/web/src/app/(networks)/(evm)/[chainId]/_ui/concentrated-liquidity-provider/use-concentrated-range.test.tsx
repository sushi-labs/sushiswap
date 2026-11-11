import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Bound } from 'src/lib/constants'
import { EvmChainId, EvmToken, sushiSwapV4TickToPrice } from 'sushi/evm'
import { expect, it } from 'vitest'
import type { RangeState } from './state'
import { useConcentratedRange } from './use-concentrated-range'

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
  decimals: 18,
  symbol: 'BBB',
  name: 'Token B',
})
const range: RangeState = {
  pair: `${currency0.id}:${currency1.id}`,
  [Bound.LOWER]: -6000,
  [Bound.UPPER]: 8000,
  independentBound: undefined,
  weightLockedCurrency0: 0.5,
  preset: undefined,
}

function renderRange(tick: number, invertPrice: boolean): string {
  function Probe() {
    const { ticks } = useConcentratedRange({
      currency0,
      currency1,
      price: sushiSwapV4TickToPrice(currency0, currency1, tick),
      invertPrice,
      tickSpacing: 200,
      range,
    })
    return <span>{`${ticks.LOWER}:${ticks.UPPER}`}</span>
  }
  return renderToStaticMarkup(<Probe />)
}

it('keeps the selected ticks when locking their current ratio', () => {
  expect(renderRange(1000, false)).toBe('<span>-6000:8000</span>')
  expect(renderRange(1000, true)).toBe('<span>-6000:8000</span>')
})

it('keeps the same locked range when the display is inverted after a price move', () => {
  expect(renderRange(3000, true)).toBe(renderRange(3000, false))
})
