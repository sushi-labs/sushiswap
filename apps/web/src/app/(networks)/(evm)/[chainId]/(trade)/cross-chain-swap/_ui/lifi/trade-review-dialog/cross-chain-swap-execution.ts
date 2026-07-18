import type { LifiXSwapSupportedChainId } from 'src/config'
import type { UseLifiXSwapSelectedTradeRouteReturn } from '../xswap-provider'

export enum StepState {
  Sign = 0,
  NotStarted = 1,
  Pending = 2,
  PartialSuccess = 3,
  Success = 4,
  Failed = 5,
  Unknown = 6,
}

export interface CrossChainSwapSubmission<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> {
  id: string
  hash: TxHashFor<TChainId0>
  route: UseLifiXSwapSelectedTradeRouteReturn<TChainId0, TChainId1>
  account: WalletAddressFor<TChainId0> | undefined
  sourceChainId: TChainId0
  destinationChainId: TChainId1
  groupTimestamp: number
  telemetry: {
    swapAmountUsd: string
    feeUsd: string
    recipient: string
    detailsCollapsedState: 'closed' | 'open'
    wasDetailsTouched: 'no' | 'yes'
  }
}

type SubmissionPhase =
  | 'source-pending'
  | 'source-unknown'
  | 'source-failed'
  | 'bridging'
  | 'partial-success'
  | 'success'

export type CrossChainSwapExecutionState<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> =
  | { phase: 'idle'; active: false; submission: undefined }
  | { phase: 'signing'; active: true; submission: undefined }
  | {
      phase: 'source-failed'
      active: boolean
      submission: CrossChainSwapSubmission<TChainId0, TChainId1> | undefined
    }
  | {
      phase: Exclude<SubmissionPhase, 'source-failed'>
      active: boolean
      submission: CrossChainSwapSubmission<TChainId0, TChainId1>
    }

export type CrossChainSwapExecutionEvent<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> =
  | { type: 'START_SIGNING' }
  | { type: 'WRITE_FAILED' }
  | {
      type: 'BROADCAST'
      submission: CrossChainSwapSubmission<TChainId0, TChainId1>
    }
  | { type: 'RECEIPT_ATTEMPT'; submissionId: string }
  | { type: 'RECEIPT_UNAVAILABLE'; submissionId: string }
  | { type: 'SOURCE_CONFIRMED'; submissionId: string }
  | { type: 'SOURCE_FAILED'; submissionId: string }
  | {
      type: 'LIFI_COMPLETED'
      submissionId: string
      partial: boolean
    }
  | { type: 'DIALOG_CLOSED' }

export function initialCrossChainSwapExecutionState<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(): CrossChainSwapExecutionState<TChainId0, TChainId1> {
  return { phase: 'idle', active: false, submission: undefined }
}

export function crossChainSwapExecutionReducer<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(
  state: CrossChainSwapExecutionState<TChainId0, TChainId1>,
  event: CrossChainSwapExecutionEvent<TChainId0, TChainId1>,
): CrossChainSwapExecutionState<TChainId0, TChainId1> {
  switch (event.type) {
    case 'START_SIGNING':
      return { phase: 'signing', active: true, submission: undefined }
    case 'WRITE_FAILED':
      return { phase: 'source-failed', active: true, submission: undefined }
    case 'BROADCAST':
      return {
        phase: 'source-pending',
        active: true,
        submission: event.submission,
      }
    case 'DIALOG_CLOSED':
      if (!state.active || state.phase === 'signing') return state
      return { ...state, active: false }
  }

  const submission = state.submission
  if (!submission || submission.id !== event.submissionId) return state

  switch (event.type) {
    case 'RECEIPT_ATTEMPT':
      return { phase: 'source-pending', active: state.active, submission }
    case 'RECEIPT_UNAVAILABLE':
      return { phase: 'source-unknown', active: state.active, submission }
    case 'SOURCE_CONFIRMED':
      return { phase: 'bridging', active: state.active, submission }
    case 'SOURCE_FAILED':
      return { phase: 'source-failed', active: state.active, submission }
    case 'LIFI_COMPLETED':
      return {
        phase: event.partial ? 'partial-success' : 'success',
        active: state.active,
        submission,
      }
  }
}

export function getCrossChainSwapStepStates<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(state: CrossChainSwapExecutionState<TChainId0, TChainId1>) {
  switch (state.phase) {
    case 'idle':
      return {
        source: StepState.NotStarted,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      }
    case 'signing':
      return {
        source: StepState.Sign,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      }
    case 'source-pending':
      return {
        source: StepState.Pending,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      }
    case 'source-unknown':
      return {
        source: StepState.Unknown,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      }
    case 'source-failed':
      return {
        source: StepState.Failed,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      }
    case 'bridging':
      return {
        source: StepState.Success,
        bridge: StepState.Pending,
        dest: StepState.NotStarted,
      }
    case 'partial-success':
      return {
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.PartialSuccess,
      }
    case 'success':
      return {
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.Success,
      }
  }
}
