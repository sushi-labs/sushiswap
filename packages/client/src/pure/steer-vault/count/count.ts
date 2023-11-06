import { type getSteerVaultCountFromDB } from '../../../api/steer-vault/count'
import { STEER_VAULT_API } from '../../../constants'
import { parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type SteerVaultCountApiSchema } from './schema'

export { type SteerVaultCountApiSchema }
export type SteerVaultCount = Awaited<
  ReturnType<typeof getSteerVaultCountFromDB>
>
export type GetSteerVaultCountArgs =
  | GetApiInputFromOutput<
      typeof SteerVaultCountApiSchema['_input'],
      typeof SteerVaultCountApiSchema['_output']
    >
  | undefined

export const getSteerVaultCountUrl = (args: GetSteerVaultCountArgs) => {
  return `${STEER_VAULT_API}/api/v0/count${parseArgs(args)}`
}

export const getSteerVaultCount = async (
  args: GetSteerVaultCountArgs,
): Promise<SteerVaultCount> => {
  return fetch(getSteerVaultCountUrl(args)).then((data) => data.json())
}
