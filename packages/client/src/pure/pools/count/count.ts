import { type getPoolCountFromDB } from '../../../api/pools/count'
import { POOL_API } from '../../../constants'
import { parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type PoolCountApiSchema } from './schema'

export { type PoolCountApiSchema }
export type PoolCount = Awaited<ReturnType<typeof getPoolCountFromDB>>
export type GetPoolCountArgs =
  | GetApiInputFromOutput<
      typeof PoolCountApiSchema['_input'],
      typeof PoolCountApiSchema['_output']
    >
  | undefined

export const getPoolCountUrl = (args: GetPoolCountArgs) => {
  return `${POOL_API}/api/v0/count${parseArgs(args)}`
}

export const getPoolCount = async (
  args: GetPoolCountArgs,
): Promise<PoolCount> => {
  return fetch(getPoolCountUrl(args)).then((data) => data.json())
}
