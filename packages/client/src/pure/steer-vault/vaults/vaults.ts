import { type getSteerVaultsFromDB } from '../../../api/steer-vault/vaults'
import { STEER_VAULT_API } from '../../../constants'
import { parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type SteerVaultsApiSchema } from './schema'

export { type SteerVaultsApiSchema }
export type SteerVaults = Awaited<ReturnType<typeof getSteerVaultsFromDB>>
export type GetSteerVaultsArgs =
  | GetApiInputFromOutput<
      typeof SteerVaultsApiSchema['_input'],
      typeof SteerVaultsApiSchema['_output']
    >
  | undefined

export const getSteerVaultsUrl = (args: GetSteerVaultsArgs) => {
  return `${STEER_VAULT_API}/api/v0${parseArgs(args)}`
}

export const getSteerVaults = async (
  args: GetSteerVaultsArgs,
): Promise<SteerVaults> => {
  return fetch(getSteerVaultsUrl(args)).then((data) => data.json())
}
