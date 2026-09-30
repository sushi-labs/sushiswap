/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import type { CurrencyInputProps } from 'src/lib/wagmi/components/web3-input/currency'
import { EvmChainId, WETH9 } from 'sushi/evm'
import { STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import { expect, it, vi } from 'vitest'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import { FeeTierCard } from './fee-tier-card'
import { LiquidityDepositInput } from './liquidity-deposit-input'

const mocks = vi.hoisted(() => ({
  input: vi.fn<(props: CurrencyInputProps<BalanceChainId>) => void>(),
}))
vi.mock('src/lib/wagmi/components/web3-input/currency', () => ({
  CurrencyInput: (props: CurrencyInputProps<BalanceChainId>) => {
    mocks.input(props)
    return null
  },
}))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('keeps fee selection controlled, supports pool badges, and blocks disabled or unavailable tiers', () => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const onSelect = vi.fn()
  try {
    act(() =>
      root.render(
        <FeeTierCard
          fee={3000}
          description="Most pairs"
          selected
          badge="75% Selected"
          onSelect={onSelect}
        />,
      ),
    )
    const button = container.querySelector('button')
    if (!button) throw new Error('Missing fee button')
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.getAttribute('testdata-id')).toBe('fee-option-3000')
    expect(button.textContent).toContain('0.3% Fees75% Selected')
    act(() => button.click())
    expect(onSelect).toHaveBeenCalledOnce()
    expect(button.getAttribute('aria-pressed')).toBe('true')
    act(() =>
      root.render(
        <FeeTierCard
          fee={3000}
          description="Most pairs"
          disabled
          onSelect={onSelect}
        />,
      ),
    )
    act(() => button.click())
    expect(onSelect).toHaveBeenCalledOnce()
    act(() =>
      root.render(<FeeTierCard fee={3000} description="Unavailable pool" />),
    )
    expect(container.querySelector('button')).toBeNull()
    expect(container.textContent).toContain('Unavailable pool')
  } finally {
    act(() => root.unmount())
  }
})

it.each([WETH9[EvmChainId.ETHEREUM], STELLAR_XLM[StellarChainId.STELLAR]])(
  'preserves deposit callbacks and prevents editing or Max when locked for $symbol',
  (currency) => {
    const container = document.createElement('div')
    const root = createRoot(container)
    const onChange = vi.fn()
    const onMax = vi.fn()
    function render(locked: boolean): void {
      act(() =>
        root.render(
          <LiquidityDepositInput
            chainId={currency.chainId}
            currency={currency}
            value="10"
            onChange={onChange}
            onMax={onMax}
            locked={locked}
          />,
        ),
      )
    }
    try {
      render(true)
      expect(container.textContent).toContain(
        `${currency.symbol} is not needed`,
      )
      expect(mocks.input.mock.lastCall?.[0]).toMatchObject({
        currency,
        chainId: currency.chainId,
        value: '10',
        type: 'INPUT',
        onChange,
        onMax,
        disabled: true,
        disableMaxButton: true,
      })
      render(false)
      expect(container.textContent).not.toContain('Single-asset')
      expect(mocks.input.mock.lastCall?.[0].disabled).toBeFalsy()
      expect(mocks.input.mock.lastCall?.[0].disableMaxButton).toBeFalsy()
    } finally {
      act(() => root.unmount())
    }
  },
)
