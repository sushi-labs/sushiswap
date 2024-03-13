import { type getPoolCountFromDB } from '../../../api/pools/count'
import { EVM_APP_BASE_URL } from '../../../constants'
import { parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type PoolCountApiSchema } from './schema'

export { type PoolCountApiSchema }
export type PoolCount = Awaited<ReturnType<typeof getPoolCountFromDB>>
export type GetPoolCountArgs =
  | GetApiInputFromOutput<
      (typeof PoolCountApiSchema)['_input'],
      (typeof PoolCountApiSchema)['_output']
    >
  | undefined

export const getPoolCountUrl = (args: GetPoolCountArgs) => {
  return `${EVM_APP_BASE_URL}/pool/api/pools/count${parseArgs(args)}`
}

export const getPoolCount = async (
  args: GetPoolCountArgs,
): Promise<PoolCount> => {
  return fetch(getPoolCountUrl(args)).then((data) => data.json())
}
