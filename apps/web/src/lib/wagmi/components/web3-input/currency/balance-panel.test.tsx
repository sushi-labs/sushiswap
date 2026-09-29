/** @vitest-environment jsdom */

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { Amount } from 'sushi'
import { EvmChainId, USDC } from 'sushi/evm'
import { expect, it, vi } from 'vitest'
import { BalancePanel } from './balance-panel'

vi.mock('@sushiswap/hooks', () => ({ useIsMounted: () => true }))
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

it('uses a supplied liquidity Max calculation and preserves the default reserve-aware Max', () => {
  const container = document.createElement('div')
  const root = createRoot(container)
  const currency = USDC[EvmChainId.ARC]
  const onChange = vi.fn()
  const onMax = vi.fn()
  function render(custom: boolean, disabled = false, error = false): void {
    act(() =>
      root.render(
        <BalancePanel
          chainId={EvmChainId.ARC}
          account={undefined}
          currency={currency}
          balance={Amount.fromHuman(currency, '10')}
          type="INPUT"
          onChange={onChange}
          onMax={custom ? onMax : undefined}
          disableMaxButton={disabled}
          error={error}
        />,
      ),
    )
  }
  function click(): void {
    const button = container.querySelector('button')
    if (!button) throw new Error('Missing balance button')
    act(() => button.click())
  }
  try {
    render(true)
    click()
    expect(onMax).toHaveBeenCalledOnce()
    expect(onChange).not.toHaveBeenCalled()
    render(true, true)
    click()
    expect(onMax).toHaveBeenCalledOnce()
    render(true, false, true)
    expect(container.textContent).toBe('Balance unavailable')
    expect(container.querySelector('button')).toBeNull()
    render(false)
    click()
    expect(onChange).toHaveBeenLastCalledWith('9.99')
  } finally {
    act(() => root.unmount())
  }
})
