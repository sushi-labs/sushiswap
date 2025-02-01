import { AlgebraV1BaseProvider } from './AlgebraV1Base.js'

export const globalStateAbi = [
  {
    inputs: [],
    name: 'globalState',
    outputs: [
      { internalType: 'uint160', name: 'price', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'lastFee', type: 'uint16' },
      { internalType: 'uint8', name: 'pluginConfig', type: 'uint8' },
      { internalType: 'uint16', name: 'communityFee', type: 'uint16' },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export abstract class AlgebraV2BaseProvider extends AlgebraV1BaseProvider {
  override gloablStateAbi = globalStateAbi as any
}
