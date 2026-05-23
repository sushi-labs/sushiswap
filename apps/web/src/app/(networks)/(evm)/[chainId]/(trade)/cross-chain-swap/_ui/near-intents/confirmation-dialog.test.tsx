import { describe, expect, it, vi } from 'vitest'

vi.mock('../lifi/confirmation-dialog', () => ({
  Divider: () => null,
  GetStateComponent: () => null,
  StepState: {
    Sign: 0,
    NotStarted: 1,
    Pending: 2,
    PartialSuccess: 3,
    Success: 4,
    Failed: 5,
  },
}))

import { StepState } from '../lifi/confirmation-dialog'
import { getNearIntentsStatusStepState } from './confirmation-dialog'

describe('getNearIntentsStatusStepState', () => {
  it('keeps the destination step idle while NEAR Intents is processing', () => {
    expect(getNearIntentsStatusStepState({ status: 'PROCESSING' })).toEqual({
      source: StepState.Success,
      execution: StepState.Pending,
    })
  })

  it('marks all steps complete when NEAR Intents succeeds', () => {
    expect(getNearIntentsStatusStepState({ status: 'SUCCESS' })).toEqual({
      source: StepState.Success,
      execution: StepState.Success,
    })
  })
})
