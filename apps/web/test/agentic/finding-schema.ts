import * as z from 'zod'
import { tokenBehaviorScreeningSchema } from './token-behavior-scanner'

const hexQuantity = z.string().regex(/^0x[0-9a-f]+$/i)
const address = z.string().regex(/^0x[0-9a-f]{40}$/i)
const transactionHash = z.string().regex(/^0x[0-9a-f]{64}$/i)

export const findingSchema = z.object({
  actual: z.string().min(1),
  artifacts: z.object({
    consoleErrors: z.array(z.string()),
    networkFailures: z.array(z.string()),
    playwrightTrace: z.string().optional(),
    productionQuoteRequest: z.unknown().optional(),
    productionQuoteResponse: z.unknown().optional(),
    screenshots: z.array(z.string()),
    simulationResult: z.unknown().optional(),
    tokenBehaviorScreening: tokenBehaviorScreeningSchema.optional(),
    traceClassification: z.string().optional(),
    video: z.string().optional(),
  }),
  environment: z.object({
    appUrl: z.string().url(),
    browser: z.string(),
    chainId: z.number().int().positive(),
    commit: z.string().min(7),
    forkBlockNumber: z.string().regex(/^\d+$/),
    forkDashboardUrl: z.string().url().optional(),
    sender: address,
    seed: z.number().int(),
    tokenAddresses: z.array(address),
    viewport: z.object({ height: z.number().int(), width: z.number().int() }),
  }),
  evidence: z.object({
    allowanceAfter: z.string().regex(/^\d+$/).optional(),
    allowanceBefore: z.string().regex(/^\d+$/).optional(),
    balancesAfter: z.record(z.string(), z.string().regex(/^-?\d+$/)),
    balancesBefore: z.record(z.string(), z.string().regex(/^-?\d+$/)),
    gasLimit: hexQuantity.optional(),
    gasUsed: hexQuantity.optional(),
    logs: z.array(z.unknown()),
    receiptStatus: z.enum(['reverted', 'success']).optional(),
    transactionHash: transactionHash.optional(),
    transactionRequest: z.unknown().optional(),
  }),
  expected: z.string().min(1),
  fingerprint: z.string().min(1),
  minimalSteps: z.array(z.string()).min(1),
  rpcFaultSchedule: z.array(z.unknown()),
  scenario: z.record(z.string(), z.unknown()),
  severity: z.enum(['critical', 'high', 'low', 'medium']),
  suspectedOwner: z.enum([
    'frontend',
    'harness',
    'rpc-provider',
    'route-drift',
    'swap-api',
    'token',
    'wallet',
  ]),
  title: z.string().min(1),
  version: z.literal(1),
})

export type AgenticFinding = z.infer<typeof findingSchema>

export const quarantineSchema = z.object({
  evidence: z.string().min(1),
  expiresAt: z.string().date(),
  fingerprint: z.string().min(1),
  owner: z.string().min(1),
  reason: z.string().min(1),
})

export type QuarantineRecord = z.infer<typeof quarantineSchema>
