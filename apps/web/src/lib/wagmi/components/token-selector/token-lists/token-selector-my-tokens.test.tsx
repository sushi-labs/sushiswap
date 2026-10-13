/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { Amount, Fraction } from 'sushi'
import { type EvmAddress, EvmChainId, EvmToken } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { TokenSelectorChainId } from '../config'
import type { TokenSelectorRow } from './common/token-selector-row'
import { TokenSelectorMyTokens } from './token-selector-my-tokens'

const mocks = vi.hoisted(() => ({
  useMyTokens: vi.fn(),
  usePrices: vi.fn(),
  refetch: vi.fn(),
}))

vi.mock('../hooks/use-my-tokens', () => ({
  useMyTokens: mocks.useMyTokens,
}))
vi.mock('~evm/_common/ui/price-provider/price-provider/use-prices', () => ({
  usePrices: mocks.usePrices,
}))
vi.mock('src/lib/wallet/hooks/use-account', () => ({
  useAccount: () => '0x0000000000000000000000000000000000000001',
}))
vi.mock('@sushiswap/ui', () => ({
  List: { Control: ({ children }: PropsWithChildren) => children },
  classNames: (...values: unknown[]) => values.filter(Boolean).join(' '),
}))
vi.mock('./common/token-selector-import-row', () => ({
  TokenSelectorImportRow: () => null,
}))
vi.mock('./common/token-selector-row', () => ({
  TokenSelectorRow: ({
    currency,
    balance,
    price,
    onSelect,
  }: TokenSelectorRow<TokenSelectorChainId>) => (
    <button
      type="button"
      data-id={currency.id}
      data-value={
        balance && price ? balance.mul(price).toString({ fixed: 2 }) : undefined
      }
      onClick={() => onSelect(currency)}
    >
      {currency.symbol}
    </button>
  ),
  TokenSelectorRowLoading: () => null,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function token(address: EvmAddress, symbol: string, decimals = 18): EvmToken {
  return new EvmToken({
    chainId: EvmChainId.ROBINHOOD,
    address,
    symbol,
    name: symbol,
    decimals,
  })
}

const sushiCat = token('0x0000000000000000000000000000000000000001', 'SUSHICAT')
const otherSushiCat = token(
  '0x0000000000000000000000000000000000000002',
  'SUSHICAT',
  6,
)
const sushiCoin = token(
  '0x0000000000000000000000000000000000000003',
  'SUSHICOIN',
)
const longCat = token(
  '0x0000000000000000000000000000000000000004',
  'LONGCAT',
  6,
)
const hype = token('0xd6adce5eac5f40d29e2101436c38cf1cee8f4856', 'HYPE')
const apiTokens = [sushiCat, otherSushiCat, sushiCoin, longCat, hype, sushiCat]

function priceMap(
  hypePrice = new Fraction({ numerator: 814, denominator: 10 }),
): PriceMap<EvmChainId> {
  const memePrice = new Fraction({ numerator: 1, denominator: 1_000_000 })
  const prices = new Map<EvmAddress, Fraction>([
    [hype.address, hypePrice],
    [sushiCat.address, memePrice],
    [otherSushiCat.address, memePrice],
    [sushiCoin.address, memePrice],
  ])
  return {
    has: (address) => prices.has(address),
    get: (address) => prices.get(address)?.toNumber(),
    getFraction: (address) => prices.get(address),
  }
}

describe('TokenSelectorMyTokens sorting', () => {
  let root: Root
  let container: HTMLDivElement
  const onSelect = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.useMyTokens.mockReturnValue({
      data: {
        tokens: apiTokens,
        balanceMap: new Map([
          [sushiCat.address, Amount.fromHuman(sushiCat, '1180000')],
          [otherSushiCat.address, Amount.fromHuman(otherSushiCat, '490000')],
          [sushiCoin.address, Amount.fromHuman(sushiCoin, '540000')],
          [longCat.address, Amount.fromHuman(longCat, '10000000')],
          [hype.address, Amount.fromHuman(hype, '0.4878748')],
        ]),
      },
      isLoading: false,
      isError: false,
      refetch: mocks.refetch,
    })
    mocks.usePrices.mockReturnValue({ data: priceMap() })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function render(): void {
    act(() => {
      root.render(
        <TokenSelectorMyTokens
          chainId={EvmChainId.ROBINHOOD}
          selected={undefined}
          onSelect={onSelect}
          onShowInfo={vi.fn()}
        />,
      )
    })
  }

  function displayedIds(): (string | undefined)[] {
    return Array.from(
      container.querySelectorAll('button'),
      (button) => button.dataset.id,
    )
  }

  it('puts the highest fiat holding first and retains distinct contracts sharing a symbol', () => {
    render()

    expect(displayedIds()).toEqual([
      hype.id,
      sushiCat.id,
      sushiCoin.id,
      otherSushiCat.id,
      longCat.id,
    ])
    const buttons = Array.from(container.querySelectorAll('button'))
    expect(buttons.map((button) => button.dataset.value)).toEqual([
      '39.71',
      '1.18',
      '0.54',
      '0.49',
      undefined,
    ])
    expect(
      buttons.filter((button) => button.textContent === 'SUSHICAT'),
    ).toHaveLength(2)
    act(() => buttons[0].click())
    expect(onSelect).toHaveBeenCalledWith(hype)
    expect(apiTokens[0]).toBe(sushiCat)
  })

  it('reorders when prices arrive and update without changing the balances response', () => {
    mocks.usePrices.mockReturnValue({ data: undefined })
    render()
    expect(displayedIds()).toEqual([
      longCat.id,
      sushiCat.id,
      sushiCoin.id,
      otherSushiCat.id,
      hype.id,
    ])

    mocks.usePrices.mockReturnValue({ data: priceMap() })
    render()
    expect(displayedIds()).toEqual([
      hype.id,
      sushiCat.id,
      sushiCoin.id,
      otherSushiCat.id,
      longCat.id,
    ])

    mocks.usePrices.mockReturnValue({
      data: priceMap(new Fraction({ numerator: 1, denominator: 1 })),
    })
    render()
    expect(displayedIds()).toEqual([
      sushiCat.id,
      sushiCoin.id,
      otherSushiCat.id,
      hype.id,
      longCat.id,
    ])
  })

  it('shows the empty state when the balances map contains only zero balances', () => {
    mocks.useMyTokens.mockReturnValue({
      data: {
        tokens: [hype],
        balanceMap: new Map([[hype.address, Amount.fromHuman(hype, '0')]]),
      },
      isLoading: false,
      isError: false,
      refetch: mocks.refetch,
    })
    render()

    expect(displayedIds()).toEqual([])
    expect(container.textContent).toContain('No balances found.')
  })
})
