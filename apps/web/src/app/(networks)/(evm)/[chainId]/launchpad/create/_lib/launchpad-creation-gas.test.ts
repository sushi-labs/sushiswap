import { EvmChainId } from 'sushi/evm'
import { expect, it } from 'vitest'
import { getLaunchpadCreationGas } from './launchpad-creation-gas'

it('adds launch headroom without exceeding Arc’s transaction cap', () => {
  expect(getLaunchpadCreationGas(11_612_333n, EvmChainId.ARC)).toBe(13_934_799n)
  expect(getLaunchpadCreationGas(15_000_000n, EvmChainId.ARC)).toBe(16_777_216n)
  expect(getLaunchpadCreationGas(16_777_216n, EvmChainId.ARC)).toBe(16_777_216n)
  expect(() => getLaunchpadCreationGas(16_777_217n, EvmChainId.ARC)).toThrow(
    'This launch exceeds Arc’s per-transaction gas limit.',
  )
  expect(getLaunchpadCreationGas(15_000_000n, EvmChainId.ROBINHOOD)).toBe(
    18_000_000n,
  )
})
