/** @vitest-environment jsdom */

import { type ComponentProps, type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { EvmAddress } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AccountType } from '../../active-account-state'
import { Deposit } from './deposit'

const mocks = vi.hoisted(() => ({
  useUserState: vi.fn(),
  useAssetState: vi.fn(),
  useUserSettingsState: vi.fn(),
  useActiveAccountState: vi.fn(),
  useSendableAssets: vi.fn(),
  getClearinghouseStateForDex: vi.fn(),
  DepositDialog: vi.fn(),
  PerpSpotTransferDialog: vi.fn(),
  SwapStablesDialog: vi.fn(),
}))

vi.mock('src/lib/perps', () => ({
  useSendableAssets: mocks.useSendableAssets,
  getClearinghouseStateForDex: mocks.getClearinghouseStateForDex,
}))
vi.mock('~evm/perps/user-provider', () => ({
  useUserState: mocks.useUserState,
}))
vi.mock('~evm/perps/active-account-provider', () => ({
  useActiveAccountState: mocks.useActiveAccountState,
}))
vi.mock('../trade-widget', () => ({ useAssetState: mocks.useAssetState }))
vi.mock('../asset-selector', () => ({
  useAssetListState: () => ({ state: { dexQuoteMap: new Map() } }),
}))
vi.mock('../account-management', () => ({
  useUserSettingsState: mocks.useUserSettingsState,
  DepositDialog: mocks.DepositDialog,
  PerpSpotTransferDialog: mocks.PerpSpotTransferDialog,
}))
vi.mock('../account-management/swap-stables-dialog', () => ({
  SwapStablesDialog: mocks.SwapStablesDialog,
}))
vi.mock('@sushiswap/ui', () => {
  function Button({ children, disabled }: ComponentProps<'button'>) {
    return (
      <button type="button" disabled={disabled}>
        {children}
      </button>
    )
  }

  function LinkInternal({ children, href }: ComponentProps<'a'>) {
    return <a href={href}>{children}</a>
  }

  function Wrapper({ children }: PropsWithChildren) {
    return <>{children}</>
  }

  return {
    Button,
    LinkInternal,
    HoverCard: Wrapper,
    HoverCardContent: Wrapper,
    HoverCardTrigger: Wrapper,
    classNames: (...classes: (string | undefined)[]) =>
      classes.filter(Boolean).join(' '),
  }
})

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const accountAddress: EvmAddress = '0x1111111111111111111111111111111111111111'
const defaultAssetState = {
  asset: { dex: '', marketType: 'perp' },
  availableToLong: '0',
  availableToShort: '0',
  tradeSide: 'long',
}

describe('Deposit account gating', () => {
  let container: HTMLDivElement
  let root: Root

  function render() {
    act(() =>
      root.render(
        <Deposit disabled={false}>
          <button type="button">Place order</button>
        </Deposit>,
      ),
    )
  }

  function selectAccount(type: AccountType) {
    mocks.useActiveAccountState.mockReturnValue({
      state: { activeAccount: { address: accountAddress, type } },
    })
  }

  function expectNoFundingDialogs() {
    expect(mocks.DepositDialog).not.toHaveBeenCalled()
    expect(mocks.PerpSpotTransferDialog).not.toHaveBeenCalled()
    expect(mocks.SwapStablesDialog).not.toHaveBeenCalled()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useUserState.mockReturnValue({
      state: {
        allDexClearinghouseStateQuery: {
          data: { clearinghouseStates: [] },
          isLoading: false,
          error: null,
        },
        spotStateQuery: {
          data: { spotState: { balances: [] } },
          isLoading: false,
          error: null,
        },
      },
    })
    mocks.useAssetState.mockReturnValue({ state: defaultAssetState })
    mocks.useUserSettingsState.mockReturnValue({
      state: {
        isUnifiedAccountModeEnabled: false,
        isDexAbstractionEnabled: false,
      },
    })
    mocks.useSendableAssets.mockReturnValue({
      data: [{ symbol: 'USDC', balance: '100' }],
    })
    mocks.getClearinghouseStateForDex.mockReturnValue({ withdrawable: '0' })
    mocks.DepositDialog.mockReturnValue(<div data-dialog="deposit" />)
    mocks.PerpSpotTransferDialog.mockReturnValue(<div data-dialog="transfer" />)
    mocks.SwapStablesDialog.mockReturnValue(<div data-dialog="swap" />)
    selectAccount('sub')
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each(['long', 'short'] as const)(
    'allows a funded subaccount to place a %s order without master funding dialogs',
    (tradeSide) => {
      mocks.useAssetState.mockReturnValue({
        state: {
          ...defaultAssetState,
          tradeSide,
          availableToLong: tradeSide === 'long' ? '100' : '0',
          availableToShort: tradeSide === 'short' ? '100' : '0',
        },
      })
      render()

      expect(container.querySelector('button')?.textContent).toBe('Place order')
      expect(container.querySelector('button')?.disabled).toBe(false)
      expectNoFundingDialogs()
    },
  )

  it.each(['perp', 'spot'])(
    'shows the deposit dialog for an unfunded subaccount trading %s',
    (marketType) => {
      mocks.useAssetState.mockReturnValue({
        state: {
          ...defaultAssetState,
          asset: { dex: '', marketType },
        },
      })
      render()

      expect(container.querySelector('[data-dialog="deposit"]')).not.toBeNull()
      expect(container.textContent).not.toContain('Place order')
      expect(mocks.PerpSpotTransferDialog).not.toHaveBeenCalled()
      expect(mocks.SwapStablesDialog).not.toHaveBeenCalled()
    },
  )

  it('retains the initial deposit dialog for an unfunded master account', () => {
    selectAccount('master')
    render()

    expect(container.querySelector('[data-dialog="deposit"]')).not.toBeNull()
    expect(mocks.PerpSpotTransferDialog).not.toHaveBeenCalled()
    expect(mocks.SwapStablesDialog).not.toHaveBeenCalled()
  })

  it.each(['master', 'sub'] as const)(
    'retains the transfer dialog for a %s account with sendable funds',
    (type) => {
      selectAccount(type)
      mocks.getClearinghouseStateForDex.mockReturnValue({ withdrawable: '100' })
      render()

      expect(container.querySelector('[data-dialog="transfer"]')).not.toBeNull()
      expect(mocks.DepositDialog).not.toHaveBeenCalled()
      expect(mocks.SwapStablesDialog).not.toHaveBeenCalled()
    },
  )

  it('retains the stable swap dialog for a master account without the quote asset', () => {
    selectAccount('master')
    mocks.getClearinghouseStateForDex.mockReturnValue({ withdrawable: '100' })
    mocks.useSendableAssets.mockReturnValue({
      data: [{ symbol: 'USDC', balance: '0' }],
    })
    render()

    expect(container.querySelector('[data-dialog="swap"]')).not.toBeNull()
    expect(mocks.DepositDialog).not.toHaveBeenCalled()
    expect(mocks.PerpSpotTransferDialog).not.toHaveBeenCalled()
  })

  it('retains the vault funding link for an unfunded vault', () => {
    selectAccount('vault')
    render()

    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      `/perps/vaults/${accountAddress}`,
    )
    expect(container.querySelector('button')?.textContent).toBe('Fund Vault')
    expectNoFundingDialogs()
  })
})
