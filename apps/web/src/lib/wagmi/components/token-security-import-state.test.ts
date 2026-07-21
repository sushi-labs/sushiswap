import { describe, expect, it } from 'vitest'
import {
  combineTokenSecurityImportStates,
  getTokenSecurityImportState,
} from './token-security-import-state'

const baseState = {
  required: true,
  isLoading: false,
  isFetching: false,
  isError: false,
  isAvailable: undefined,
}

describe('token security import state', () => {
  it('requires a terminal scan result before ordinary import', () => {
    expect(getTokenSecurityImportState(baseState)).toBe('scanning')
    expect(
      getTokenSecurityImportState({ ...baseState, isAvailable: true }),
    ).toBe('ready')
  })

  it('distinguishes unavailable and unsupported scans', () => {
    expect(
      getTokenSecurityImportState({ ...baseState, isAvailable: false }),
    ).toBe('unavailable')
    expect(getTokenSecurityImportState({ ...baseState, required: false })).toBe(
      'not-required',
    )
    expect(getTokenSecurityImportState({ ...baseState, isError: true })).toBe(
      'unavailable',
    )
  })

  it('shows retry fetches as scanning until they recover', () => {
    expect(
      getTokenSecurityImportState({
        ...baseState,
        isFetching: true,
        isAvailable: false,
      }),
    ).toBe('scanning')
  })

  it('combines multiple token scans conservatively', () => {
    expect(combineTokenSecurityImportStates(['ready', 'scanning'])).toBe(
      'scanning',
    )
    expect(combineTokenSecurityImportStates(['ready', 'unavailable'])).toBe(
      'unavailable',
    )
    expect(combineTokenSecurityImportStates(['not-required', 'ready'])).toBe(
      'ready',
    )
  })
})
