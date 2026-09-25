import {
  type EvmAddress,
  EvmChainId,
  SUSHISWAP_V3_POSITION_MANAGER,
} from 'sushi/evm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PublicWagmiConfig } from '../../../config/public'
import { getConcentratedPositionOwners } from '../../pools/actions/get-concentrated-position-owner'
import { ARC_V1_POSITION_MANAGER } from '../arc-position-manager-refund'
import { getConcentratedLiquidityPositions } from './get-concentrated-liquidity-positions'
import { getConcentratedLiquidityPositionsFromTokenIds } from './get-concentrated-liquidity-positions-from-token-ids'

const { readContracts } = vi.hoisted(() => ({ readContracts: vi.fn() }))
vi.mock('@wagmi/core/actions', () => ({ readContracts }))
vi.mock('wagmi/actions', () => ({ readContracts }))

const config = {} as PublicWagmiConfig
const account: EvmAddress = '0x0000000000000000000000000000000000000001'
const currentManager = SUSHISWAP_V3_POSITION_MANAGER[EvmChainId.ARC]
const chainId = EvmChainId.ARC

function position(tokenId: bigint, liquidity = 10n) {
  return {
    tokenId,
    nonce: 0n,
    operator: account,
    token0: '0x0000000000000000000000000000000000000002',
    token1: '0x0000000000000000000000000000000000000003',
    fee: 3000,
    tickLower: -60,
    tickUpper: 60,
    liquidity,
    feeGrowthInside0LastX128: 0n,
    feeGrowthInside1LastX128: 0n,
    tokensOwed0: 1n,
    tokensOwed1: 2n,
  }
}

function mockPages(currentCount: number, legacyCount: number) {
  readContracts.mockImplementation(
    async (
      _config: unknown,
      {
        contracts,
      }: { contracts: { args: [EvmAddress, EvmAddress, bigint, bigint] }[] },
    ) =>
      contracts.map(({ args: [manager, , skip, first] }) => {
        const total = manager === currentManager ? currentCount : legacyCount
        const length = Math.max(
          0,
          Math.min(Number(first), total - Number(skip)),
        )
        return {
          status: 'success',
          result: Array.from({ length }, (_, index) =>
            position(skip + BigInt(index) + 1n),
          ),
        }
      }),
  )
}

beforeEach(() => {
  readContracts.mockReset()
})

describe('Arc position enumeration', () => {
  it('paginates each manager independently and retains overlapping token IDs', async () => {
    mockPages(1, 201)
    const positions = await getConcentratedLiquidityPositions({
      account,
      chainIds: [chainId],
      config,
    })

    expect(positions).toHaveLength(202)
    expect(
      positions
        .filter(({ tokenId }) => tokenId === 1n)
        .map(({ positionManager }) => positionManager),
    ).toEqual([currentManager, ARC_V1_POSITION_MANAGER])
    expect(
      readContracts.mock.calls.map(([, { contracts }]) =>
        contracts[0].args.slice(0, 3),
      ),
    ).toEqual([
      [currentManager, account, 0n],
      [ARC_V1_POSITION_MANAGER, account, 0n],
      [ARC_V1_POSITION_MANAGER, account, 100n],
      [ARC_V1_POSITION_MANAGER, account, 200n],
    ])
  })

  it('still returns legacy positions when the configured manager is empty', async () => {
    mockPages(0, 101)
    const positions = await getConcentratedLiquidityPositions({
      account,
      chainIds: [chainId],
      config,
    })
    expect(positions).toHaveLength(101)
    expect(
      positions.every(
        ({ positionManager }) => positionManager === ARC_V1_POSITION_MANAGER,
      ),
    ).toBe(true)
  })

  it('does not let one manager consume the other manager pagination limit', async () => {
    mockPages(600, 600)
    const positions = await getConcentratedLiquidityPositions({
      account,
      chainIds: [chainId],
      config,
    })
    expect(
      positions.filter(
        ({ positionManager }) => positionManager === currentManager,
      ),
    ).toHaveLength(500)
    expect(
      positions.filter(
        ({ positionManager }) => positionManager === ARC_V1_POSITION_MANAGER,
      ),
    ).toHaveLength(500)
  })

  it('isolates a failed manager from positions fetched from the other manager', async () => {
    readContracts
      .mockRejectedValueOnce(new Error('RPC failure'))
      .mockResolvedValueOnce([{ status: 'success', result: [position(1n)] }])
    await expect(
      getConcentratedLiquidityPositions({
        account,
        chainIds: [chainId],
        config,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        tokenId: 1n,
        positionManager: ARC_V1_POSITION_MANAGER,
      }),
    ])
  })
})

describe('manager-specific position reads', () => {
  it('fetches the same token ID from both managers with distinct details', async () => {
    readContracts.mockResolvedValueOnce([
      { status: 'success', result: position(1n, 10n) },
      { status: 'success', result: position(1n, 20n) },
    ])
    const positions = await getConcentratedLiquidityPositionsFromTokenIds({
      tokenIds: [
        { chainId, tokenId: 1n },
        { chainId, tokenId: 1n, positionManager: ARC_V1_POSITION_MANAGER },
      ],
      config,
    })
    expect(
      readContracts.mock.calls[0][1].contracts.map(
        ({ args }: { args: unknown[] }) => args,
      ),
    ).toEqual([
      [currentManager, 1n],
      [ARC_V1_POSITION_MANAGER, 1n],
    ])
    expect(
      positions.map(({ positionManager, liquidity }) => ({
        positionManager,
        liquidity,
      })),
    ).toEqual([
      { positionManager: currentManager, liquidity: 10n },
      { positionManager: ARC_V1_POSITION_MANAGER, liquidity: 20n },
    ])
  })

  it('reads the owner from the requested manager', async () => {
    readContracts.mockResolvedValueOnce([
      { status: 'success', result: account },
    ])
    await getConcentratedPositionOwners({
      tokenIds: [
        { chainId, tokenId: 1n, positionManager: ARC_V1_POSITION_MANAGER },
      ],
      config,
    })
    expect(readContracts.mock.calls[0][1].contracts[0]).toMatchObject({
      address: ARC_V1_POSITION_MANAGER,
      functionName: 'ownerOf',
      args: [1n],
    })
  })

  it('rejects an unknown manager before reading position details or owners', async () => {
    const tokenIds = [{ chainId, tokenId: 1n, positionManager: account }]
    await expect(
      getConcentratedLiquidityPositionsFromTokenIds({ tokenIds, config }),
    ).rejects.toThrow('Unsupported position manager')
    await expect(
      getConcentratedPositionOwners({ tokenIds, config }),
    ).rejects.toThrow('Unsupported position manager')
    expect(readContracts).not.toHaveBeenCalled()
  })
})
