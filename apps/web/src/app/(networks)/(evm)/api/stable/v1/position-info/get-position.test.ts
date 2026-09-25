import { ARC_V1_POSITION_MANAGER } from 'src/lib/wagmi/hooks/positions/arc-position-manager-refund'
import { EvmChainId, SUSHISWAP_V3_POSITION_MANAGER } from 'sushi/evm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPosition } from './get-position'

const { readContract, simulateContract } = vi.hoisted(() => ({
  readContract: vi.fn(),
  simulateContract: vi.fn(),
}))

vi.mock('src/lib/wagmi/config/viem', () => ({ publicClientConfig: {} }))
vi.mock('viem', async (importOriginal) => ({
  ...(await importOriginal<typeof import('viem')>()),
  createClient: vi.fn(),
}))
vi.mock('viem/actions', () => ({ readContract, simulateContract }))

const owner = '0x0000000000000000000000000000000000000001'
const token0 = '0x0000000000000000000000000000000000000002'
const token1 = '0x0000000000000000000000000000000000000003'

describe('position-info manager selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    readContract
      .mockResolvedValueOnce(owner)
      .mockResolvedValueOnce([
        0n,
        owner,
        token0,
        token1,
        3000,
        -60,
        60,
        1000n,
        0n,
        0n,
        0n,
        0n,
      ])
    simulateContract.mockResolvedValue({ result: [10n, 20n] })
  })

  it.each([
    undefined,
    SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC],
    ARC_V1_POSITION_MANAGER,
  ])(
    'reads position, owner and fees from the same manager (%s)',
    async (manager) => {
      const position = await getPosition({
        chainId: EvmChainId.ARC,
        tokenId: 1n,
        positionManager: manager,
      })
      const expectedManager =
        manager ?? SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC]

      expect(position.owner).toBe(owner)
      expect(position.fees).toEqual({ amount0: 10n, amount1: 20n })
      expect(readContract.mock.calls.map(([, args]) => args.address)).toEqual([
        expectedManager,
        expectedManager,
      ])
      expect(simulateContract).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ address: expectedManager, account: owner }),
      )
    },
  )
})
