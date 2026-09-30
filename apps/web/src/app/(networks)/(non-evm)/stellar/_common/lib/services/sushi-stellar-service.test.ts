import { STELLAR_USDC, STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import { beforeEach, expect, it, vi } from 'vitest'
import { SushiStellarService } from './sushi-stellar-service'

const mocks = vi.hoisted(() => ({
  config: vi.fn(),
  positions: vi.fn(),
  mint: vi.fn(),
  increase: vi.fn(),
}))
vi.mock('../soroban/pool-helpers', () => ({
  getPoolInfoFromContract: mocks.config,
}))
vi.mock('./position-service', () => ({
  positionService: { getUserPositionsWithFees: mocks.positions },
}))
vi.mock('../soroban/position-manager-helpers', () => ({
  mintPosition: mocks.mint,
  increaseLiquidity: mocks.increase,
}))
const token0 = STELLAR_XLM[StellarChainId.STELLAR]
const token1 = STELLAR_USDC[StellarChainId.STELLAR]
const params = {
  poolAddress: token1.address,
  token0Amount: '900719925.4740993',
  token1Amount: '1',
  token0Decimals: 7,
  token1Decimals: 7,
  tickLower: -600,
  tickUpper: 600,
}
const service = new SushiStellarService()
const sign = vi.fn()
const account = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
beforeEach(() => {
  vi.clearAllMocks()
  mocks.config.mockResolvedValue({ token0, token1, fee: 3000 })
  mocks.positions.mockResolvedValue([])
  mocks.mint.mockResolvedValue({ hash: 'minted', tokenId: 1, liquidity: 100n })
  mocks.increase.mockResolvedValue({ hash: 'increased', liquidity: 100n })
})
it('submits exact base units when minting or increasing a matching position', async () => {
  await service.addLiquidity(account, params, sign, sign)
  expect(mocks.mint.mock.calls[0][0].amount0Desired).toBe(9007199254740993n)
  mocks.positions.mockResolvedValue([
    {
      token0: token0.address,
      token1: token1.address,
      fee: 3000,
      tickLower: -600,
      tickUpper: 600,
      tokenId: 1,
    },
  ])
  await service.addLiquidity(account, params, sign, sign)
  expect(mocks.increase.mock.calls[0][0].amount0Desired).toBe(9007199254740993n)
})
it('rejects malformed amounts and invalid ranges before signing', async () => {
  for (const change of [
    { token0Amount: '-1' },
    { token0Amount: '0.00000001' },
    { token0Amount: '0', token1Amount: '0' },
    { tickLower: 600 },
    { tickLower: -601 },
  ]) {
    await expect(
      service.addLiquidity(account, { ...params, ...change }, sign, sign),
    ).rejects.toThrow()
  }
  expect(mocks.mint).not.toHaveBeenCalled()
  expect(mocks.increase).not.toHaveBeenCalled()
  expect(sign).not.toHaveBeenCalled()
})
