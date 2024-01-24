import { type getBondPositionsFromSubgraph } from '../../../api'
import { EVM_APP_BASE_URL } from '../../../constants'
import { get, parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type BondsPositionsApiSchema } from './schema'

export { type BondsPositionsApiSchema }
export type BondPosition = BondsPositions[number]
export type BondsPositions = Awaited<
  ReturnType<typeof getBondPositionsFromSubgraph>
>
export type GetBondsPositionsArgs =
  | GetApiInputFromOutput<
      (typeof BondsPositionsApiSchema)['_input'],
      (typeof BondsPositionsApiSchema)['_output']
    >
  | undefined

export const getBondsPositionsUrl = (args?: GetBondsPositionsArgs) => {
  return `${EVM_APP_BASE_URL}/bonds/api/v1/positions${parseArgs(args)}`
}

export const getBondsPositions = async (
  args?: GetBondsPositionsArgs,
): Promise<BondsPositions> => {
  return get(getBondsPositionsUrl(args))
}
