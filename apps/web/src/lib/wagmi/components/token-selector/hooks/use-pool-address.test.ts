import { readContracts } from '@wagmi/core'
import { EvmChainId } from 'sushi/evm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Config } from 'wagmi'
import { getToken } from '../../../actions/get-token'
import { getPoolByAddress } from './use-pool-address'

vi.mock('@wagmi/core', () => ({ readContracts: vi.fn() }))
vi.mock('wagmi', () => ({ useConfig: vi.fn() }))
vi.mock('../../../actions/get-token', () => ({ getToken: vi.fn() }))

const poolAddress = '0x0000000000000000000000000000000000000001'
const token0Address = '0x0000000000000000000000000000000000000002'
const token1Address = '0x0000000000000000000000000000000000000003'
const config = {} as Config

function mockTokenMetadata() {
  vi.mocked(getToken)
    .mockResolvedValueOnce({
      address: token0Address,
      chainId: EvmChainId.ETHEREUM,
      decimals: 18,
      name: 'Token Zero',
      symbol: 'TK0',
    })
    .mockResolvedValueOnce({
      address: token1Address,
      chainId: EvmChainId.ETHEREUM,
      decimals: 6,
      name: 'Token One',
      symbol: 'TK1',
    })
}

describe('getPoolByAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves a V3 pool and its tokens from RPC', async () => {
    vi.mocked(readContracts).mockResolvedValueOnce([
      { result: token0Address, status: 'success' },
      { result: token1Address, status: 'success' },
      { result: 3000, status: 'success' },
      { error: new Error('not V2'), status: 'failure' },
    ] as never)
    mockTokenMetadata()

    const pool = await getPoolByAddress({
      address: poolAddress,
      chainId: EvmChainId.ETHEREUM,
      config,
    })

    expect(pool?.version).toBe('v3')
    expect(pool?.token0.symbol).toBe('TK0')
    expect(pool?.token1.symbol).toBe('TK1')
  })

  it('resolves a V2 pair when getReserves is available', async () => {
    vi.mocked(readContracts).mockResolvedValueOnce([
      { result: token0Address, status: 'success' },
      { result: token1Address, status: 'success' },
      { error: new Error('not V3'), status: 'failure' },
      { result: [1n, 1n, 1], status: 'success' },
    ] as never)
    mockTokenMetadata()

    const pool = await getPoolByAddress({
      address: poolAddress,
      chainId: EvmChainId.ETHEREUM,
      config,
    })

    expect(pool?.version).toBe('v2')
  })

  it('ignores contracts that do not implement a V2 or V3 pool interface', async () => {
    vi.mocked(readContracts).mockResolvedValueOnce([
      { result: token0Address, status: 'success' },
      { result: token1Address, status: 'success' },
      { error: new Error('not V3'), status: 'failure' },
      { error: new Error('not V2'), status: 'failure' },
    ] as never)

    await expect(
      getPoolByAddress({
        address: poolAddress,
        chainId: EvmChainId.ETHEREUM,
        config,
      }),
    ).resolves.toBeNull()
    expect(getToken).not.toHaveBeenCalled()
  })
})
