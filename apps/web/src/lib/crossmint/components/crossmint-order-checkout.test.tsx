/** @vitest-environment jsdom */

import {
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  type SVGProps,
  act,
} from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let resizeObserverCallback: ResizeObserverCallback
let animationFrameCallbacks: FrameRequestCallback[]

interface MockButtonProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  fullWidth?: boolean
  loading?: boolean
  size?: string
  variant?: string
}

vi.mock('@crossmint/client-sdk-react-ui', () => ({
  CrossmintCheckoutProvider: ({ children }: PropsWithChildren) => children,
  CrossmintEmbeddedCheckout: ({
    payment,
  }: {
    payment: {
      fiat: {
        allowedMethods: Record<string, boolean>
      }
    }
  }) => {
    const selectedMethod = Object.entries(payment.fiat.allowedMethods).find(
      ([, allowed]) => allowed,
    )?.[0]

    return (
      <iframe
        title="Crossmint checkout"
        id="crossmint-embedded-checkout.iframe"
        data-selected-method={selectedMethod}
        src="https://crossmint.example/checkout"
        style={{ height: 0 }}
      />
    )
  },
  CrossmintProvider: ({ children }: PropsWithChildren) => children,
  useCrossmintCheckout: () => ({}),
}))

vi.mock('@heroicons/react-v1/solid', () => ({
  ChevronDownIcon: (props: SVGProps<SVGSVGElement>) => <svg {...props} />,
}))

vi.mock('@sushiswap/ui', () => ({
  Button: ({
    children,
    fullWidth: _fullWidth,
    loading,
    size: _size,
    variant: _variant,
    ...props
  }: MockButtonProps) => (
    <button data-loading={loading || undefined} {...props}>
      {children}
    </button>
  ),
  Collapsible: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SkeletonText: () => <span data-skeleton />,
  classNames: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}))

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}))

vi.mock('../crossmint-config', () => ({
  CROSSMINT_CLIENT_SIDE_API_KEY: 'ck_staging_example',
}))

import { CrossmintOrderCheckout } from './crossmint-order-checkout'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('CrossmintOrderCheckout', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    animationFrameCallbacks = []
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeObserverCallback = callback
        }

        disconnect(): void {}
        observe(): void {}
        unobserve(): void {}
      },
    )
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        animationFrameCallbacks.push(callback)
        return animationFrameCallbacks.length
      }),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  function getButton(label: string): HTMLButtonElement | undefined {
    return Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === label,
    )
  }

  async function flushAnimationFrame(): Promise<void> {
    const callbacks = animationFrameCallbacks.splice(0)

    await act(async () => {
      callbacks.forEach((callback) => callback(performance.now()))
      await Promise.resolve()
    })
  }

  async function finishCheckoutLoading(): Promise<void> {
    const iframe = container.querySelector('iframe')
    expect(iframe).not.toBeNull()

    await act(async () => {
      if (iframe) {
        resizeObserverCallback(
          [
            {
              borderBoxSize: [],
              contentBoxSize: [],
              contentRect: {
                bottom: 48,
                height: 48,
                left: 0,
                right: 0,
                top: 0,
                width: 0,
                x: 0,
                y: 0,
                toJSON: () => ({}),
              },
              devicePixelContentBoxSize: [],
              target: iframe,
            },
          ],
          {} as ResizeObserver,
        )
      }
      await Promise.resolve()
    })

    expect(getButton('Loading payment options')).toBeDefined()
    await flushAnimationFrame()
    expect(getButton('Loading payment options')).toBeDefined()
    await flushAnimationFrame()
  }

  it('shows the skeleton until each payment-method checkout paints', async () => {
    await act(async () => {
      root.render(
        <CrossmintOrderCheckout
          allowedMethods={{ applePay: true, card: true, googlePay: true }}
          clientSecret="client-secret"
          orderId="order-id"
          paymentCurrency="usd"
          receiptEmail="buyer@example.com"
        />,
      )
    })

    expect(getButton('Loading payment options')).toBeDefined()
    expect(container.querySelector('iframe')?.dataset.selectedMethod).toBe(
      'googlePay',
    )

    await act(async () => {
      container.querySelector('iframe')?.dispatchEvent(new Event('load'))
      await Promise.resolve()
    })
    expect(getButton('Loading payment options')).toBeDefined()

    await finishCheckoutLoading()
    expect(getButton('Loading payment options')).toBeUndefined()

    act(() => getButton('Card')?.click())

    expect(getButton('Loading payment options')).toBeDefined()
    expect(container.querySelector('iframe')?.dataset.selectedMethod).toBe(
      'card',
    )

    await finishCheckoutLoading()
    expect(getButton('Loading payment options')).toBeUndefined()
  })
})
