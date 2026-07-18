/** @vitest-environment jsdom */

import { type ButtonHTMLAttributes, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sushiswap/ui', () => ({
  Button: ({
    asChild,
    children,
    ...props
  }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
    asChild?: boolean
  }) =>
    asChild ? (
      children
    ) : (
      <button type="button" {...props}>
        {children}
      </button>
    ),
  Dots: ({ children }: PropsWithChildren) => children,
  Loader: () => null,
  classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
}))

vi.mock('@sushiswap/ui/icons/CheckMarkIcon', () => ({
  CheckMarkIcon: () => null,
}))

vi.mock('@sushiswap/ui/icons/FailedMarkIcon', () => ({
  FailedMarkIcon: () => null,
}))

vi.mock('./xswap-provider', () => ({
  useLifiXSwap: () => ({
    state: {
      chainId0: 1,
      chainId1: 42161,
      token0: undefined,
      token1: undefined,
      recipient: undefined,
    },
  }),
  useLifiXSwapSelectedTradeRoute: () => ({ data: undefined }),
}))

import { ConfirmationDialogContent, StepState } from './confirmation-dialog'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const txHash =
  '0x1111111111111111111111111111111111111111111111111111111111111111'

describe('LiFi source transaction failure', () => {
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

  it('links the preserved failed source hash with an accessible label', () => {
    act(() => {
      root.render(
        <ConfirmationDialogContent
          txHash={txHash}
          dialogState={{
            source: StepState.Failed,
            bridge: StepState.NotStarted,
            dest: StepState.NotStarted,
          }}
          route={undefined}
        />,
      )
    })

    const link = container.querySelector<HTMLAnchorElement>('a')
    expect(link?.href).toContain(txHash)
    expect(link?.getAttribute('aria-label')).toBe(
      'View failed source transaction on Ethereum',
    )
  })

  it('does not render an empty explorer link without a source hash', () => {
    act(() => {
      root.render(
        <ConfirmationDialogContent
          dialogState={{
            source: StepState.Failed,
            bridge: StepState.NotStarted,
            dest: StepState.NotStarted,
          }}
          route={undefined}
        />,
      )
    })

    expect(container.querySelector('a')).toBeNull()
    expect(container.textContent).toContain('Your transaction failed')
  })

  it('keeps an observer failure retryable without losing the explorer link', () => {
    const onRetrySourceReceipt = vi.fn()
    act(() => {
      root.render(
        <ConfirmationDialogContent
          txHash={txHash}
          onRetrySourceReceipt={onRetrySourceReceipt}
          dialogState={{
            source: StepState.Unknown,
            bridge: StepState.NotStarted,
            dest: StepState.NotStarted,
          }}
          route={undefined}
        />,
      )
    })

    expect(container.querySelector('a')?.href).toContain(txHash)
    act(() => {
      container.querySelector<HTMLButtonElement>('button')?.click()
    })
    expect(onRetrySourceReceipt).toHaveBeenCalledOnce()
  })
})
