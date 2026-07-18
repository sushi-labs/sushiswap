import { describe, expect, it } from 'vitest'
import type { UseLifiXSwapSelectedTradeRouteReturn } from '../xswap-provider'
import {
  type CrossChainSwapSubmission,
  StepState,
  crossChainSwapExecutionReducer,
  getCrossChainSwapStepStates,
  initialCrossChainSwapExecutionState,
} from './cross-chain-swap-execution'

type Submission = CrossChainSwapSubmission<1, 42161>

function submission(id: string): Submission {
  return {
    id,
    hash: `0x${id}`,
    route: {} as UseLifiXSwapSelectedTradeRouteReturn<1, 42161>,
    account: undefined,
    sourceChainId: 1,
    destinationChainId: 42161,
    groupTimestamp: 1,
    telemetry: {
      swapAmountUsd: '1',
      feeUsd: '0',
      recipient: 'N/A',
      detailsCollapsedState: 'open',
      wasDetailsTouched: 'no',
    },
  }
}

describe('crossChainSwapExecutionReducer', () => {
  it('models the source and bridge lifecycle', () => {
    const submitted = submission('first')
    let state = initialCrossChainSwapExecutionState<1, 42161>()

    state = crossChainSwapExecutionReducer(state, { type: 'START_SIGNING' })
    expect(state.phase).toBe('signing')

    state = crossChainSwapExecutionReducer(state, {
      type: 'BROADCAST',
      submission: submitted,
    })
    expect(state.phase).toBe('source-pending')

    state = crossChainSwapExecutionReducer(state, {
      type: 'RECEIPT_UNAVAILABLE',
      submissionId: submitted.id,
    })
    expect(state.phase).toBe('source-unknown')

    state = crossChainSwapExecutionReducer(state, {
      type: 'SOURCE_CONFIRMED',
      submissionId: submitted.id,
    })
    expect(state.phase).toBe('bridging')
    expect(getCrossChainSwapStepStates(state)).toEqual({
      source: StepState.Success,
      bridge: StepState.Pending,
      dest: StepState.NotStarted,
    })
  })

  it('ignores settlement events from stale submissions', () => {
    const first = submission('first')
    const second = submission('second')
    let state = crossChainSwapExecutionReducer(
      initialCrossChainSwapExecutionState<1, 42161>(),
      { type: 'BROADCAST', submission: first },
    )
    state = crossChainSwapExecutionReducer(state, {
      type: 'BROADCAST',
      submission: second,
    })

    const next = crossChainSwapExecutionReducer(state, {
      type: 'SOURCE_CONFIRMED',
      submissionId: first.id,
    })

    expect(next).toBe(state)
    expect(next.submission).toBe(second)
  })

  it('keeps a closed submission available for background tracking', () => {
    const submitted = submission('first')
    let state = crossChainSwapExecutionReducer(
      initialCrossChainSwapExecutionState<1, 42161>(),
      { type: 'BROADCAST', submission: submitted },
    )
    state = crossChainSwapExecutionReducer(state, { type: 'DIALOG_CLOSED' })
    state = crossChainSwapExecutionReducer(state, {
      type: 'SOURCE_CONFIRMED',
      submissionId: submitted.id,
    })

    expect(state).toMatchObject({
      phase: 'bridging',
      active: false,
      submission: submitted,
    })
  })

  it('maps LiFi completion to the final UI state', () => {
    const submitted = submission('first')
    const state = crossChainSwapExecutionReducer(
      crossChainSwapExecutionReducer(
        initialCrossChainSwapExecutionState<1, 42161>(),
        { type: 'BROADCAST', submission: submitted },
      ),
      {
        type: 'LIFI_COMPLETED',
        submissionId: submitted.id,
        partial: true,
      },
    )

    expect(state.phase).toBe('partial-success')
    expect(getCrossChainSwapStepStates(state).dest).toBe(
      StepState.PartialSuccess,
    )
  })
})
