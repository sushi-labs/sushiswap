import { ChainId } from 'sushi'
import { routeProcessor5Abi } from 'sushi/abi'
import { ROUTE_PROCESSOR_5_ADDRESS } from 'sushi/config'
import { Abi, Address } from 'viem'
import { OneInchV6Abi } from './1inchV6.js'

export function knownRoutersAbi(
  chainId: ChainId,
  router: Address,
): Abi | undefined {
  if (
    router ===
    ROUTE_PROCESSOR_5_ADDRESS[chainId as keyof typeof ROUTE_PROCESSOR_5_ADDRESS]
  )
    return routeProcessor5Abi as Abi
  else if (router === '0x111111125421ca6dc452d289314280a0f8842a65')
    return OneInchV6Abi
  return
}
