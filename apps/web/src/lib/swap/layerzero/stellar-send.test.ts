import {
  Account,
  Networks,
  SorobanDataBuilder,
  contract,
  rpc,
  xdr,
} from '@stellar/stellar-sdk'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LAYERZERO_STELLAR_OFT_ADDRESS } from './config'
import { buildStellarOftSend } from './stellar'
import type { LayerZeroSendParam } from './types'

vi.mock('src/app/(networks)/(non-evm)/stellar/_common/lib/constants', () => ({
  HORIZON_URL: 'https://horizon.stellar.org',
  NETWORK_PASSPHRASE: 'Public Global Stellar Network ; September 2015',
  RPC_URL: 'https://mainnet.sorobanrpc.com',
  RPC_HEADERS: {},
}))

const ACCOUNT = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
const spec = new contract.Spec([
  xdr.ScSpecEntry.scSpecEntryFunctionV0(
    new xdr.ScSpecFunctionV0({
      doc: '',
      name: 'send',
      inputs: [],
      outputs: [xdr.ScSpecTypeDef.scSpecTypeVoid()],
    }),
  ),
])
const client = new contract.Client(spec, {
  contractId: LAYERZERO_STELLAR_OFT_ADDRESS,
  networkPassphrase: Networks.PUBLIC,
  rpcUrl: 'https://mainnet.sorobanrpc.com',
})
const sendParam: LayerZeroSendParam = {
  dstEid: 30110,
  to: `0x${'00'.repeat(12)}${'11'.repeat(20)}`,
  amountLD: 10_000_000n,
  minAmountLD: 9_900_000n,
  extraOptions: '0x',
  composeMsg: '0x',
  oftCmd: '0x',
}

function successSimulation(): rpc.Api.SimulateTransactionSuccessResponse {
  return {
    id: '1',
    latestLedger: 100,
    events: [],
    _parsed: true,
    minResourceFee: '1000',
    transactionData: new SorobanDataBuilder().setResourceFee('1000'),
    result: { auth: [], retval: xdr.ScVal.scvVoid() },
  }
}

function buildSend(): Promise<contract.AssembledTransaction<unknown>> {
  return buildStellarOftSend({ from: ACCOUNT, sendParam, nativeFee: 500_000n })
}

function feeStats(p95: string): rpc.Api.GetFeeStatsResponse {
  const distribution = {
    min: '100',
    max: p95,
    mode: p95,
    p10: p95,
    p20: p95,
    p30: p95,
    p40: p95,
    p50: p95,
    p60: p95,
    p70: p95,
    p80: p95,
    p90: p95,
    p95,
    p99: p95,
    transactionCount: '100',
    ledgerCount: 50,
  }
  return {
    latestLedger: 100,
    sorobanInclusionFee: distribution,
    inclusionFee: { ...distribution, p95: '100' },
  }
}

describe('Stellar LayerZero send preparation with the real SDK builder', () => {
  beforeEach(() => {
    vi.spyOn(contract.Client, 'from').mockResolvedValue(client)
    vi.spyOn(spec, 'funcArgsToScVals').mockReturnValue([])
    vi.spyOn(rpc.Server.prototype, 'getAccount').mockResolvedValue(
      new Account(ACCOUNT, '100'),
    )
    vi.spyOn(rpc.Server.prototype, 'getFeeStats').mockResolvedValue(
      feeStats('200'),
    )
  })

  afterEach(() => vi.restoreAllMocks())

  it('rejects simulation errors even though the SDK returns a built envelope', async () => {
    vi.spyOn(rpc.Server.prototype, 'simulateTransaction').mockResolvedValue({
      id: '1',
      latestLedger: 100,
      events: [],
      _parsed: true,
      error: 'HostError: Error(Contract, #10)',
    })

    await expect(buildSend()).rejects.toThrow(
      'Stellar LayerZero simulation failed: HostError: Error(Contract, #10)',
    )
  })

  it('rejects a restore preamble before requesting a wallet signature', async () => {
    vi.spyOn(rpc.Server.prototype, 'simulateTransaction').mockResolvedValue({
      ...successSimulation(),
      result: { auth: [], retval: xdr.ScVal.scvVoid() },
      restorePreamble: {
        minResourceFee: '2000',
        transactionData: new SorobanDataBuilder().setResourceFee('2000'),
      },
    })

    await expect(buildSend()).rejects.toThrow('contract state must be restored')
  })

  it('returns an assembled transaction with the source and resource fee after success', async () => {
    vi.spyOn(rpc.Server.prototype, 'simulateTransaction').mockResolvedValue(
      successSimulation(),
    )

    const transaction = await buildSend()

    expect(transaction.built?.source).toBe(ACCOUNT)
    // Resource fee (1000) + twice the Soroban p95 inclusion fee (400).
    expect(transaction.built?.fee).toBe('1400')
    expect(transaction.built?.toEnvelope().v1().tx().ext().switch()).toBe(1)
  })

  it.each([
    ['0', 100n],
    ['100', 200n],
    ['1501', 3002n],
  ])(
    'uses current Soroban fees with a network-minimum floor (%s)',
    async (p95, inclusionFee) => {
      vi.mocked(rpc.Server.prototype.getFeeStats).mockResolvedValue(
        feeStats(p95),
      )
      vi.spyOn(rpc.Server.prototype, 'simulateTransaction').mockResolvedValue(
        successSimulation(),
      )

      const transaction = await buildSend()
      const resourceFee = transaction.built
        ?.toEnvelope()
        .v1()
        .tx()
        .ext()
        .sorobanData()
        .resourceFee()
        .toBigInt()

      expect(resourceFee).toBe(1000n)
      expect(BigInt(transaction.built?.fee ?? '0') - (resourceFee ?? 0n)).toBe(
        inclusionFee,
      )
    },
  )

  it.each(['-1', '1.5', 'NaN', ''])(
    'rejects invalid fee estimates (%s)',
    async (p95) => {
      vi.mocked(rpc.Server.prototype.getFeeStats).mockResolvedValue(
        feeStats(p95),
      )
      const simulate = vi.spyOn(rpc.Server.prototype, 'simulateTransaction')

      await expect(buildSend()).rejects.toThrow(
        'Invalid Stellar inclusion fee estimate',
      )
      expect(simulate).not.toHaveBeenCalled()
    },
  )

  it('surfaces fee RPC failures instead of falling back to an insufficient fee', async () => {
    vi.mocked(rpc.Server.prototype.getFeeStats).mockRejectedValue(
      new Error('Fee RPC unavailable'),
    )
    const simulate = vi.spyOn(rpc.Server.prototype, 'simulateTransaction')

    await expect(buildSend()).rejects.toThrow('Fee RPC unavailable')
    expect(simulate).not.toHaveBeenCalled()
  })
})
