import { StellarChainId, isStellarContractAddress } from 'sushi/stellar'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { contractAddresses } from './contracts'
import { getTokenBalance } from './token-helpers'

const balance = vi.hoisted(() => vi.fn())
const mocks = vi.hoisted(() => ({
  client: vi.fn(),
  tokenList: vi.fn(),
  name: vi.fn(),
  symbol: vi.fn(),
  decimals: vi.fn(),
}))
vi.mock('./client', () => ({ getTokenContractClient: mocks.client }))
vi.mock('@sushiswap/graph-client/data-api', () => ({
  getTokenList: mocks.tokenList,
}))
const account = 'GCOBBPEQOWGFBGHOXJBAH2XENGVSLM72S32S5YARQ5OIES5O6FGEYARQ'
const token = 'CC64WBDGS6QQP22QTTIACYIXT3WF7BBQEYOQPLTP7GTKYY7PZ74QYGSL'
beforeEach(() => {
  vi.resetAllMocks()
  mocks.client.mockReturnValue({
    balance,
    name: mocks.name,
    symbol: mocks.symbol,
    decimals: mocks.decimals,
  })
})
afterEach(() => vi.restoreAllMocks())

it.each([token, contractAddresses.TOKENS.XLM] as const)(
  'does not cache an RPC failure as a real zero token balance for %s',
  async (tokenAddress) => {
    const error = new Error('RPC temporarily unavailable')
    balance.mockRejectedValueOnce(error)
    await expect(getTokenBalance(account, tokenAddress)).rejects.toBe(error)
  },
)

it('returns zero XLM for an unfunded account with no classic account entry', async () => {
  balance.mockRejectedValueOnce(
    new Error('Transaction simulation failed: account entry is missing'),
  )

  await expect(
    getTokenBalance(account, contractAddresses.TOKENS.XLM),
  ).resolves.toBe(0n)
})

it('does not treat missing accounts from other token contracts as zero balances', async () => {
  const error = new Error(
    'Transaction simulation failed: account entry is missing',
  )
  balance.mockRejectedValueOnce(error)

  await expect(getTokenBalance(account, token)).rejects.toBe(error)
})

it('preserves an exact 18-decimal contract balance and a known absent trustline', async () => {
  balance.mockResolvedValueOnce({ result: 209641704638935271n })
  expect(await getTokenBalance(account, token)).toBe(209641704638935271n)
  balance.mockRejectedValueOnce(
    new Error('Error(Storage, MissingValue): trustline entry is missing'),
  )
  expect(await getTokenBalance(account, token)).toBe(0n)
  const missingStorage = new Error(
    'Error(Storage, MissingValue): contract instance is missing',
  )
  balance.mockRejectedValueOnce(missingStorage)
  vi.spyOn(console, 'error').mockImplementation(() => {})
  await expect(getTokenBalance(account, token)).rejects.toBe(missingStorage)
})

describe('strict token lookup', () => {
  let getTokenByContract: typeof import('./token-helpers')['getTokenByContract']

  beforeEach(async () => {
    vi.resetModules()
    const tokenHelpers = await import('./token-helpers')
    getTokenByContract = tokenHelpers.getTokenByContract
    mocks.tokenList.mockResolvedValue([])
    mocks.name.mockResolvedValue({ result: 'On-chain token' })
    mocks.symbol.mockResolvedValue({ result: 'TOKEN' })
    mocks.decimals.mockResolvedValue({ result: 7 })
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('uses an exact token-list match without RPC requests', async () => {
    mocks.tokenList.mockResolvedValue([
      {
        chainId: StellarChainId.STELLAR,
        address: token.toLowerCase(),
        name: 'Listed token',
        symbol: 'LISTED',
        decimals: 7,
        approved: true,
      },
    ])
    const lowercaseAddress = token.toLowerCase()
    if (!isStellarContractAddress(lowercaseAddress))
      throw new Error('Invalid fixture')

    await expect(
      getTokenByContract(lowercaseAddress, { strict: true }),
    ).resolves.toMatchObject({ address: token, symbol: 'LISTED' })
    expect(mocks.client).not.toHaveBeenCalled()
  })

  it('ignores a token-list result for a different contract', async () => {
    mocks.tokenList.mockResolvedValue([
      {
        chainId: StellarChainId.STELLAR,
        address: contractAddresses.TOKENS.XLM,
        name: 'Stellar',
        symbol: 'XLM',
        decimals: 7,
        approved: true,
      },
    ])

    await expect(
      getTokenByContract(token, { strict: true }),
    ).resolves.toMatchObject({ address: token, symbol: 'TOKEN' })
    expect(mocks.client).toHaveBeenCalledWith({ contractId: token })
  })

  it.each([0, 7])(
    'accepts successful metadata with %s decimals',
    async (decimals) => {
      mocks.decimals.mockResolvedValue({ result: decimals })

      await expect(
        getTokenByContract(token, { strict: true }),
      ).resolves.toMatchObject({ address: token, decimals, symbol: 'TOKEN' })
    },
  )

  it.each(['name', 'symbol', 'decimals'] as const)(
    'rejects when the contract cannot return %s',
    async (method) => {
      const error = new Error('Contract instance or function is missing')
      mocks[method].mockRejectedValue(error)

      await expect(getTokenByContract(token, { strict: true })).rejects.toBe(
        error,
      )
    },
  )

  it('rejects errors creating the contract client', async () => {
    const error = new Error('Invalid contract')
    mocks.client.mockImplementation(() => {
      throw error
    })

    await expect(getTokenByContract(token, { strict: true })).rejects.toBe(
      error,
    )
  })

  it('preserves the existing metadata fallback unless strict is requested', async () => {
    const error = new Error('Contract instance is missing')
    mocks.name.mockRejectedValue(error)
    mocks.symbol.mockRejectedValue(error)
    mocks.decimals.mockRejectedValue(error)

    await expect(getTokenByContract(token)).resolves.toMatchObject({
      address: token,
      symbol: `${token.slice(0, 6)}...${token.slice(-4)}`,
      decimals: 0,
      origin: 'unknown',
    })
  })
})
