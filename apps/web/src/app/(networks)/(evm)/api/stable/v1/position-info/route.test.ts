import { NextRequest } from 'next/server'
import { ARC_V1_POSITION_MANAGER } from 'src/lib/wagmi/hooks/positions/arc-position-manager-refund'
import { EvmChainId, SUSHISWAP_V3_POSITION_MANAGER } from 'sushi/evm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPosition } from './get-position'
import { GET } from './route'

vi.mock('src/lib/rate-limit', () => ({ rateLimit: () => undefined }))
vi.mock('./get-position', () => ({ getPosition: vi.fn() }))
vi.mock('./get-pool', () => ({ getPool: vi.fn() }))
vi.mock('@sushiswap/graph-client/data-api', () => ({ getTokenList: vi.fn() }))

describe('position-info manager validation', () => {
  beforeEach(() => vi.clearAllMocks())

  it.each([
    [EvmChainId.ARC, 'invalid'],
    [EvmChainId.ARC, '0x0000000000000000000000000000000000000001'],
    [EvmChainId.ETHEREUM, ARC_V1_POSITION_MANAGER],
  ])(
    'rejects unsupported managers before RPC reads (%s, %s)',
    async (chainId, manager) => {
      const response = await GET(
        new NextRequest(
          `http://localhost/api/stable/v1/position-info?chainId=${chainId}&positionId=1&positionManager=${manager}`,
        ),
      )

      expect(response?.status).toBe(400)
      expect(getPosition).not.toHaveBeenCalled()
    },
  )

  it.each([
    [undefined, SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC]],
    [ARC_V1_POSITION_MANAGER, ARC_V1_POSITION_MANAGER],
  ])(
    'passes the validated manager to position reads (%s)',
    async (manager, expectedManager) => {
      vi.mocked(getPosition).mockRejectedValueOnce(new Error('RPC unavailable'))
      const managerQuery = manager ? `&positionManager=${manager}` : ''
      const response = await GET(
        new NextRequest(
          `http://localhost/api/stable/v1/position-info?chainId=${EvmChainId.ARC}&positionId=1${managerQuery}`,
        ),
      )

      expect(getPosition).toHaveBeenCalledWith({
        chainId: EvmChainId.ARC,
        tokenId: 1n,
        positionManager: expectedManager,
      })
      expect(response?.status).toBe(500)
      expect(await response?.json()).toEqual({ error: 'RPC unavailable' })
    },
  )
})
