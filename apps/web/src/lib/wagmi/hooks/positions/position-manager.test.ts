import { EvmChainId, SUSHISWAP_V3_POSITION_MANAGER } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { ARC_V1_POSITION_MANAGER } from './arc-position-manager-refund'
import { getPositionManager, getPositionManagers } from './position-manager'

describe('position manager selection', () => {
  it('includes both Arc managers and only the configured manager elsewhere', () => {
    expect(getPositionManagers(EvmChainId.ARC)).toEqual([
      SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC],
      ARC_V1_POSITION_MANAGER,
    ])
    expect(getPositionManagers(EvmChainId.ETHEREUM)).toEqual([
      SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ETHEREUM],
    ])
  })

  it('keeps existing links on the configured manager and normalizes explicit managers', () => {
    expect(getPositionManager(EvmChainId.ARC)).toBe(
      SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC],
    )
    expect(getPositionManager(EvmChainId.ARC, null)).toBe(
      SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC],
    )
    expect(
      getPositionManager(EvmChainId.ARC, ARC_V1_POSITION_MANAGER.toLowerCase()),
    ).toBe(ARC_V1_POSITION_MANAGER)
  })

  it('rejects unsupported managers and the legacy Arc manager on other chains', () => {
    for (const manager of [
      '',
      'invalid',
      '0x0000000000000000000000000000000000000001',
    ]) {
      expect(() => getPositionManager(EvmChainId.ARC, manager)).toThrow(
        'Unsupported position manager',
      )
    }
    expect(() =>
      getPositionManager(EvmChainId.ETHEREUM, ARC_V1_POSITION_MANAGER),
    ).toThrow('Unsupported position manager')
  })
})
