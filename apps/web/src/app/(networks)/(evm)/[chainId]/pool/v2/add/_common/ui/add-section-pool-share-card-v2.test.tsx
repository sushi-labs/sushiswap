/** @vitest-environment jsdom */

import type { ComponentProps } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/use-sushi-swap-v2-pools'
import { Amount } from 'sushi'
import { EvmChainId, EvmNative, SushiSwapV2Pool, USDC } from 'sushi/evm'
import { expect, it } from 'vitest'
import { AddSectionPoolShareCardV2 } from './add-section-pool-share-card-v2'

const eth = EvmNative.fromChainId(EvmChainId.ETHEREUM)
const usdc = USDC[EvmChainId.ETHEREUM]

function renderRates(
  props: ComponentProps<typeof AddSectionPoolShareCardV2>,
): Record<string, string> {
  const container = document.createElement('div')
  container.innerHTML = renderToStaticMarkup(
    <AddSectionPoolShareCardV2 {...props} />,
  )
  const rates: Record<string, string> = {}
  for (const label of container.querySelectorAll('span + span')) {
    const name = label.textContent
    if (name?.includes(' per '))
      rates[name] = label.previousElementSibling?.textContent ?? ''
  }
  return rates
}

it.each([
  ['new', null],
  [
    'empty',
    new SushiSwapV2Pool(new Amount(usdc, 0n), new Amount(eth.wrap(), 0n)),
  ],
] as const)(
  'shows the opening deposit ratio and its inverse for a %s pool',
  (_, pool) => {
    const rates = renderRates({
      pool,
      poolState: pool
        ? SushiSwapV2PoolState.EXISTS
        : SushiSwapV2PoolState.NOT_EXISTS,
      input0: Amount.fromHuman(eth, '4'),
      input1: Amount.fromHuman(usdc, '6'),
    })

    expect(rates).toEqual({ 'USDC per ETH': '1.5', 'ETH per USDC': '0.666667' })
  },
)

it('uses the pool rates when the reversed input pair has a rounded quote', () => {
  const weth = eth.wrap()
  const pool = new SushiSwapV2Pool(
    Amount.fromHuman(usdc, '2500'),
    Amount.fromHuman(weth, '1'),
  )
  const input0 = Amount.fromHuman(eth, '0.0000000007')
  const input1 = pool.priceOf(weth).getQuote(input0.wrap())
  expect(input1.amount).toBe(1n)

  const rates = renderRates({
    pool,
    poolState: SushiSwapV2PoolState.EXISTS,
    input0,
    input1,
  })

  expect(rates).toEqual({ 'USDC per ETH': '2500', 'ETH per USDC': '0.0004' })
})

it('omits rates when only one reserve is funded', () => {
  const rates = renderRates({
    pool: new SushiSwapV2Pool(
      new Amount(usdc, 0n),
      Amount.fromHuman(eth.wrap(), '1'),
    ),
    poolState: SushiSwapV2PoolState.EXISTS,
    input0: Amount.fromHuman(eth, '1'),
    input1: Amount.fromHuman(usdc, '2500'),
  })
  for (const value of Object.values(rates)) expect(value).toBe('-')
})

it.each([undefined, new Amount(usdc, 0n)])(
  'omits rates for an incomplete opening deposit',
  (input1) => {
    const rates = renderRates({
      pool: null,
      poolState: SushiSwapV2PoolState.NOT_EXISTS,
      input0: Amount.fromHuman(eth, '1'),
      input1,
    })

    for (const value of Object.values(rates)) expect(value).toBe('-')
  },
)
