/** @vitest-environment jsdom */

import { Activity, act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it } from 'vitest'
import { PoolFormSession } from './pool-form-session'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function TokenField({ entryToken }: { entryToken: string }) {
  const [token, setToken] = useState(entryToken)
  return (
    <select value={token} onChange={(event) => setToken(event.target.value)}>
      <option>ETH</option>
      <option>DAI</option>
      <option>USDC</option>
    </select>
  )
}

it('keeps edits during a visit and reads fresh defaults when a cached page reopens', () => {
  const container = document.createElement('div')
  const root = createRoot(container)

  function render(mode: 'visible' | 'hidden', entryToken: string) {
    act(() =>
      root.render(
        <Activity mode={mode}>
          <PoolFormSession>
            <TokenField entryToken={entryToken} />
          </PoolFormSession>
        </Activity>,
      ),
    )
  }

  try {
    render('visible', 'ETH')
    const token = container.querySelector('select')!
    act(() => {
      token.value = 'DAI'
      token.dispatchEvent(new Event('change', { bubbles: true }))
    })
    render('visible', 'ETH')
    expect(container.querySelector('select')?.value).toBe('DAI')

    render('hidden', 'ETH')
    render('visible', 'USDC')
    expect(container.querySelector('select')?.value).toBe('USDC')
  } finally {
    act(() => root.unmount())
  }
})
