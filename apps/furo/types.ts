import type { Stream as StreamDTO, Vesting as VestingDTO } from './.graphclient'

export type Vestings = {
  incomingVestings: VestingDTO[]
  outgoingVestings: VestingDTO[]
}
export type Streams = {
  incomingStreams: StreamDTO[]
  outgoingStreams: StreamDTO[]
}

export type LoadingState<T> = { isLoading: true; isError: boolean; data?: T }
export type SuccessState<T> = { isLoading: false; isError: boolean; data: T }
export type ErrorState<T> = { isLoading: false; isError: true; data?: T }

export enum ChartHover {
  NONE,
  WITHDRAW,
  STREAMED,
}
