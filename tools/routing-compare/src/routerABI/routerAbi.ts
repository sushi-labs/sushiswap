import { ChainId } from 'sushi'
import { routeProcessor5Abi } from 'sushi/abi'
import { ROUTE_PROCESSOR_5_ADDRESS } from 'sushi/config'
import { Abi, Address } from 'viem'
import { OneInchV6Abi } from './1inchV6.js'
import { OdosV2Abi } from './OdosV2.js'

export function knownRoutersAbi(
  chainId: ChainId,
  router: Address,
): Abi | undefined {
  switch (router) {
    case ROUTE_PROCESSOR_5_ADDRESS[
      chainId as keyof typeof ROUTE_PROCESSOR_5_ADDRESS
    ]:
      return routeProcessor5Abi as Abi
    case '0x111111125421ca6dc452d289314280a0f8842a65':
      return OneInchV6Abi
    case '0xCf5540fFFCdC3d510B18bFcA6d2b9987b0772559':
      return OdosV2Abi
  }
  return
}
