import { describe, expect, it } from 'vitest'
import {
  defaultSwapEdgeConfig,
  parseSwapEdgeConfig,
} from './get-swap-edge-config'

describe('parseSwapEdgeConfig', () => {
  it('accepts a valid maintenance config', () => {
    expect(parseSwapEdgeConfig({ maintenance: true })).toEqual({
      maintenance: true,
    })
  })

  it.each([undefined, null, {}, { maintenance: 'true' }])(
    'fails open for malformed config: %j',
    (value) => {
      expect(parseSwapEdgeConfig(value)).toEqual(defaultSwapEdgeConfig)
    },
  )
})
