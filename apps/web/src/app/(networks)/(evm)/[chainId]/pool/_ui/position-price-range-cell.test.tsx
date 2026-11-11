import React, { isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { PositionPriceRangeCell } from './position-price-range-cell'

it.each([
  ['closed', 'bg-slate-700'],
  ['in-range', 'bg-green'],
  ['out-of-range', 'bg-red'],
] as const)('renders a full price range with %s status', (status, color) => {
  const markup = renderToStaticMarkup(
    <PositionPriceRangeCell
      lower="0"
      upper="∞"
      currentPrice="0.010964"
      quoteSymbol="BBB"
      baseSymbol="AAA"
      status={status}
      onInvert={() => {}}
    />,
  )
  expect(markup).toContain(color)
  expect(markup).toContain('∞')
  expect(markup).toContain('0.011')
  expect(markup).toContain('BBB per AAA')
  expect(markup).toContain('aria-label="Invert price range"')
})

it('waits for the current price without hiding the range', () => {
  const markup = renderToStaticMarkup(
    <PositionPriceRangeCell
      lower="1"
      upper="2"
      currentPrice={undefined}
      quoteSymbol="BBB"
      baseSymbol="AAA"
      status="in-range"
      onInvert={() => {}}
    />,
  )
  expect(markup).toContain('Current:')
  expect(markup).toContain('w-12')
  expect(markup).toContain('>1</span>')
  expect(markup).toContain('>2</span>')
})

it('inverts through a button without navigating to the position', () => {
  const onInvert = vi.fn()
  const button = PositionPriceRangeCell({
    lower: '1',
    upper: '2',
    currentPrice: '1.5',
    quoteSymbol: 'BBB',
    baseSymbol: 'AAA',
    status: 'in-range',
    onInvert,
  })
  const clickEvent = { preventDefault: vi.fn(), stopPropagation: vi.fn() }
  if (
    !isValidElement<{
      onClick: (event: typeof clickEvent) => void
      onKeyDown: (event: typeof clickEvent) => void
    }>(button)
  )
    throw new Error('Missing price range button')
  button.props.onClick(clickEvent)
  expect(onInvert).toHaveBeenCalledOnce()
  expect(clickEvent.preventDefault).toHaveBeenCalledOnce()
  expect(clickEvent.stopPropagation).toHaveBeenCalledOnce()
  button.props.onKeyDown(clickEvent)
  expect(clickEvent.stopPropagation).toHaveBeenCalledTimes(2)
  expect(onInvert).toHaveBeenCalledOnce()
})
