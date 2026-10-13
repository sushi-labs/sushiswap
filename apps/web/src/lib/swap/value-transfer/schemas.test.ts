import { describe, expect, it } from 'vitest'
import {
  valueTransferBuildUserStepsResponseSchema,
  valueTransferQuoteRequestSchema,
  valueTransferQuoteResponseSchema,
  valueTransferSolanaTransactionStepSchema,
  valueTransferStellarTransactionStepSchema,
  valueTransferUserStepSchema,
} from './schemas'

const address = '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098'
const request = {
  srcChainKey: 'base',
  dstChainKey: 'arbitrum',
  srcTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  dstTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  srcWalletAddress: address,
  dstWalletAddress: address,
  amount: '10000000',
}
const quote = {
  id: '0x1234',
  srcAmount: '10000000',
  dstAmount: '9985071',
  dstAmountMin: '9885220',
  srcAmountUsd: '9.99',
  dstAmountUsd: '9.98',
  feeUsd: '0.01',
  feePercent: '0.14929',
  duration: { estimated: '1813935.0649350649' },
  fees: [],
  routeSteps: [{ type: 'CCTP_V2', srcChainKey: 'base', description: 'CCTP' }],
  expiresAt: '1791419467000',
}

describe('Value Transfer schemas', () => {
  it('accepts observed quote shapes, including absent Solana steps and numeric expiration', () => {
    expect(
      valueTransferQuoteResponseSchema.parse({ quotes: [quote], tokens: [] })
        .quotes[0],
    ).toEqual(quote)
  })

  it.each(['0', '-1', '1.5', '1e18', '1'.repeat(101)])(
    'rejects unsafe raw input amount %s',
    (amount) => {
      expect(
        valueTransferQuoteRequestSchema.safeParse({ ...request, amount })
          .success,
      ).toBe(false)
    },
  )

  it('preserves documented fee tolerance and strips unsupported options', () => {
    const options = { feeTolerance: { type: 'PERCENT', amount: 0.5 } }
    expect(
      valueTransferQuoteRequestSchema.parse({
        ...request,
        options: { ...options, partnerFee: 500, slippage: 50 },
        apiUrl: 'https://other.example',
      }),
    ).toEqual({ ...request, options })
  })

  it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid fee tolerance %s',
    (amount) => {
      expect(
        valueTransferQuoteRequestSchema.safeParse({
          ...request,
          options: { feeTolerance: { type: 'PERCENT', amount } },
        }).success,
      ).toBe(false)
    },
  )

  it.each([0, 100])(
    'accepts documented fee tolerance boundary %s',
    (amount) => {
      expect(
        valueTransferQuoteRequestSchema.safeParse({
          ...request,
          options: { feeTolerance: { type: 'PERCENT', amount } },
        }).success,
      ).toBe(true)
    },
  )

  it('refuses same-chain requests', () => {
    expect(
      valueTransferQuoteRequestSchema.safeParse({
        ...request,
        dstChainKey: request.srcChainKey,
      }).success,
    ).toBe(false)
  })

  it('rejects a minimum output greater than the quoted output', () => {
    expect(
      valueTransferQuoteResponseSchema.safeParse({
        quotes: [{ ...quote, dstAmountMin: '10000000' }],
        tokens: [],
      }).success,
    ).toBe(false)
  })

  it('accepts observed Stellar operations and Solana encoded transactions', () => {
    const userSteps = [
      {
        type: 'TRANSACTION',
        chainType: 'STELLAR',
        chainKey: 'stellar',
        description: 'bridge',
        signerAddress:
          'GDMTVHLWJTHSUDMZVVMXXH6VJHA2ZV3HNG5LYNAZ6RTWB7GISM6PGTUV',
        transaction: {
          encoded: { operationsXDR: ['AAAAAA=='], inclusionFee: '200' },
        },
      },
      {
        type: 'TRANSACTION',
        chainType: 'SOLANA',
        chainKey: 'solana',
        description: 'bridge',
        signerAddress: 'Dz93pUVjXuaMnSsPSn7V99V4cUzhKoQdx9ECwZJZiafG',
        transaction: { encoded: { encoding: 'base64', data: 'AQAAAA==' } },
      },
    ]
    expect(
      valueTransferBuildUserStepsResponseSchema.parse({ userSteps }),
    ).toEqual({ userSteps })
  })

  it.each([
    {
      schema: valueTransferSolanaTransactionStepSchema,
      chainType: 'SOLANA',
      chainKey: 'solana',
      transaction: { encoded: { encoding: 'base64', data: 'AQAAAA==' } },
    },
    {
      schema: valueTransferStellarTransactionStepSchema,
      chainType: 'STELLAR',
      chainKey: 'stellar',
      transaction: {
        encoded: { operationsXDR: ['AAAAAA=='], inclusionFee: '200' },
      },
    },
  ])(
    'rejects an EVM signer for a $chainType transaction',
    ({ schema, chainType, chainKey, transaction }) => {
      expect(
        schema.safeParse({
          type: 'TRANSACTION',
          chainType,
          chainKey,
          description: 'bridge',
          signerAddress: address,
          transaction,
        }).success,
      ).toBe(false)
    },
  )

  it('fails closed for unsupported or malformed execution instructions', () => {
    expect(
      valueTransferUserStepSchema.safeParse({
        type: 'TRANSACTION',
        chainType: 'EVM',
        chainKey: 'base',
        description: 'bridge',
        signerAddress: address,
        transaction: {
          encoded: { chainId: 8453, to: address, data: 'not-hex', value: '-1' },
        },
      }).success,
    ).toBe(false)
    expect(
      valueTransferBuildUserStepsResponseSchema.safeParse({ userSteps: [] })
        .success,
    ).toBe(false)
  })
})
