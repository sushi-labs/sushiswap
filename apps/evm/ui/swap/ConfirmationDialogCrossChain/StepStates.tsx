import { CheckMarkIcon } from '@sushiswap/ui/components/icons/CheckmarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/components/icons/FailedMarkIcon'
import { Loader } from '@sushiswap/ui/components/loader'
import { FC, ReactNode } from 'react'

export enum StepState {
  Sign,
  NotStarted,
  Pending,
  PartialSuccess,
  Success,
  Failed,
}

export const initState = (state: { source: StepState; bridge: StepState; dest: StepState }) => {
  return (
    state.source === StepState.NotStarted &&
    state.bridge === StepState.NotStarted &&
    state.dest === StepState.NotStarted
  )
}

export const pendingState = (state: { source: StepState; bridge: StepState; dest: StepState }) => {
  return !finishedState(state) && !failedState(state) && !initState(state)
}

export const finishedState = (state: { source: StepState; bridge: StepState; dest: StepState }) => {
  if (state.source === StepState.Failed) return true
  return [StepState.Success, StepState.Failed, StepState.PartialSuccess].includes(state.dest)
}

export const failedState = (state: { source: StepState; bridge: StepState; dest: StepState }) => {
  return state.source === StepState.Failed
}

const Completed = ({ partial }: { partial: boolean }) => {
  return (
    <div className="flex w-10 h-10 justify-center items-center">
      <CheckMarkIcon width={40} height={40} className={partial ? '!text-yellow' : ''} />
    </div>
  )
}

const Failed = () => {
  return (
    <div className="flex w-10 h-10 justify-center items-center">
      <FailedMarkIcon width={40} height={40} />
    </div>
  )
}

const Loading = () => <Loader circleClassName="!text-blue/[0.15]" className="!text-blue" size={40} />

const Pending: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="text-lg w-10 h-10 rounded-full flex justify-center items-center bg-gray-300 text-gray-500 dark:bg-slate-800 dark:text-slate-400 font-semibold">
      {children}
    </div>
  )
}

export const Divider = () => {
  return (
    <div className="h-10 flex justify-center items-center">
      <div className="h-0.5 w-10 bg-gray-200 dark:bg-slate-800 rounded-full" />
    </div>
  )
}

export const GetStateComponent = ({ state, index }: { state: StepState; index: number }) => {
  if (state === StepState.NotStarted) return <Pending>{index}</Pending>
  if (state === StepState.Sign) return <Loading />
  if (state === StepState.Pending) return <Loading />
  if (state === StepState.Success) return <Completed partial={false} />
  if (state === StepState.Failed) return <Failed />
  return <Completed partial={true} />
}
