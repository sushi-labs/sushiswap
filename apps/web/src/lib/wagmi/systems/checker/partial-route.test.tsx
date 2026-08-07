/** @vitest-environment jsdom */

import { type ButtonHTMLAttributes, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sushiswap/ui', () => ({
  Button: ({
    children,
    onClick,
  }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  HoverCard: ({ children }: PropsWithChildren) => children,
  HoverCardContent: ({ children }: PropsWithChildren) => children,
  HoverCardTrigger: ({ children }: PropsWithChildren) => children,
}))

import { PartialRoute, type PartialRouteProps } from './partial-route'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function trade(
  status: 'Success' | 'Partial' | 'NoWay',
  amountIn: string,
): PartialRouteProps['trade'] {
  return {
    status,
    amountIn: { toString: () => amountIn },
  } as PartialRouteProps['trade']
}

describe('PartialRoute', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('continues after the accepted amount has a matching successful quote', () => {
    const setSwapAmount = vi.fn()
    const onAccepted = vi.fn()

    act(() => {
      root.render(
        <PartialRoute
          trade={trade('Partial', '5')}
          setSwapAmount={setSwapAmount}
          onAccepted={onAccepted}
        >
          <button type="button">Swap</button>
        </PartialRoute>,
      )
    })

    act(() => container.querySelector('button')?.click())
    expect(setSwapAmount).toHaveBeenCalledWith('5')
    expect(onAccepted).not.toHaveBeenCalled()

    act(() => {
      root.render(
        <PartialRoute
          trade={trade('Success', '5')}
          setSwapAmount={setSwapAmount}
          onAccepted={onAccepted}
        >
          <button type="button">Swap</button>
        </PartialRoute>,
      )
    })

    expect(onAccepted).toHaveBeenCalledOnce()
  })

  it('waits for caller readiness and rejects a mismatched refreshed quote', () => {
    const setSwapAmount = vi.fn()
    const onAccepted = vi.fn()

    act(() => {
      root.render(
        <PartialRoute
          trade={trade('Partial', '5')}
          setSwapAmount={setSwapAmount}
          onAccepted={onAccepted}
        >
          <button type="button">Swap</button>
        </PartialRoute>,
      )
    })
    act(() => container.querySelector('button')?.click())

    act(() => {
      root.render(
        <PartialRoute
          trade={trade('Success', '5')}
          setSwapAmount={setSwapAmount}
          canContinue={false}
          onAccepted={onAccepted}
        >
          <button type="button">Swap</button>
        </PartialRoute>,
      )
    })
    expect(onAccepted).not.toHaveBeenCalled()

    act(() => {
      root.render(
        <PartialRoute
          trade={trade('Success', '6')}
          setSwapAmount={setSwapAmount}
          onAccepted={onAccepted}
        >
          <button type="button">Swap</button>
        </PartialRoute>,
      )
    })
    expect(onAccepted).not.toHaveBeenCalled()

    act(() => {
      root.render(
        <PartialRoute
          trade={trade('Success', '5')}
          setSwapAmount={setSwapAmount}
          onAccepted={onAccepted}
        >
          <button type="button">Swap</button>
        </PartialRoute>,
      )
    })
    expect(onAccepted).not.toHaveBeenCalled()
  })
})
