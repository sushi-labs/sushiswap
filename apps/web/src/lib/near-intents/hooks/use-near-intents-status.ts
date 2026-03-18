import { useQuery } from '@tanstack/react-query'
import { getNearIntentsStatus } from '../fetchers'

export interface UseNearIntentsStatusParams {
  depositAddress: string | undefined
  depositMemo: string | undefined
  correlationId: string | undefined
  enabled?: boolean
}

export enum StepState {
  Sign = 0,
  NotStarted = 1,
  Pending = 2,
  PartialSuccess = 3,
  Success = 4,
  Failed = 5,
}

export const initState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  return (
    state.source === StepState.NotStarted &&
    state.bridge === StepState.NotStarted &&
    state.dest === StepState.NotStarted
  )
}

export const pendingState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  return !finishedState(state) && !failedState(state) && !initState(state)
}

export const finishedState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  if (state.source === StepState.Failed) return true
  return [
    StepState.Success,
    StepState.Failed,
    StepState.PartialSuccess,
  ].includes(state.dest)
}

export const failedState = (state: {
  source: StepState
  bridge: StepState
  dest: StepState
}) => {
  return state.source === StepState.Failed
}

export const useNearIntentsStatus = ({
  depositAddress,
  depositMemo,
  correlationId,
  enabled = true,
}: UseNearIntentsStatusParams) => {
  return useQuery({
    queryKey: ['near-intents-status', { depositAddress, correlationId }],
    queryFn: async () => {
      if (!depositAddress) throw new Error('depositAddress is required')
      return getNearIntentsStatus({ depositAddress, depositMemo })
    },
    refetchInterval: 5000,
    enabled: enabled && !!depositAddress && !!correlationId,
  })
}
