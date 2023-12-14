import { type getBondsFromSubgraph } from '../../../api/bonds/bonds/'
import { EVM_APP_BASE_URL } from '../../../constants'
import { get, parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type BondsApiSchema } from './schema'

export { type BondsApiSchema }
export type Bonds = Awaited<ReturnType<typeof getBondsFromSubgraph>>
export type GetBondsArgs =
  | GetApiInputFromOutput<
      typeof BondsApiSchema['_input'],
      typeof BondsApiSchema['_output']
    >
  | undefined

export const getBondsUrl = (args?: GetBondsArgs) => {
  return `${EVM_APP_BASE_URL}/bonds/api/v1/bonds${parseArgs(args)}`
}

export const getBonds = async (args?: GetBondsArgs): Promise<Bonds> => {
  return get(getBondsUrl(args))
}
