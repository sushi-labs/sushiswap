import { ARC_V1_POSITION_MANAGER } from 'src/lib/wagmi/hooks/positions/arc-position-manager-refund'
import { EvmChainId, SUSHISWAP_V3_POSITION_MANAGER } from 'sushi/evm'
import { describe, expect, it, vi } from 'vitest'
import V3PositionsPage from './page'

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('Not found')
  },
}))

vi.mock('./_common/ui/v3-position-view', () => ({
  V3PositionView: () => null,
}))

const params = Promise.resolve({
  chainId: EvmChainId.ARC.toString(),
  address: '0x0000000000000000000000000000000000000001',
  position: '1',
})

describe('V3 position manager routing', () => {
  it.each([
    [undefined, SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC]],
    [ARC_V1_POSITION_MANAGER, ARC_V1_POSITION_MANAGER],
  ])('selects manager %s for the position view', async (manager, expected) => {
    const page = await V3PositionsPage({
      params,
      searchParams: Promise.resolve({ positionManager: manager }),
    })

    expect(page.props.positionManager).toBe(expected)
    expect(page.props.position).toBe('1')
  })

  it.each([
    '0x0000000000000000000000000000000000000001',
    '',
    [ARC_V1_POSITION_MANAGER, ARC_V1_POSITION_MANAGER],
  ])('rejects unsupported or ambiguous manager %s', async (manager) => {
    await expect(
      V3PositionsPage({
        params,
        searchParams: Promise.resolve({ positionManager: manager }),
      }),
    ).rejects.toThrow('Not found')
  })
})
