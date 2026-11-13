/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import {
  STELLAR_USDC,
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
} from 'sushi/stellar'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  SimpleSwapProvider,
  useSimpleSwapActions,
  useSimpleSwapState,
} from './simple-swap-provider'

const xlm = STELLAR_XLM[StellarChainId.STELLAR]
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
const usdt = STELLAR_USDT0[StellarChainId.STELLAR]
let root: Root
let state: ReturnType<typeof useSimpleSwapState>
let actions: ReturnType<typeof useSimpleSwapActions>

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

function Probe(): null {
  state = useSimpleSwapState()
  actions = useSimpleSwapActions()
  return null
}

beforeEach(() => {
  root = createRoot(document.createElement('div'))
})

afterEach(() => {
  act(() => root.unmount())
})

it('preserves standalone Stellar token switching and amount state', () => {
  act(() => {
    root.render(
      <SimpleSwapProvider>
        <Probe />
      </SimpleSwapProvider>,
    )
  })
  expect(state.token0).toBe(xlm)
  expect(state.token1).toBe(usdt)

  act(() => actions.setAmount('12'))
  expect(state.amount).toBe('12')
  act(() => actions.setToken0(usdt))
  expect(state.token0).toBe(usdt)
  expect(state.token1).toBe(xlm)
  expect(state.amount).toBe('')
})

it('uses the controlled form for tokens and amount while retaining quote state', () => {
  const form = {
    token0: usdc,
    token1: xlm,
    amount: '25',
    setToken0: vi.fn(),
    setToken1: vi.fn(),
    setAmount: vi.fn(),
    swapTokens: vi.fn(),
  }
  act(() => {
    root.render(
      <SimpleSwapProvider form={form}>
        <Probe />
      </SimpleSwapProvider>,
    )
  })
  expect(state.token0).toBe(usdc)
  expect(state.token1).toBe(xlm)
  expect(state.amount).toBe('25')

  act(() => {
    actions.setToken0(usdt)
    actions.setToken1(usdc)
    actions.setAmount('50')
    actions.swapTokens()
    actions.setOutputAmount(42n)
    actions.setPriceImpact(12)
    actions.setSlippageAmount(5)
    actions.setError('Previous quote error')
    actions.setIsTransactionPending(true)
  })
  expect(form.setToken0).toHaveBeenCalledWith(usdt)
  expect(form.setToken1).toHaveBeenCalledWith(usdc)
  expect(form.setAmount).toHaveBeenCalledWith('50')
  expect(form.swapTokens).toHaveBeenCalledOnce()
  expect(state.outputAmount).toBe(42n)
  expect(state.amount).toBe('25')

  act(() => {
    root.render(
      <SimpleSwapProvider form={{ ...form, amount: '50', token0: usdt }}>
        <Probe />
      </SimpleSwapProvider>,
    )
  })
  expect(state.token0).toBe(usdt)
  expect(state.amount).toBe('50')
  expect(state.outputAmount).toBe(0n)
  expect(state.priceImpact).toBeNull()
  expect(state.slippageAmount).toBe(0)
  expect(state.error).toBe('')
  expect(state.isTransactionPending).toBe(true)
})
