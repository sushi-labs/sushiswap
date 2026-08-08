import type { JsonRpcRequest, JsonValue } from './json-rpc'

export type RpcFaultKind =
  | 'connection-reset'
  | 'delay'
  | 'drop-receipt'
  | 'http-error'
  | 'malformed-json'
  | 'missing-result'
  | 'stale-result'
  | 'timeout'
  | 'truncated-json'
  | 'underestimate-gas'
  | 'websocket-disconnect'
  | 'wrong-id'

export interface RpcFaultRule {
  readonly activateOn: number
  readonly duration: number
  readonly id: string
  readonly kind: RpcFaultKind
  readonly methods?: readonly string[]
  readonly options?: {
    readonly factorBps?: number
    readonly jitterMs?: number
    readonly latencyMs?: number
    readonly status?: 429 | 502 | 503
    readonly timeoutMs?: number
    readonly value?: JsonValue
  }
}

export interface RpcFaultProfile {
  readonly rules: readonly RpcFaultRule[]
  readonly seed: number
}

export interface ScheduledRpcFault {
  readonly activation: number
  readonly kind: RpcFaultKind
  readonly rule: RpcFaultRule
}

export class RpcFaultScheduler {
  private readonly counts = new Map<string, number>()
  private readonly profile: RpcFaultProfile

  constructor(profile: RpcFaultProfile) {
    assertFaultProfile(profile)
    this.profile = profile
  }

  schedule(request: Pick<JsonRpcRequest, 'method'>): ScheduledRpcFault[] {
    const methodCount = (this.counts.get(request.method) ?? 0) + 1
    this.counts.set(request.method, methodCount)

    return this.profile.rules.flatMap((rule) => {
      if (rule.methods && !rule.methods.includes(request.method)) return []
      const activation = methodCount - rule.activateOn
      if (activation < 0 || activation >= rule.duration) return []
      return [{ activation, kind: rule.kind, rule }]
    })
  }

  jitter(fault: ScheduledRpcFault): number {
    const limit = fault.rule.options?.jitterMs ?? 0
    if (limit === 0) return 0
    const random = deterministicFraction(
      `${this.profile.seed}:${fault.rule.id}:${fault.activation}`,
    )
    return Math.floor(random * (limit * 2 + 1)) - limit
  }

  reset(): void {
    this.counts.clear()
  }
}

export function assertFaultProfile(profile: RpcFaultProfile): void {
  if (!Number.isSafeInteger(profile.seed)) {
    throw new Error('RPC fault seed must be a safe integer')
  }

  const ids = new Set<string>()
  for (const rule of profile.rules) {
    if (ids.has(rule.id)) throw new Error(`Duplicate RPC fault id: ${rule.id}`)
    ids.add(rule.id)
    if (!Number.isSafeInteger(rule.activateOn) || rule.activateOn < 1) {
      throw new Error(`RPC fault ${rule.id} has an invalid activation count`)
    }
    if (!Number.isSafeInteger(rule.duration) || rule.duration < 1) {
      throw new Error(`RPC fault ${rule.id} has an invalid duration`)
    }
  }
}

export function deterministicFraction(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 0x1_0000_0000
}
