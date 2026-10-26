/** @vitest-environment jsdom */

import type {
  AllPerpMetasResponse,
  SpotClearinghouseStateResponse,
  SpotMetaResponse,
  UserAbstractionResponse,
} from '@nktkas/hyperliquid'
import {
  type ComponentProps,
  type PropsWithChildren,
  act,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
} from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { EvmAddress } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubAccountTransferDialog } from './sub-account-transfer-dialog'

const mocks = vi.hoisted(() => ({
  useSpotClearinghouseState: vi.fn(),
  useClearinghouseState: vi.fn(),
  useAllDexClearinghouseState: vi.fn(),
  useUserAbstraction: vi.fn(),
  refetchPerps: vi.fn(),
  refetchAbstraction: vi.fn(),
  sendAssetAsync: vi.fn(),
  invalidateQueries: vi.fn(),
}))

vi.mock('src/lib/wallet', () => ({ useAccount: () => masterAddress }))
vi.mock('src/lib/perps/exchange/use-send-asset', () => ({
  useSendAsset: () => ({
    sendAssetAsync: mocks.sendAssetAsync,
    isPending: false,
  }),
}))
vi.mock('src/lib/perps/info/use-spot-clearinghouse-state', () => ({
  useSpotClearinghouseState: mocks.useSpotClearinghouseState,
}))
vi.mock('src/lib/perps/info/use-clearinghouse-state', () => ({
  useClearinghouseState: mocks.useClearinghouseState,
}))
vi.mock('src/lib/perps/subscription/use-all-dex-clearinghouse-state', () => ({
  useAllDexClearinghouseState: mocks.useAllDexClearinghouseState,
}))
vi.mock('src/lib/perps/info/use-all-perp-metas', () => ({
  useAllPerpMetas: () => ({
    data: perpMetas,
    isLoading: false,
    isError: false,
  }),
}))
vi.mock('src/lib/perps/info/use-user-abstraction', () => ({
  useUserAbstraction: mocks.useUserAbstraction,
}))
vi.mock('src/lib/perps/info/use-spot-meta', () => ({
  useSpotMeta: () => ({
    data: spotMeta,
    isLoading: false,
    isError: false,
  }),
}))
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
}))
vi.mock('src/lib/wagmi/systems/checker', () => ({
  Checker: { Connect: ({ children }: PropsWithChildren) => <>{children}</> },
}))
vi.mock('~evm/perps/_ui/perps-checker', () => ({
  PerpsChecker: { Legal: ({ children }: PropsWithChildren) => <>{children}</> },
}))
vi.mock('@sushiswap/ui', () => {
  const DialogContext = createContext({
    open: false,
    onOpenChange: (_open: boolean): void => {},
  })
  const SelectContext = createContext({
    value: '',
    disabled: false,
    onValueChange: (_value: string): void => {},
  })

  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }

  return {
    Button: ({
      children,
      type,
      disabled,
      onClick,
    }: ComponentProps<'button'>) => (
      <button type={type} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    ),
    IconButton: ({ name, disabled, onClick }: ComponentProps<'button'>) => (
      <button
        type="button"
        aria-label={name}
        disabled={disabled}
        onClick={onClick}
      />
    ),
    PerpsDialog: ({
      children,
      open,
      onOpenChange,
    }: PropsWithChildren<{
      open: boolean
      onOpenChange: (open: boolean) => void
    }>) => (
      <DialogContext.Provider value={{ open, onOpenChange }}>
        {children}
      </DialogContext.Provider>
    ),
    PerpsDialogTrigger: ({ children }: PropsWithChildren) => {
      const { onOpenChange } = useContext(DialogContext)
      return isValidElement<{ onClick: () => void }>(children)
        ? cloneElement(children, { onClick: () => onOpenChange(true) })
        : null
    },
    PerpsDialogContent: ({ children }: PropsWithChildren) => {
      const { open } = useContext(DialogContext)
      return open ? <div role="dialog">{children}</div> : null
    },
    PerpsDialogHeader: Wrapper,
    PerpsDialogDescription: Wrapper,
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
      <SelectContext.Provider value={{ value, disabled, onValueChange }}>
        {children}
      </SelectContext.Provider>
    ),
    SelectTrigger: ({
      children,
      'aria-label': label,
    }: ComponentProps<'button'>) => <span aria-label={label}>{children}</span>,
    SelectContent: Wrapper,
    SelectItem: ({ children, value }: PropsWithChildren<{ value: string }>) => {
      const select = useContext(SelectContext)
      return (
        <button
          type="button"
          role="option"
          aria-selected={value === select.value}
          disabled={select.disabled}
          onClick={() => select.onValueChange(value)}
        >
          {children}
        </button>
      )
    },
    TextField: ({
      onValueChange,
      variant: _variant,
      maxDecimals: _maxDecimals,
      ...props
    }: ComponentProps<'input'> & {
      onValueChange: (value: string) => void
      variant: string
      maxDecimals: number
    }) => (
      <input
        {...props}
        onChange={(event) => onValueChange(event.target.value)}
      />
    ),
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const masterAddress = '0x0000000000000000000000000000000000000001'
const subAccountAddress = '0x0000000000000000000000000000000000000005'
const usdcTokenId = '0x00000000000000000000000000000001'
const usdtTokenId = '0x00000000000000000000000000000002'
const spotMeta: SpotMetaResponse = {
  universe: [],
  tokens: [
    {
      name: 'USDC',
      index: 0,
      szDecimals: 2,
      weiDecimals: 6,
      tokenId: usdcTokenId,
      isCanonical: true,
      evmContract: null,
      fullName: 'USD Coin',
      deployerTradingFeeShare: '0',
    },
    {
      name: 'USDT0',
      index: 268,
      szDecimals: 2,
      weiDecimals: 8,
      tokenId: usdtTokenId,
      isCanonical: true,
      evmContract: null,
      fullName: 'Tether',
      deployerTradingFeeShare: '0',
    },
  ],
}
const perpMetas: AllPerpMetasResponse = [
  { universe: [], collateralToken: 0, marginTables: [] },
  {
    universe: [
      { name: 'xyz:GOLD', szDecimals: 3, maxLeverage: 20, marginTableId: 1 },
    ],
    collateralToken: 0,
    marginTables: [],
  },
  {
    universe: [
      { name: 'cash:USA500', szDecimals: 3, maxLeverage: 20, marginTableId: 1 },
    ],
    collateralToken: 268,
    marginTables: [],
  },
  {
    universe: [
      { name: 'abc:BTC', szDecimals: 3, maxLeverage: 20, marginTableId: 1 },
    ],
    collateralToken: 0,
    marginTables: [],
  },
]

type TestAccount = {
  spotBalance: string
  withdrawable: string
  dexBalances?: Record<string, string>
  abstraction: UserAbstractionResponse
}

function spotState(account: TestAccount): SpotClearinghouseStateResponse {
  return {
    balances: [
      {
        coin: 'USDC',
        token: 0,
        total: account.spotBalance,
        hold: '0',
        entryNtl: '0',
      },
    ],
    tokenToAvailableAfterMaintenance: [],
  }
}

describe('SubAccountTransferDialog', () => {
  let container: HTMLDivElement
  let root: Root
  let accounts: Map<EvmAddress, TestAccount>

  function account(address?: EvmAddress): TestAccount | undefined {
    return address ? accounts.get(address) : undefined
  }

  function button(label: string): HTMLButtonElement {
    const found = Array.from(container.querySelectorAll('button')).find(
      (element) =>
        element.textContent === label ||
        element.getAttribute('aria-label') === label,
    )
    if (!found) throw new Error(`Button not found: ${label}`)
    return found
  }

  function openFromSubAccount(): void {
    act(() => button('Transfer').click())
    act(() => button('Reverse transfer direction').click())
  }

  function setAmount(amount: string): void {
    const input = container.querySelector('input')
    if (!input) throw new Error('Amount input not found')
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set
    act(() => {
      setter?.call(input, amount)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  beforeEach(() => {
    vi.resetAllMocks()
    accounts = new Map([
      [
        masterAddress,
        { spotBalance: '20', withdrawable: '50', abstraction: 'disabled' },
      ],
      [
        subAccountAddress,
        {
          spotBalance: '0',
          withdrawable: '123.456789',
          abstraction: 'disabled',
        },
      ],
    ])
    mocks.useSpotClearinghouseState.mockImplementation(
      ({ address }: { address?: EvmAddress }) => {
        const source = account(address)
        return {
          data: source ? spotState(source) : undefined,
          isLoading: false,
          isError: false,
          refetch: async () => ({
            data: source ? spotState(source) : undefined,
            isError: false,
          }),
        }
      },
    )
    mocks.useAllDexClearinghouseState.mockImplementation(
      ({ address }: { address?: EvmAddress }) => {
        const source = account(address)
        return {
          data: source
            ? {
                clearinghouseStates: [
                  ['', { withdrawable: source.withdrawable }],
                  ...Object.entries(source.dexBalances ?? {}).map(
                    ([dex, withdrawable]) => [dex, { withdrawable }],
                  ),
                ],
              }
            : undefined,
          isLoading: false,
          isError: false,
        }
      },
    )
    mocks.refetchPerps.mockImplementation(
      async (address: EvmAddress, dex: string) => ({
        data: {
          withdrawable: dex
            ? account(address)?.dexBalances?.[dex]
            : account(address)?.withdrawable,
        },
        isError: false,
      }),
    )
    mocks.useClearinghouseState.mockImplementation(
      ({ address, dex = '' }: { address?: EvmAddress; dex?: string }) => ({
        data: address
          ? {
              withdrawable: dex
                ? account(address)?.dexBalances?.[dex]
                : account(address)?.withdrawable,
            }
          : undefined,
        isLoading: false,
        isError: false,
        refetch: () => mocks.refetchPerps(address, dex),
      }),
    )
    mocks.refetchAbstraction.mockImplementation(
      async (address: EvmAddress) => ({
        data: account(address)?.abstraction,
        isError: false,
      }),
    )
    mocks.useUserAbstraction.mockImplementation(
      ({ address }: { address?: EvmAddress }) => ({
        data: account(address)?.abstraction,
        isLoading: false,
        isError: false,
        refetch: () => mocks.refetchAbstraction(address),
      }),
    )
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() =>
      root.render(
        <SubAccountTransferDialog
          masterAddress={masterAddress}
          subAccount={{
            subAccountUser: subAccountAddress,
            name: 'Sub-account 5',
          }}
        />,
      ),
    )
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('transfers manual-mode perps USDC from a sub-account with no spot balance', async () => {
    act(() => button('Transfer').click())
    expect(mocks.useAllDexClearinghouseState).toHaveBeenLastCalledWith({
      address: masterAddress,
    })
    act(() => button('Reverse transfer direction').click())
    for (const query of [
      mocks.useSpotClearinghouseState,
      mocks.useAllDexClearinghouseState,
      mocks.useUserAbstraction,
    ]) {
      expect(query).toHaveBeenLastCalledWith({ address: subAccountAddress })
    }
    expect(container.querySelector('[role="option"]')?.textContent).toBe(
      'USDC (Perps) — 123.456789',
    )
    act(() => button('Max: 123.456789').click())
    expect(container.querySelector('input')?.value).toBe('123.456789')
    await act(async () => button('Confirm').click())

    expect(mocks.refetchPerps).toHaveBeenCalledWith(subAccountAddress, '')
    expect(mocks.sendAssetAsync).toHaveBeenCalledWith({
      destination: masterAddress,
      sourceDex: '',
      destinationDex: '',
      fromSubAccount: subAccountAddress,
      token: 'USDC',
      decimals: 6,
      amount: '123.456789',
      expectedWalletAddress: masterAddress,
    })
    for (const address of [masterAddress, subAccountAddress]) {
      expect(mocks.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['useClearinghouseState', address],
      })
    }
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('distinguishes perps and spot USDC and preserves master-to-sub spot routing', async () => {
    act(() => button('Transfer').click())
    expect(
      Array.from(
        container.querySelectorAll('[role="option"]'),
        (option) => option.textContent,
      ),
    ).toEqual(expect.arrayContaining(['USDC (Spot) — 20', 'USDC (Perps) — 50']))
    act(() => button('USDC (Spot) — 20').click())
    setAmount('12.345678')
    await act(async () => button('Confirm').click())

    expect(mocks.sendAssetAsync).toHaveBeenCalledWith({
      destination: subAccountAddress,
      sourceDex: 'spot',
      destinationDex: 'spot',
      fromSubAccount: undefined,
      token: `USDC:${usdcTokenId}`,
      decimals: 6,
      amount: '12.345678',
      expectedWalletAddress: masterAddress,
    })
    expect(mocks.refetchPerps).not.toHaveBeenCalled()
  })

  it.each(['to-sub-account', 'to-master'] as const)(
    'transfers the selected HIP-3 USDC balance %s when multiple DEXs share USDC',
    async (direction) => {
      const source =
        direction === 'to-sub-account' ? masterAddress : subAccountAddress
      accounts.set(source, {
        spotBalance: '20',
        withdrawable: '50',
        dexBalances: { xyz: '30', abc: '40' },
        abstraction: 'disabled',
      })
      act(() => button('Transfer').click())
      if (direction === 'to-master') {
        act(() => button('Reverse transfer direction').click())
      }
      expect(
        Array.from(
          container.querySelectorAll('[role="option"]'),
          (option) => option.textContent,
        ),
      ).toEqual(
        expect.arrayContaining([
          'USDC (Spot) — 20',
          'USDC (Perps) — 50',
          'USDC (xyz Perps) — 30',
          'USDC (abc Perps) — 40',
        ]),
      )
      act(() => button('USDC (xyz Perps) — 30').click())
      expect(mocks.useClearinghouseState).toHaveBeenLastCalledWith({
        address: source,
        dex: 'xyz',
      })
      act(() => button('Max: 30').click())
      expect(container.querySelector('input')?.value).toBe('30')
      await act(async () => button('Confirm').click())

      expect(mocks.refetchPerps).toHaveBeenCalledWith(source, 'xyz')
      expect(mocks.sendAssetAsync).toHaveBeenCalledWith({
        destination:
          direction === 'to-sub-account' ? subAccountAddress : masterAddress,
        sourceDex: 'xyz',
        destinationDex: 'xyz',
        fromSubAccount:
          direction === 'to-master' ? subAccountAddress : undefined,
        token: 'USDC',
        decimals: 6,
        amount: '30',
        expectedWalletAddress: masterAddress,
      })
    },
  )

  it('transfers HIP-3 non-USDC collateral with its token identifier and perps precision', async () => {
    accounts.set(subAccountAddress, {
      spotBalance: '0',
      withdrawable: '123.456789',
      dexBalances: { cash: '65.12345678' },
      abstraction: 'disabled',
    })
    openFromSubAccount()
    act(() => button('USDT0 (cash Perps) — 65.123456').click())
    act(() => button('Max: 65.123456').click())
    await act(async () => button('Confirm').click())

    expect(mocks.refetchPerps).toHaveBeenCalledWith(subAccountAddress, 'cash')
    expect(mocks.sendAssetAsync).toHaveBeenCalledWith({
      destination: masterAddress,
      sourceDex: 'cash',
      destinationDex: 'cash',
      fromSubAccount: subAccountAddress,
      token: `USDT0:${usdtTokenId}`,
      decimals: 6,
      amount: '65.123456',
      expectedWalletAddress: masterAddress,
    })
  })

  it('does not substitute native USDC when the selected HIP-3 balance drops before signing', async () => {
    accounts.set(subAccountAddress, {
      spotBalance: '20',
      withdrawable: '123.456789',
      dexBalances: { xyz: '30' },
      abstraction: 'disabled',
    })
    openFromSubAccount()
    act(() => button('USDC (xyz Perps) — 30').click())
    setAmount('10')
    mocks.refetchPerps.mockResolvedValue({
      data: { withdrawable: '5' },
      isError: false,
    })
    await act(async () => button('Confirm').click())

    expect(mocks.refetchPerps).toHaveBeenCalledWith(subAccountAddress, 'xyz')
    expect(mocks.sendAssetAsync).not.toHaveBeenCalled()
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'Insufficient available balance.',
    )
  })

  it.each(['unifiedAccount', 'portfolioMargin'] as const)(
    'does not duplicate perps collateral for a source in %s mode',
    (abstraction) => {
      accounts.set(masterAddress, {
        spotBalance: '20',
        withdrawable: '50',
        dexBalances: { xyz: '30', cash: '40' },
        abstraction,
      })
      act(() => button('Transfer').click())
      expect(container.querySelectorAll('[role="option"]')).toHaveLength(1)
      expect(container.querySelector('[role="option"]')?.textContent).toBe(
        'USDC (Spot) — 20',
      )

      act(() => button('Reverse transfer direction').click())
      expect(container.querySelector('[role="option"]')?.textContent).toBe(
        'USDC (Perps) — 123.456789',
      )
    },
  )

  it('rejects an amount above the refreshed perps withdrawable balance before signing', async () => {
    openFromSubAccount()
    setAmount('100')
    mocks.refetchPerps.mockResolvedValue({
      data: { withdrawable: '80' },
      isError: false,
    })
    await act(async () => button('Confirm').click())

    expect(mocks.sendAssetAsync).not.toHaveBeenCalled()
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      'Insufficient available balance.',
    )
    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it('does not sign when refreshing the perps balance fails', async () => {
    openFromSubAccount()
    setAmount('10')
    mocks.refetchPerps.mockResolvedValue({ data: undefined, isError: true })
    await act(async () => button('Confirm').click())

    expect(mocks.sendAssetAsync).not.toHaveBeenCalled()
    expect(container.querySelector('[role="alert"]')?.textContent).toMatch(
      /Unable to refresh/,
    )
  })

  it('does not use stale perps collateral if the source switched to unified mode', async () => {
    openFromSubAccount()
    setAmount('10')
    mocks.refetchAbstraction.mockResolvedValue({
      data: 'unifiedAccount',
      isError: false,
    })
    await act(async () => button('Confirm').click())

    expect(mocks.sendAssetAsync).not.toHaveBeenCalled()
    expect(container.querySelector('[role="alert"]')).not.toBeNull()
  })
})
