import type { EvmAddress } from 'sushi/evm'
import type { TestedChainId } from './tested-chains'

export type AmountBucket = 'large' | 'near-balance' | 'safe' | 'tiny'
export type AllowanceState =
  | 'exact'
  | 'insufficient'
  | 'stale-cache'
  | 'sufficient'
  | 'unlimited'
  | 'zero'
export type SlippageMode = 'custom' | 'default' | 'tight'
export type WalletMode = 'injected' | 'mock'
export type Viewport = 'desktop' | 'mobile'
export type ScenarioTier = 'discovery' | 'matrix' | 'quirk' | 'smoke'

export interface ScenarioDimensions {
  readonly allowanceState: AllowanceState
  readonly amountBucket: AmountBucket
  readonly chainId: TestedChainId
  readonly inputToken: EvmAddress
  readonly outputToken: EvmAddress
  readonly rpcFaultProfile: string
  readonly seed: number
  readonly slippageMode: SlippageMode
  readonly viewport: Viewport
  readonly walletMode: WalletMode
}

export interface AgenticScenario extends ScenarioDimensions {
  readonly key: string
  readonly tier: ScenarioTier
}

export interface ScenarioSpace {
  readonly allowanceStates: readonly AllowanceState[]
  readonly amountBuckets: readonly AmountBucket[]
  readonly chainIds: readonly TestedChainId[]
  readonly inputTokens: readonly EvmAddress[]
  readonly outputTokens: readonly EvmAddress[]
  readonly rpcFaultProfiles: readonly string[]
  readonly seeds: readonly number[]
  readonly slippageModes: readonly SlippageMode[]
  readonly viewports: readonly Viewport[]
  readonly walletModes: readonly WalletMode[]
}

type DimensionName = keyof ScenarioDimensions

export function generatePairwiseScenarios(
  tier: ScenarioTier,
  space: ScenarioSpace,
): readonly AgenticScenario[] {
  const dimensions = scenarioDimensions(space)
  for (const [name, values] of dimensions) {
    if (values.length === 0)
      throw new Error(`Scenario dimension ${name} is empty`)
  }

  const defaults = Object.fromEntries(
    dimensions.map(([name, values]) => [name, values[0]]),
  ) as unknown as ScenarioDimensions
  if (defaults.inputToken === defaults.outputToken) {
    const differentOutput = space.outputTokens.find(
      (token) => token !== defaults.inputToken,
    )
    if (!differentOutput) {
      throw new Error('Scenario space needs at least one distinct token pair')
    }
    Object.assign(defaults, { outputToken: differentOutput })
  }
  const candidates: ScenarioDimensions[] = [defaults]

  for (let left = 0; left < dimensions.length; left++) {
    for (let right = left + 1; right < dimensions.length; right++) {
      const [leftName, leftValues] = dimensions[left]
      const [rightName, rightValues] = dimensions[right]
      for (const leftValue of leftValues) {
        for (const rightValue of rightValues) {
          candidates.push({
            ...defaults,
            [leftName]: leftValue,
            [rightName]: rightValue,
          })
        }
      }
    }
  }

  const unique = new Map<string, AgenticScenario>()
  for (const candidate of candidates) {
    if (candidate.inputToken === candidate.outputToken) continue
    const key = scenarioKey(candidate)
    unique.set(key, { ...candidate, key, tier })
  }
  return [...unique.values()]
}

export function scenarioKey(scenario: ScenarioDimensions): string {
  return [
    scenario.chainId,
    scenario.inputToken.toLowerCase(),
    scenario.outputToken.toLowerCase(),
    scenario.amountBucket,
    scenario.allowanceState,
    scenario.slippageMode,
    scenario.walletMode,
    scenario.rpcFaultProfile,
    scenario.viewport,
    scenario.seed,
  ].join(':')
}

function scenarioDimensions(
  space: ScenarioSpace,
): readonly [DimensionName, readonly ScenarioDimensions[DimensionName][]][] {
  return [
    ['chainId', space.chainIds],
    ['inputToken', space.inputTokens],
    ['outputToken', space.outputTokens],
    ['amountBucket', space.amountBuckets],
    ['allowanceState', space.allowanceStates],
    ['slippageMode', space.slippageModes],
    ['walletMode', space.walletModes],
    ['rpcFaultProfile', space.rpcFaultProfiles],
    ['viewport', space.viewports],
    ['seed', space.seeds],
  ]
}
