import { isChainId } from 'sushi'
import { expect, test } from 'vitest'
import { POOL_SUPPORTED_NETWORKS, SUPPORTED_NETWORKS } from './config'

test('network selectors only include chains supported by the SDK', () => {
  expect(
    [...SUPPORTED_NETWORKS, ...POOL_SUPPORTED_NETWORKS].every(isChainId),
  ).toBe(true)
})
