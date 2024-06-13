import { type getSteerVaultsFromDB } from '../../../api/steer-vault/vaults'
import { EVM_APP_BASE_URL } from '../../../constants'
import { parseArgs } from '../../../functions'
import { type GetApiInputFromOutput } from '../../../types'
import { type SteerVaultsApiSchema } from './schema'

export { type SteerVaultsApiSchema }
export type SteerVaults = Awaited<ReturnType<typeof getSteerVaultsFromDB>>
export type GetSteerVaultsArgs =
  | GetApiInputFromOutput<
      (typeof SteerVaultsApiSchema)['_input'],
      (typeof SteerVaultsApiSchema)['_output']
    >
  | undefined

export const getSteerVaultsUrl = (args: GetSteerVaultsArgs) => {
  return `${EVM_APP_BASE_URL}/pool/api/steer-vault${parseArgs<GetSteerVaultsArgs>(
    args,
  )}`
}

export const getSteerVaults = async (
  args: GetSteerVaultsArgs,
): Promise<SteerVaults> => {
  return fetch(getSteerVaultsUrl(args)).then((data) => data.json())
}
