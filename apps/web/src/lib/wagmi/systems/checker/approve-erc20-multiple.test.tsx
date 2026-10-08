/** @vitest-environment jsdom */

import { type ComponentProps, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import { type EvmToken, USDC, USDT } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApproveERC20Multiple } from './approve-erc20-multiple'

const { allowance, useAllowance, useRevoke, revoke, approve } = vi.hoisted(
  () => ({
    allowance: { amount: 1n },
    useAllowance: vi.fn(),
    useRevoke: vi.fn(),
    revoke: vi.fn(),
    approve: vi.fn(),
  }),
)

vi.mock('../../hooks/approvals/hooks/use-token-allowance', () => ({
  useTokenAllowance: (params: { token: EvmToken }) => {
    useAllowance(params)
    return {
      data: new Amount(params.token, allowance.amount),
      isLoading: false,
    }
  },
}))
vi.mock('../../hooks/approvals/hooks/use-token-revoke-approval', () => ({
  useTokenRevokeApproval: (params: unknown) => {
    useRevoke(params)
    return { write: revoke, isSuccess: false, isPending: false }
  },
}))
vi.mock('../../hooks/approvals/hooks/use-token-approval', () => ({
  ApprovalState: {
    APPROVED: 'APPROVED',
    NOT_APPROVED: 'NOT_APPROVED',
    UNKNOWN: 'UNKNOWN',
    LOADING: 'LOADING',
    PENDING: 'PENDING',
  },
  useTokenApproval: ({ amount }: { amount: Amount<EvmToken> }) => [
    allowance.amount >= amount.amount ? 'APPROVED' : 'NOT_APPROVED',
    { write: approve },
  ],
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: '0x0000000000000000000000000000000000000001',
  }),
}))
vi.mock('@sushiswap/ui', () => {
  function Block({ children }: PropsWithChildren) {
    return <div>{children}</div>
  }
  function Button({
    children,
    fullWidth: _fullWidth,
    size: _size,
    loading: _loading,
    testId,
    asChild,
    variant: _variant,
    ...props
  }: ComponentProps<'button'> & {
    fullWidth?: boolean
    size?: string
    loading?: boolean
    testId?: string
    asChild?: boolean
    variant?: string
  }) {
    if (asChild) return children
    return (
      <button type="button" data-testid={testId} {...props}>
        {children}
      </button>
    )
  }
  return {
    Button,
    CardDescription: Block,
    CardHeader: Block,
    CardTitle: Block,
    HoverCard: Block,
    HoverCardContent: Block,
    HoverCardTrigger: Block,
    LinkExternal: Block,
    Select: Block,
    SelectContent: Block,
    SelectItem: Block,
    SelectPrimitive: { Trigger: Block },
    classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('ERC20 approval reset requirements', () => {
  let root: Root
  let container: HTMLDivElement

  function render(requiresReset?: boolean, token = USDC[42161]): void {
    act(() => {
      root.render(
        <ApproveERC20Multiple
          id="approval"
          amounts={[
            {
              amount: new Amount(token, 10n),
              contract: '0x0000000000000000000000000000000000000002',
              requiresReset,
            },
          ]}
        >
          <span>Ready to swap</span>
        </ApproveERC20Multiple>,
      )
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    allowance.amount = 1n
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('resets an API-required allowance outside the known token list before approving', () => {
    render(true)
    expect(useAllowance).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true }),
    )
    expect(useRevoke).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true }),
    )
    const reset = container.querySelector<HTMLButtonElement>(
      '[data-testid="revoke-approval-0"]',
    )
    expect(reset).not.toBeNull()
    expect(reset?.hasAttribute('requiresreset')).toBe(false)
    act(() => reset?.click())
    expect(revoke).toHaveBeenCalledOnce()
    expect(approve).not.toHaveBeenCalled()
    allowance.amount = 0n
    render(true)
    expect(container.querySelector('[data-testid="approval-0"]')).not.toBeNull()
    expect(container.querySelector('[requiresreset]')).toBeNull()
  })

  it.each([10n, 11n])(
    'does not revoke a sufficient allowance of %s',
    (amount) => {
      allowance.amount = amount
      render(true)
      expect(useRevoke).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: false }),
      )
      expect(container.textContent).toBe('Ready to swap')
    },
  )

  it('preserves ordinary approval when no reset requirement is supplied', () => {
    render()
    expect(useAllowance).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: false }),
    )
    expect(container.querySelector('[data-testid="approval-0"]')).not.toBeNull()
  })

  it('preserves the existing known-token reset behavior', () => {
    render(undefined, USDT[1])
    expect(useRevoke).toHaveBeenLastCalledWith(
      expect.objectContaining({ enabled: true }),
    )
    expect(
      container.querySelector('[data-testid="revoke-approval-0"]'),
    ).not.toBeNull()
  })
})
