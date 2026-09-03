import { STELLAR_USDT0 } from 'sushi/stellar'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  assertStellarUsdt0Recipient,
  encodeStellarLayerZeroRecipient,
} from './stellar'

const { loadAccount } = vi.hoisted(() => ({ loadAccount: vi.fn() }))

vi.mock('@stellar/stellar-sdk', async (importOriginal) => {
  const sdk = await importOriginal<typeof import('@stellar/stellar-sdk')>()
  return { ...sdk, Horizon: { Server: vi.fn(() => ({ loadAccount })) } }
})
vi.mock('src/app/(networks)/(non-evm)/stellar/_common/lib/constants', () => ({
  HORIZON_URL: 'https://horizon.stellar.org',
  NETWORK_PASSPHRASE: 'Public Global Stellar Network ; September 2015',
  RPC_URL: 'https://mainnet.sorobanrpc.com',
  RPC_HEADERS: {},
}))

const ACCOUNT = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
const trustline = {
  asset_type: 'credit_alphanum12',
  asset_code: 'USDT0',
  asset_issuer: STELLAR_USDT0[-4].issuer,
  balance: '1.0000000',
  limit: '10.0000000',
  buying_liabilities: '2.0000000',
  is_authorized: true,
}

describe('Stellar USDT0 safety', () => {
  beforeEach(() => {
    loadAccount.mockReset()
  })

  it('encodes the raw 32-byte public key rather than the Stellar address text', () => {
    expect(encodeStellarLayerZeroRecipient(ACCOUNT)).toBe(
      `0x${'00'.repeat(32)}`,
    )
  })

  it('accepts an authorized trustline with enough remaining capacity', async () => {
    loadAccount.mockResolvedValue({ balances: [trustline] })
    await expect(
      assertStellarUsdt0Recipient(ACCOUNT, 70_000_000n),
    ).resolves.toBeUndefined()
  })

  it.each([
    [],
    [{ ...trustline, asset_issuer: ACCOUNT }],
    [{ ...trustline, is_authorized: false }],
  ])(
    'rejects a missing or unauthorized canonical trustline',
    async (...balances) => {
      loadAccount.mockResolvedValue({ balances })
      await expect(
        assertStellarUsdt0Recipient(ACCOUNT, 10_000_000n),
      ).rejects.toThrow('authorized USDT0 trustline')
    },
  )

  it('subtracts buying liabilities when checking capacity', async () => {
    loadAccount.mockResolvedValue({ balances: [trustline] })
    await expect(
      assertStellarUsdt0Recipient(ACCOUNT, 70_000_001n),
    ).rejects.toThrow('limit is too low')
  })

  it('fails closed when the destination account cannot be loaded', async () => {
    loadAccount.mockRejectedValue(new Error('Account not found'))
    await expect(assertStellarUsdt0Recipient(ACCOUNT, 1n)).rejects.toThrow(
      'Account not found',
    )
  })
})
