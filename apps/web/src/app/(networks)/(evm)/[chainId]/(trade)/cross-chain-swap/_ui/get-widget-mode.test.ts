import { STELLAR_USDC, STELLAR_USDT0 } from 'sushi/stellar'
import { describe, expect, it } from 'vitest'
import { getWidgetMode } from './get-widget-mode'

describe('cross-chain provider selection', () => {
  it('keeps EVM routes on LiFi', () => {
    expect(getWidgetMode(1, 42161)).toBe('lifi')
    expect(getWidgetMode(1, Number.NaN)).toBe('lifi')
  })

  it('keeps Stellar XLM and USDC on NEAR Intents', () => {
    expect(getWidgetMode(-4, 1, 'NATIVE')).toBe('near-intents')
    expect(getWidgetMode(1, -4, undefined, STELLAR_USDC[-4].address)).toBe(
      'near-intents',
    )
  })

  it('routes USDT0 in either direction through LayerZero', () => {
    expect(getWidgetMode(-4, 1, STELLAR_USDT0[-4].address)).toBe('layerzero')
    expect(getWidgetMode(1, -4, undefined, STELLAR_USDT0[-4].address)).toBe(
      'layerzero',
    )
    expect(getWidgetMode(-4, Number.NaN, STELLAR_USDT0[-4].address)).toBe(
      'layerzero',
    )
  })

  it('does not send arbitrary EVM assets through the OFT', () => {
    expect(getWidgetMode(1, -4, 'NATIVE', STELLAR_USDT0[-4].address)).not.toBe(
      'layerzero',
    )
  })
})
