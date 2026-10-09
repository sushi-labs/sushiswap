/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { SvmChainId } from 'sushi/svm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sushiswap/ui', () => ({
  Button: ({ children }: PropsWithChildren) => children,
  Dots: ({ children }: PropsWithChildren) => children,
  Loader: () => null,
  classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
}))

vi.mock('@sushiswap/ui/icons/check-mark-icon', () => ({
  CheckMarkIcon: () => null,
}))

vi.mock('@sushiswap/ui/icons/failed-mark-icon', () => ({
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

import {
  ConfirmationDialogContent,
  CrossChainSwapConfirmationContent,
  StepState,
} from './confirmation-dialog'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const txHash =
  '0x1111111111111111111111111111111111111111111111111111111111111111'

const routeRef = { current: null }

describe('LiFi confirmation', () => {
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
          routeRef={routeRef}
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
          routeRef={routeRef}
        />,
      )
    })

    expect(container.querySelector('a')).toBeNull()
    expect(container.textContent).toContain('Your transaction failed')
  })

  it.each([
    { chainId: 1 as const, hash: txHash, explorer: 'https://etherscan.io' },
    {
      chainId: SvmChainId.SOLANA,
      hash: '5'.repeat(88) as TxHashFor<typeof SvmChainId.SOLANA>,
      explorer: 'https://solscan.io',
    },
  ])(
    'links the source transaction on $explorer while bridge tracking loads',
    ({ chainId, hash, explorer }) => {
      act(() => {
        root.render(
          <CrossChainSwapConfirmationContent
            chainId0={chainId}
            chainId1={42161}
            txHash={hash}
            dialogState={{
              source: StepState.Success,
              bridge: StepState.Pending,
              dest: StepState.NotStarted,
            }}
          />,
        )
      })

      const link = container.querySelector<HTMLAnchorElement>('a')
      expect(link?.href).toBe(`${explorer}/tx/${hash}`)
      expect(container.textContent).toContain(
        'Bridging to the destination chain',
      )
    },
  )

  it('switches to the bridge tracker when its URL becomes available', () => {
    const dialogState = {
      source: StepState.Success,
      bridge: StepState.Pending,
      dest: StepState.NotStarted,
    }

    act(() => {
      root.render(
        <ConfirmationDialogContent
          txHash={txHash}
          dialogState={dialogState}
          routeRef={routeRef}
        />,
      )
    })

    expect(container.querySelector<HTMLAnchorElement>('a')?.href).toBe(
      `https://etherscan.io/tx/${txHash}`,
    )

    const bridgeUrl = `https://scan.li.fi/tx/${txHash}`
    act(() => {
      root.render(
        <ConfirmationDialogContent
          txHash={txHash}
          bridgeUrl={bridgeUrl}
          dialogState={dialogState}
          routeRef={routeRef}
        />,
      )
    })

    expect(container.querySelector<HTMLAnchorElement>('a')?.href).toBe(
      bridgeUrl,
    )
  })

  it('shows plain pending bridge text when no explorer URL is available', () => {
    act(() => {
      root.render(
        <ConfirmationDialogContent
          dialogState={{
            source: StepState.Success,
            bridge: StepState.Pending,
            dest: StepState.NotStarted,
          }}
          routeRef={routeRef}
        />,
      )
    })

    expect(container.querySelector('a')).toBeNull()
    expect(container.textContent).toContain('Bridging to the destination chain')
  })
})
