import {
  Account,
  SorobanDataBuilder,
  type rpc,
  xdr,
} from '@stellar/stellar-sdk'
import { isStellarAccountAddress } from 'sushi/stellar'
import { encodeFunctionData, erc20Abi } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import {
  assertValueTransferQuoteIsCurrent,
  assertValueTransferSolanaSignature,
  buildValueTransferStellarTransaction,
  validateValueTransferSolanaTransaction,
  validateValueTransferUserSteps,
} from './execution'
import {
  delegate,
  makeExecutionTrade,
  metadata,
  sender,
  solanaSteps,
  stellarSteps,
  wrapper,
} from './execution-test-fixtures'

const stellar = vi.hoisted(() => ({
  getAccount: vi.fn(),
  simulateTransaction: vi.fn(),
}))
vi.mock(
  'src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/client',
  () => ({ SorobanClient: stellar }),
)

describe('Value Transfer execution bounds', () => {
  it('accepts observed wrapped EVM and Aori transaction/signature routes', () => {
    for (const aori of [false, true]) {
      const trade = makeExecutionTrade(aori)
      expect(() =>
        validateValueTransferUserSteps(
          trade,
          trade.quote.userSteps ?? [],
          metadata,
        ),
      ).not.toThrow()
    }
  })

  it('rejects mismatched signers, networks, and increased transaction value', () => {
    for (const mutate of [
      (trade: ReturnType<typeof makeExecutionTrade>) => {
        const step = trade.quote.userSteps?.[0]
        if (step) step.signerAddress = wrapper
      },
      (trade: ReturnType<typeof makeExecutionTrade>) => {
        const step = trade.quote.userSteps?.[0]
        if (step?.type === 'TRANSACTION' && step.chainType === 'EVM')
          step.transaction.encoded.chainId = 1
      },
      (trade: ReturnType<typeof makeExecutionTrade>) => {
        const step = trade.quote.userSteps?.[1]
        if (step?.type === 'TRANSACTION' && step.chainType === 'EVM')
          step.transaction.encoded.value = String(trade.maxNativeFee + 1n)
      },
    ]) {
      const trade = makeExecutionTrade()
      mutate(trade)
      expect(() =>
        validateValueTransferUserSteps(
          trade,
          trade.quote.userSteps ?? [],
          metadata,
        ),
      ).toThrow()
    }
  })

  it('never approves the wrapper or an unknown spender and caps approval at the reviewed input', () => {
    for (const [spender, amount] of [
      [wrapper, 10_000_000n],
      [sender, 10_000_000n],
      [delegate, 10_000_001n],
    ] as const) {
      const trade = makeExecutionTrade()
      const step = trade.quote.userSteps?.[0]
      if (step?.type !== 'TRANSACTION' || step.chainType !== 'EVM')
        throw new Error('Missing fixture approval')
      step.transaction.encoded.data = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amount],
      })
      expect(() =>
        validateValueTransferUserSteps(
          trade,
          trade.quote.userSteps ?? [],
          metadata,
        ),
      ).toThrow('approval')
    }
  })

  it('allows zero allowance reset followed by an exact approval and transfer', () => {
    const trade = makeExecutionTrade()
    const approval = trade.quote.userSteps?.[0]
    if (approval?.type !== 'TRANSACTION' || approval.chainType !== 'EVM')
      throw new Error('Missing fixture approval')
    const reset = structuredClone(approval)
    reset.transaction.encoded.data = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [delegate, 0n],
    })
    expect(() =>
      validateValueTransferUserSteps(
        trade,
        [reset, ...(trade.quote.userSteps ?? [])],
        metadata,
      ),
    ).not.toThrow()
  })

  it('rejects changed Aori recipient, amount, token or expired order before signing', () => {
    for (const changes of [
      { recipient: wrapper },
      { inputAmount: '10000001' },
      { outputAmount: '1' },
      { inputToken: wrapper },
      { endTime: '1' },
    ]) {
      const trade = makeExecutionTrade(true)
      const step = trade.quote.userSteps?.[1]
      if (step?.type !== 'SIGNATURE')
        throw new Error('Missing signature fixture')
      Object.assign(step.signature.typedData.message, changes)
      expect(() =>
        validateValueTransferUserSteps(
          trade,
          trade.quote.userSteps ?? [],
          metadata,
        ),
      ).toThrow('signature')
    }
  })

  it('pins reviewed calldata and full typed-data order when rebuilding user steps', () => {
    for (const aori of [false, true]) {
      const trade = makeExecutionTrade(aori)
      const steps = structuredClone(trade.quote.userSteps ?? [])
      const step = steps[1]
      if (step?.type === 'TRANSACTION' && step.chainType === 'EVM')
        step.transaction.encoded.data = '0x1234'
      if (step?.type === 'SIGNATURE')
        step.signature.typedData.message.startTime = '1'
      expect(() =>
        validateValueTransferUserSteps(trade, steps, metadata),
      ).toThrow('changed')
    }
  })

  it('rejects expired quotes in both timestamp formats and mismatched reviewed amounts', () => {
    for (const expiresAt of ['1', '2020-01-01T00:00:00Z']) {
      const trade = makeExecutionTrade()
      trade.quote.expiresAt = expiresAt
      expect(() => assertValueTransferQuoteIsCurrent(trade)).toThrow('expired')
    }
    const trade = makeExecutionTrade()
    trade.quoteRequest.amount = '999999'
    expect(() => assertValueTransferQuoteIsCurrent(trade)).toThrow('reviewed')
  })
})

describe('Value Transfer Solana signing safety', () => {
  it('validates the fee payer and signed message against the built transaction', () => {
    const step = solanaSteps[0]
    if (step?.type !== 'TRANSACTION' || step.chainType !== 'SOLANA')
      throw new Error('Missing Solana fixture')
    const data = step.transaction.encoded.data
    expect(() =>
      validateValueTransferSolanaTransaction(data, step.signerAddress),
    ).not.toThrow()
    expect(() =>
      validateValueTransferSolanaTransaction(
        data,
        '11111111111111111111111111111111',
      ),
    ).toThrow('source wallet')
    expect(() =>
      assertValueTransferSolanaSignature(data, data, step.signerAddress),
    ).toThrow('signed Solana')
    const signed = Buffer.from(data, 'base64')
    signed[1] = 1
    expect(() =>
      assertValueTransferSolanaSignature(
        data,
        signed.toString('base64'),
        step.signerAddress,
      ),
    ).not.toThrow()
    signed[signed.length - 3] ^= 1
    expect(() =>
      assertValueTransferSolanaSignature(
        data,
        signed.toString('base64'),
        step.signerAddress,
      ),
    ).toThrow('signed Solana')
  })
})

describe('Value Transfer Stellar operation assembly', () => {
  function fixture() {
    const step = stellarSteps[0]
    if (
      step?.type !== 'TRANSACTION' ||
      step.chainType !== 'STELLAR' ||
      !isStellarAccountAddress(step.signerAddress)
    )
      throw new Error('Missing Stellar fixture')
    stellar.getAccount.mockResolvedValue(new Account(step.signerAddress, '100'))
    return { ...step.transaction.encoded, sourceAddress: step.signerAddress }
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
  it('assembles the actual API operation using current sequence and simulated resources', async () => {
    stellar.simulateTransaction.mockResolvedValue(successSimulation())
    const args = fixture()
    const transaction = await buildValueTransferStellarTransaction(args)
    expect(transaction.source).toBe(args.sourceAddress)
    expect(transaction.sequence).toBe('101')
    expect(transaction.fee).toBe('1200')
    expect(transaction.operations).toHaveLength(1)
    expect(transaction.operations[0]?.type).toBe('invokeHostFunction')
  })
  it('rejects simulation errors and restoration before signing', async () => {
    stellar.simulateTransaction.mockResolvedValue({
      id: '1',
      latestLedger: 100,
      error: 'insufficient balance',
    })
    await expect(
      buildValueTransferStellarTransaction(fixture()),
    ).rejects.toThrow('insufficient balance')
    stellar.simulateTransaction.mockResolvedValue({
      ...successSimulation(),
      restorePreamble: {
        minResourceFee: '2000',
        transactionData: new SorobanDataBuilder().setResourceFee('2000'),
      },
    })
    await expect(
      buildValueTransferStellarTransaction(fixture()),
    ).rejects.toThrow('restored')
  })
})
