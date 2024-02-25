import { type getPoolsFromDB } from '../../../api/pools/pools'
import { EVM_APP_BASE_URL } from '../../../constants'
import { parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type PoolsApiSchema } from './schema'

export { type PoolsApiSchema }
export type Pools = Awaited<ReturnType<typeof getPoolsFromDB>>
export type GetPoolsArgs =
  | GetApiInputFromOutput<
      (typeof PoolsApiSchema)['_input'],
      (typeof PoolsApiSchema)['_output']
    >
  | undefined

export const getPoolsUrl = (args: GetPoolsArgs) => {
  return `${EVM_APP_BASE_URL}/pool/api/pools${parseArgs(args)}`
}

export const getPools = async (args: GetPoolsArgs): Promise<Pools> => {
  return fetch(getPoolsUrl(args)).then((data) => data.json())
}
