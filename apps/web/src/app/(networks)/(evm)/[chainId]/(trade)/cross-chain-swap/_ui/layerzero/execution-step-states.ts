import { StepState } from '../lifi/confirmation-dialog'
import type { LayerZeroTrackedExecution } from './hooks/use-layerzero-executions'

export function getLayerZeroExecutionStepStates(
  execution: LayerZeroTrackedExecution | undefined,
  failed = false,
): { source: StepState; bridge: StepState; dest: StepState } {
  const idle = {
    source: StepState.Sign,
    bridge: StepState.NotStarted,
    dest: StepState.NotStarted,
  }
  if (execution?.sourceStatus === 'FAILED' || (!execution && failed))
    return { ...idle, source: StepState.Failed }
  if (execution?.delivery?.status === 'SUCCESS')
    return {
      source: StepState.Success,
      bridge: StepState.Success,
      dest: StepState.Success,
    }
  if (execution?.delivery?.status === 'ACTION_REQUIRED')
    return { ...idle, source: StepState.Success, bridge: StepState.Failed }
  if (execution?.sourceStatus === 'SUCCESS')
    return { ...idle, source: StepState.Success, bridge: StepState.Pending }
  if (execution?.txHash) return { ...idle, source: StepState.Pending }
  return idle
}
