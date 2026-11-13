/** @vitest-environment jsdom */

import type { PropsWithChildren, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { FeesBreakdown } from 'src/lib/swap/cross-chain'
import { Amount, Percent } from 'sushi'
import { EvmChainId, EvmNative } from 'sushi/evm'
import { describe, expect, it, vi } from 'vitest'
import { TradeDetails } from './trade-details'

vi.mock('@sushiswap/ui', () => ({
  Currency: { Icon: () => null },
  Explainer: ({ children }: PropsWithChildren) => <span>{children}</span>,
  List: Object.assign(
    ({ children }: PropsWithChildren) => <div>{children}</div>,
    {
      Control: ({ children }: PropsWithChildren) => <div>{children}</div>,
      KeyValue: ({
        title,
        children,
      }: PropsWithChildren<{ title: ReactNode }>) => (
        <div>
          {title}: {children}
        </div>
      ),
    },
  ),
  SkeletonText: () => <span>Loading</span>,
  classNames: (...values: string[]) => values.join(' '),
}))
vi.mock('../route-view', () => ({ CrossChainSwapRouteView: () => null }))
vi.mock('src/lib/hooks/use-amount-usd', () => ({
  useAmountUsd: () => ({ data: undefined, isLoading: false }),
}))
vi.mock('../xswap-provider', () => ({
  useLifiXSwap: () => ({
    state: { chainId0: EvmChainId.ETHEREUM, chainId1: EvmChainId.BASE },
  }),
}))

describe('LiFi review fees', () => {
  it.each(['protocol-only', 'destination-only'] as const)(
    'renders %s fees when the source gas entry is absent',
    (kind) => {
      const feesBreakdown: FeesBreakdown = {
        gas: new Map(),
        protocol: new Map(),
        ui: new Map(),
      }
      const feeChainId =
        kind === 'protocol-only' ? EvmChainId.ETHEREUM : EvmChainId.BASE
      const fees =
        kind === 'protocol-only' ? feesBreakdown.protocol : feesBreakdown.gas
      fees.set(feeChainId, {
        amount: Amount.fromHuman(EvmNative.fromChainId(feeChainId), '0.001'),
        amountUSD: 2,
      })

      const html = renderToStaticMarkup(
        <TradeDetails
          feesBreakdown={feesBreakdown}
          totalFeesUSD={2}
          isPriceLoading={false}
          slippagePercent={new Percent({ numerator: 50, denominator: 10_000 })}
        />,
      )

      const container = document.createElement('div')
      container.innerHTML = html
      expect(container.textContent).toContain(
        kind === 'protocol-only' ? 'Protocol fee' : 'Network fee',
      )
      expect(container.textContent).toContain('0.001 ETH$2.00')
      expect(container.textContent).toContain('Total fee: $2.00')
      expect(container.textContent).not.toContain('Total fee: 0.00 ETH')
    },
  )

  it('renders zero USD fees as zero instead of leaving the total loading', () => {
    const feesBreakdown: FeesBreakdown = {
      gas: new Map([
        [
          EvmChainId.ETHEREUM,
          {
            amount: Amount.fromHuman(
              EvmNative.fromChainId(EvmChainId.ETHEREUM),
              '0',
            ),
            amountUSD: 0,
          },
        ],
      ]),
      protocol: new Map(),
      ui: new Map(),
    }
    const html = renderToStaticMarkup(
      <TradeDetails
        feesBreakdown={feesBreakdown}
        totalFeesUSD={0}
        isPriceLoading={false}
        slippagePercent={new Percent({ numerator: 50, denominator: 10_000 })}
      />,
    )
    const container = document.createElement('div')
    container.innerHTML = html

    expect(container.textContent).toContain('0.00 ETH$0.00')
    expect(container.textContent).toContain('Total fee: $0.00')
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1])(
    'does not render an invalid total USD value: %s',
    (totalFeesUSD) => {
      const html = renderToStaticMarkup(
        <TradeDetails
          feesBreakdown={{ gas: new Map(), protocol: new Map(), ui: new Map() }}
          totalFeesUSD={totalFeesUSD}
          isPriceLoading={false}
          slippagePercent={new Percent({ numerator: 50, denominator: 10_000 })}
        />,
      )
      const container = document.createElement('div')
      container.innerHTML = html

      expect(container.textContent).toContain('Total fee: -')
      expect(container.textContent).not.toContain('Total fee: $')
    },
  )
})
