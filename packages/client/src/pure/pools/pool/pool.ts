import { getChainIdAddressFromId } from 'sushi'
import { type getPoolFromDB } from '../../../api/pools/pool'
import { EVM_APP_BASE_URL } from '../../../constants'
import { type GetApiInputFromOutput } from '../../../types'
import { type PoolApiSchema } from './schema'

export { type PoolApiSchema }
export type Pool = Awaited<ReturnType<typeof getPoolFromDB>>
// Slightly opinionated, adding string to support the chainId:address format
export type GetPoolArgs =
  | GetApiInputFromOutput<
      typeof PoolApiSchema['_input'],
      typeof PoolApiSchema['_output']
    >
  | string

export const getPoolUrl = (args: GetPoolArgs) => {
  let chainId
  let address
  if (typeof args === 'string') {
    ;({ chainId, address } = getChainIdAddressFromId(args))
  } else {
    ;[chainId, address] = [args.chainId, args.address]
  }

  return `${EVM_APP_BASE_URL}/pool/api/pools/${chainId}/${address}`
}

export const getPool = async (args: GetPoolArgs): Promise<Pool> => {
  return fetch(getPoolUrl(args)).then((data) => data.json())
}
