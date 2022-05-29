import { type Stream as StreamDTO, type Vesting as VestingDTO } from '.graphclient'

export type Vestings = { incomingVestings: VestingDTO[]; outgoingVestings: VestingDTO[] }

export type Streams = { incomingStreams: StreamDTO[]; outgoingStreams: StreamDTO[] }
