import type { EvmAddress } from 'sushi/evm'

export type SubAccountTableRow = {
  address: EvmAddress
  masterAddress: EvmAddress
  name: string
  type: 'master' | 'sub'
  perpsEquity: number | null
  spotEquity: number | null
  isLoadingPerps: boolean
  isLoadingSpot: boolean
}
