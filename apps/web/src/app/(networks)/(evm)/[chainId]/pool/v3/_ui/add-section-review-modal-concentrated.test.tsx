/** @vitest-environment jsdom */

import { type ReactNode, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { WalletNamespace } from 'src/lib/wallet/types'
import { Percent } from 'sushi'
import { EvmChainId, WETH9 } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { AddSectionReviewModalConcentrated } from './add-section-review-modal-concentrated'

const mocks = vi.hoisted(() => ({
  connected: true,
  otherWallet: false,
  send: vi.fn(),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: mocks.connected
      ? '0x0000000000000000000000000000000000000001'
      : undefined,
    chain: mocks.connected ? { id: 1 } : undefined,
  }),
  useCall: () => ({ isError: false }),
  usePublicClient: () => ({}),
  useSendTransaction: () => ({ mutateAsync: mocks.send, isPending: false }),
  useWaitForTransactionReceipt: () => ({ status: 'pending' }),
}))
vi.mock('src/lib/wallet', () => ({
  useWalletConnection: (namespace?: WalletNamespace) => ({
    isConnected: mocks.connected || (!namespace && mocks.otherWallet),
    isPending: false,
    isRestoring: false,
  }),
}))
vi.mock('src/lib/wagmi/components/connect-button', () => ({
  ConnectButton: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
}))
vi.mock('src/lib/wagmi/systems/checker', async () => {
  const { Connect } = await import('src/lib/wagmi/systems/checker/connect')
  return { Checker: { Connect } }
})
vi.mock('src/lib/hooks/use-slippage-tolerance', () => ({
  useSlippageTolerance: () => [
    new Percent({ numerator: 50, denominator: 10000 }),
  ],
}))
vi.mock('src/lib/hooks/use-token-amount-dollar-values', () => ({
  useTokenAmountDollarValues: () => [0, 0],
}))
vi.mock('src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline', () => ({
  useTransactionDeadline: () => ({ data: 1n }),
  getDefaultTTL: () => 30n,
}))
vi.mock('~evm/_common/ui/balance-provider/use-refetch-balances', () => ({
  useRefetchBalances: () => ({ refetchChain: vi.fn() }),
}))
vi.mock('src/lib/transaction-dialog', () => ({
  DialogProvider: ({ children }: { children: ReactNode }) => children,
  DialogReview: ({
    children,
  }: { children(props: { confirm(): void }): ReactNode }) =>
    children({ confirm: vi.fn() }),
  DialogConfirm: () => null,
}))
vi.mock('@sushiswap/ui', async (importOriginal) => {
  const original = await importOriginal<typeof import('@sushiswap/ui')>()
  function Container({ children }: { children: ReactNode }): ReactNode {
    return <div>{children}</div>
  }
  return {
    ...original,
    DialogContent: Container,
    DialogHeader: Container,
    DialogFooter: Container,
    DialogTitle: Container,
    DialogDescription: Container,
    SettingsOverlay: Container,
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root
let container: HTMLDivElement
async function render(): Promise<void> {
  await act(async () => {
    root.render(
      <AddSectionReviewModalConcentrated
        chainId={EvmChainId.ETHEREUM}
        feeAmount={500}
        token0={WETH9[EvmChainId.ETHEREUM]}
        token1={undefined}
        input0={undefined}
        input1={undefined}
        existingPosition={undefined}
        position={undefined}
        price={undefined}
        pricesAtTicks={{}}
        ticksAtLimit={{}}
        noLiquidity
        tokenId={undefined}
        onSuccess={vi.fn()}
      >
        Preview
      </AddSectionReviewModalConcentrated>,
    )
  })
}
beforeEach(() => {
  mocks.connected = true
  mocks.otherWallet = false
  mocks.send.mockReset()
  container = document.createElement('div')
  root = createRoot(container)
})
afterEach(() => act(() => root.unmount()))

it.each([false, true])(
  'requires an EVM wallet after disconnecting during review, other wallet=%s',
  async (otherWallet) => {
    await render()
    expect(container.textContent).toContain('Add Liquidity')
    mocks.connected = false
    mocks.otherWallet = otherWallet
    await render()
    expect(container.textContent).toContain('Connect EVM Wallet')
    expect(
      container.querySelector('[testdata-id="confirm-add-liquidity-button"]'),
    ).toBeNull()
    expect(mocks.send).not.toHaveBeenCalled()
  },
)
