import { SafeBalanceResponse, SafeInfo as GnosisSafeInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { ChainId } from '@sushiswap/chain'

export type Safe = {
  baseUrl: string
  name: string
  chainId: ChainId
  address: string
}

export type SafeInfo = GnosisSafeInfo & {
  type: string
  balance: string
}

export type SafeBalance = SafeBalanceResponse & {
  address: string
  chainId: string
}
