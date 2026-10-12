import { Asset, Horizon, Networks } from '@stellar/stellar-sdk'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  isStellarContractAddress,
} from 'sushi/stellar'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ read: vi.fn(), name: vi.fn() }))
vi.mock('./client', () => ({
  SorobanClient: { getContractData: mocks.read },
  getTokenContractClient: () => ({ name: mocks.name }),
}))
const usdc = STELLAR_USDC[StellarChainId.STELLAR]
const usdeIssuer = 'GDJ5BNU5NN6NQ54D7OX6NQTUYNBZ42CAT33QGM5BIQ2QIYADAC5ICH47'
const usdeContract = 'CCNOV6XVI2O5BSTA3232GIRUQULDEBV7IWGKM6QKI6II5OIIQTU24JJN'
let helpers: typeof import('./trustline-helpers')
function contract(executable: string) {
  return {
    val: {
      contractData: () => ({
        val: () => ({
          instance: () => ({
            executable: () => ({ switch: () => ({ name: executable }) }),
          }),
        }),
      }),
    },
  }
}
beforeEach(async () => {
  vi.resetModules()
  vi.clearAllMocks()
  helpers = await import('./trustline-helpers')
  mocks.read.mockResolvedValue(contract('contractExecutableStellarAsset'))
  mocks.name.mockResolvedValue({ result: `${usdc.symbol}:${usdc.issuer}` })
})
describe('trustline contract identity', () => {
  it('recognizes native XLM by address without a lookup', async () => {
    expect(
      await helpers.checkTrustlineRequired(
        STELLAR_XLM[StellarChainId.STELLAR].address,
        'XLM',
      ),
    ).toEqual({ required: false, assetCode: null, issuer: null })
    expect(mocks.read).not.toHaveBeenCalled()
  })
  it('resolves an unindexed SAC from its on-chain name and verifies its address', async () => {
    expect(
      await helpers.checkTrustlineRequired(usdc.address, usdc.symbol),
    ).toEqual({ required: true, assetCode: usdc.symbol, issuer: usdc.issuer })
    expect(mocks.name).toHaveBeenCalledOnce()
  })
  it.each([undefined, usdeIssuer] as const)(
    'resolves and caches the case-sensitive asset code with issuer %s',
    async (issuer) => {
      mocks.name.mockResolvedValue({ result: `USDE:${usdeIssuer}` })
      const expected = {
        required: true,
        assetCode: 'USDE',
        issuer: usdeIssuer,
      }
      expect(
        await helpers.checkTrustlineRequired(usdeContract, 'USDe', issuer),
      ).toEqual(expected)
      expect(
        await helpers.checkTrustlineRequired(usdeContract, 'USDe', issuer),
      ).toEqual(expected)
      expect(mocks.read).toHaveBeenCalledOnce()
      expect(mocks.name).toHaveBeenCalledOnce()
      expect(new Asset('USDE', usdeIssuer).contractId(Networks.PUBLIC)).toBe(
        usdeContract,
      )
      expect(
        new Asset('USDe', usdeIssuer).contractId(Networks.PUBLIC),
      ).not.toBe(usdeContract)
    },
  )
  it('rejects a conflicting supplied issuer even after caching the asset', async () => {
    mocks.name.mockResolvedValue({ result: `USDE:${usdeIssuer}` })
    await helpers.checkTrustlineRequired(usdeContract, 'USDe')
    await expect(
      helpers.checkTrustlineRequired(usdeContract, 'USDe', usdc.issuer),
    ).rejects.toThrow('Unable to resolve the asset issuer')
  })
  it('does not trust a token merely because its symbol is XLM', async () => {
    const address = new Asset('XLM', usdc.issuer).contractId(Networks.PUBLIC)
    if (!isStellarContractAddress(address)) throw new Error('Invalid fixture')
    mocks.name.mockResolvedValue({ result: `XLM:${usdc.issuer}` })
    expect(
      (await helpers.checkTrustlineRequired(address, 'XLM')).required,
    ).toBe(true)
  })
  it('allows custom tokens only after confirming a Wasm executable', async () => {
    mocks.read.mockResolvedValue(contract('contractExecutableWasm'))
    expect(
      await helpers.checkTrustlineRequired(usdc.address, 'CUSTOM'),
    ).toEqual({ required: false, assetCode: null, issuer: null })
    expect(mocks.name).not.toHaveBeenCalled()
  })
  it('does not cache a failed lookup as no trustline needed', async () => {
    mocks.read.mockRejectedValueOnce(new Error('RPC unavailable'))
    await expect(
      helpers.checkTrustlineRequired(usdc.address, usdc.symbol),
    ).rejects.toThrow('RPC unavailable')
    expect(
      (await helpers.checkTrustlineRequired(usdc.address, usdc.symbol))
        .required,
    ).toBe(true)
    expect(mocks.read).toHaveBeenCalledTimes(2)
  })
  it('rejects unresolved or mismatched SAC identity', async () => {
    mocks.name.mockResolvedValue({ result: 'USDC' })
    await expect(
      helpers.checkTrustlineRequired(usdc.address, usdc.symbol),
    ).rejects.toThrow('Unable to resolve')
    mocks.name.mockResolvedValue({ result: `FAKE:${usdc.issuer}` })
    await expect(
      helpers.checkTrustlineRequired(usdc.address, 'FAKE'),
    ).rejects.toThrow('does not match')
  })
  it('propagates a failed account check instead of asking for a duplicate trustline', async () => {
    const load = vi
      .spyOn(Horizon.Server.prototype, 'loadAccount')
      .mockRejectedValueOnce(new Error('Horizon unavailable'))
    await expect(
      helpers.hasTrustline(
        'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF',
        usdc.symbol,
        usdc.issuer!,
      ),
    ).rejects.toThrow('Horizon unavailable')
    load.mockRestore()
  })
})
