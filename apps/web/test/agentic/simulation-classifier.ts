import { isRecord } from './json-rpc'

export type SimulationClassification =
  | 'insufficient-allowance'
  | 'insufficient-balance'
  | 'minimum-output-violation'
  | 'out-of-gas'
  | 'success'
  | 'token-transfer-error'
  | 'unknown-revert'

export interface CallTrace {
  readonly calls?: readonly CallTrace[]
  readonly error?: string
  readonly gasUsed?: string
  readonly output?: string
  readonly revertReason?: string
  readonly type?: string
}

export interface ClassifiedSimulation {
  readonly classification: SimulationClassification
  readonly message?: string
  readonly trace: CallTrace
}

const INSUFFICIENT_ALLOWANCE_PATTERNS = [
  /allowance/i,
  /insufficient approval/i,
  /transfer amount exceeds allowance/i,
]

const INSUFFICIENT_BALANCE_PATTERNS = [
  /balance too low/i,
  /exceeds balance/i,
  /insufficient balance/i,
  /transfer amount exceeds balance/i,
]

const MINIMUM_OUTPUT_PATTERNS = [
  /amount out below minimum/i,
  /insufficient output/i,
  /minimum output/i,
  /minimum received/i,
  /too little received/i,
]

const OUT_OF_GAS_PATTERNS = [
  /gas required exceeds allowance/i,
  /intrinsic gas too low/i,
  /out of gas/i,
]

const TOKEN_TRANSFER_PATTERNS = [
  /safeerc20/i,
  /stf\b/i,
  /token transfer/i,
  /transfer_from_failed/i,
  /transfer failed/i,
  /transferhelper/i,
]

export function classifyTrace(value: unknown): ClassifiedSimulation {
  const trace = parseCallTrace(value)
  if (!trace.error && !trace.revertReason) {
    return { classification: 'success', trace }
  }

  const message = collectTraceMessages(trace).join(' | ')

  if (matchesAny(message, OUT_OF_GAS_PATTERNS)) {
    return { classification: 'out-of-gas', message, trace }
  }
  if (matchesAny(message, INSUFFICIENT_ALLOWANCE_PATTERNS)) {
    return { classification: 'insufficient-allowance', message, trace }
  }
  if (matchesAny(message, INSUFFICIENT_BALANCE_PATTERNS)) {
    return { classification: 'insufficient-balance', message, trace }
  }
  if (matchesAny(message, MINIMUM_OUTPUT_PATTERNS)) {
    return { classification: 'minimum-output-violation', message, trace }
  }
  if (matchesAny(message, TOKEN_TRANSFER_PATTERNS)) {
    return { classification: 'token-transfer-error', message, trace }
  }

  return { classification: 'unknown-revert', message, trace }
}

export function parseCallTrace(value: unknown): CallTrace {
  if (!isRecord(value))
    throw new Error('Trace result is not a callTracer frame')

  const calls = value.calls
  if (calls !== undefined && !Array.isArray(calls)) {
    throw new Error('Trace calls are malformed')
  }

  return {
    calls: calls?.map(parseCallTrace),
    error: optionalString(value.error),
    gasUsed: optionalString(value.gasUsed),
    output: optionalString(value.output),
    revertReason: optionalString(value.revertReason),
    type: optionalString(value.type),
  }
}

export function simulationErrorMessage(
  classification: Exclude<SimulationClassification, 'success'>,
): string {
  switch (classification) {
    case 'insufficient-allowance':
      return 'The token allowance is insufficient for this swap.'
    case 'insufficient-balance':
      return 'The sender balance is insufficient for this swap.'
    case 'minimum-output-violation':
      return 'The swap would return less than the transaction minimum output.'
    case 'out-of-gas':
      return 'The swap simulation ran out of gas.'
    case 'token-transfer-error':
      return 'A token transfer failed during simulation.'
    case 'unknown-revert':
      return 'The swap reverted for an unknown reason.'
  }
}

function collectTraceMessages(trace: CallTrace): string[] {
  const own = [trace.error, trace.revertReason].filter(
    (message): message is string => Boolean(message),
  )
  return [...own, ...(trace.calls?.flatMap(collectTraceMessages) ?? [])]
}

function matchesAny(message: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(message))
}

function optionalString(value: unknown): string | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'string') throw new Error('Trace field is not a string')
  return value
}
