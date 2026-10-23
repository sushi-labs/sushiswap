/** @vitest-environment jsdom */

import { type ComponentProps, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubAccountTransferDialog } from './sub-account-transfer-dialog'

const mocks = vi.hoisted(() => ({
  sourceQuery: vi.fn(),
  refetch: vi.fn(),
  sendAssetAsync: vi.fn(),
  invalidateQueries: vi.fn(),
}))

vi.mock('@sushiswap/ui', () => {
  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }
  return {
    Button: ({
      children,
      disabled,
      onClick,
      type,
    }: ComponentProps<'button'>) => (
      <button type={type ?? 'button'} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
    IconButton: ({ name, onClick, disabled }: ComponentProps<'button'>) => (
      <button
        type="button"
        aria-label={name}
        onClick={onClick}
        disabled={disabled}
      >
        {name}
      </button>
    ),
    PerpsDialog: ({
      children,
      open,
      onOpenChange,
    }: PropsWithChildren<{
      open: boolean
      onOpenChange: (open: boolean) => void
    }>) => (
      <div>
        <button type="button" onClick={() => onOpenChange(true)}>
          Open transfer
        </button>
        {open && children}
      </div>
    ),
    PerpsDialogTrigger: () => null,
    PerpsDialogContent: Wrapper,
    PerpsDialogDescription: Wrapper,
    PerpsDialogHeader: Wrapper,
    PerpsDialogInnerContent: Wrapper,
    PerpsDialogTitle: Wrapper,
    Select: ({
      children,
      value,
      disabled,
      onValueChange,
    }: PropsWithChildren<{
      value: string
      disabled: boolean
      onValueChange: (value: string) => void
    }>) => (
      <select
        aria-label="Spot asset"
        value={value}
        disabled={disabled}
        onChange={(event) => onValueChange(event.target.value)}
      >
        {children}
      </select>
    ),
    SelectContent: Wrapper,
    SelectTrigger: () => null,
    SelectItem: ({ children, value }: PropsWithChildren<{ value: string }>) => (
      <option value={value}>{children}</option>
    ),
    TextField: ({
      id,
      value,
      disabled,
      onValueChange,
    }: {
      id: string
      value: string
      disabled: boolean
      onValueChange: (value: string) => void
    }) => (
      <input
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onValueChange(event.target.value)}
      />
    ),
  }
})
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
}))
vi.mock('src/lib/wallet', () => ({ useAccount: () => masterAddress }))
vi.mock('src/lib/perps/exchange/use-send-asset', () => ({
  useSendAsset: () => ({
    sendAssetAsync: mocks.sendAssetAsync,
    isPending: false,
  }),
}))
vi.mock('src/lib/perps/info/use-spot-meta', () => ({
  useSpotMeta: () => ({ data: meta, isLoading: false, isError: false }),
}))
vi.mock('src/lib/perps/info/use-spot-clearinghouse-state', () => ({
  useSpotClearinghouseState: ({ address }: { address?: string }) => {
    mocks.sourceQuery(address)
    return {
      data: address
        ? getState(address === masterAddress ? '10.25' : '5.00000001')
        : undefined,
      isLoading: false,
      isError: false,
      refetch: mocks.refetch,
    }
  },
}))
vi.mock('src/lib/wagmi/systems/checker', () => ({
  Checker: { Connect: ({ children }: PropsWithChildren) => <>{children}</> },
}))
vi.mock('~evm/perps/_ui/perps-checker', () => ({
  PerpsChecker: { Legal: ({ children }: PropsWithChildren) => <>{children}</> },
}))

const masterAddress = '0x1111111111111111111111111111111111111111'
const subAccountAddress = '0x2222222222222222222222222222222222222222'
const token = 'TOKEN:0x00000000000000000000000000000001'
const meta = {
  universe: [],
  tokens: [
    {
      name: 'TOKEN',
      tokenId: '0x00000000000000000000000000000001',
      index: 7,
      weiDecimals: 8,
    },
  ],
}

function getState(total: string) {
  return {
    balances: [{ coin: 'TOKEN', token: 7, total, hold: '0', entryNtl: '0' }],
  }
}

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('SubAccountTransferDialog', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.refetch.mockResolvedValue({ data: getState('10.25'), isError: false })
    mocks.sendAssetAsync.mockResolvedValue({ status: 'ok' })
    mocks.invalidateQueries.mockResolvedValue(undefined)
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() =>
      root.render(
        <SubAccountTransferDialog
          masterAddress={masterAddress}
          subAccount={{
            subAccountUser: subAccountAddress,
            name: 'Trading Sub',
          }}
        />,
      ),
    )
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function clickButton(text: string): void {
    const button = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === text,
    )
    expect(button).toBeDefined()
    act(() => button?.click())
  }

  async function submit(): Promise<void> {
    await act(async () => {
      container
        .querySelector('form')
        ?.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true }),
        )
    })
  }

  it('reverses source balances and rechecks them before signing a sub-to-master transfer', async () => {
    clickButton('Open transfer')
    expect(mocks.sourceQuery).toHaveBeenLastCalledWith(masterAddress)
    expect(container.textContent).toContain('Available: 10.25 TOKEN')
    clickButton('Reverse transfer direction')
    expect(mocks.sourceQuery).toHaveBeenLastCalledWith(subAccountAddress)
    expect(container.textContent).toContain('Available: 5.00000001 TOKEN')
    clickButton('Max')
    mocks.refetch.mockResolvedValue({
      data: getState('5.00000001'),
      isError: false,
    })

    await submit()

    expect(mocks.refetch.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.sendAssetAsync.mock.invocationCallOrder[0],
    )
    expect(mocks.sendAssetAsync).toHaveBeenCalledWith({
      destination: masterAddress,
      sourceDex: 'spot',
      destinationDex: 'spot',
      fromSubAccount: subAccountAddress,
      token,
      decimals: 8,
      amount: '5.00000001',
      expectedWalletAddress: masterAddress,
    })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useSubAccounts', masterAddress],
    })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useSpotClearinghouseState', masterAddress],
    })
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['useSpotClearinghouseState', subAccountAddress],
    })
    expect(container.querySelector('form')).toBeNull()
  })

  it('refuses to sign when the latest available balance no longer covers the amount', async () => {
    clickButton('Open transfer')
    clickButton('Max')
    mocks.refetch.mockResolvedValue({ data: getState('1'), isError: false })

    await submit()

    expect(mocks.sendAssetAsync).not.toHaveBeenCalled()
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'Insufficient available balance.',
    )
    expect(container.querySelector('input')?.value).toBe('10.25')
  })

  it('refuses to sign if refreshing the source balance fails', async () => {
    clickButton('Open transfer')
    clickButton('Max')
    mocks.refetch.mockResolvedValue({ data: undefined, isError: true })

    await submit()

    expect(mocks.sendAssetAsync).not.toHaveBeenCalled()
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to refresh',
    )
  })

  it('keeps the form and amount available after a rejected signature', async () => {
    clickButton('Open transfer')
    clickButton('Max')
    mocks.sendAssetAsync.mockRejectedValue(
      new Error('User rejected the request.'),
    )

    await submit()

    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'User rejected the request.',
    )
    expect(container.querySelector('input')?.value).toBe('10.25')
    expect(container.querySelector('fieldset')?.disabled).toBe(false)
    expect(mocks.invalidateQueries).not.toHaveBeenCalled()
  })
})
