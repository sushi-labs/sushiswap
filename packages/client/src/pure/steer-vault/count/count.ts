import { type getSteerVaultCountFromDB } from '../../../api/steer-vault/count'
import { EVM_APP_BASE_URL } from '../../../constants'
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
  return `${EVM_APP_BASE_URL}/pool/api/steer-vault/count${parseArgs(args)}`
}

export const getSteerVaultCount = async (
  args: GetSteerVaultCountArgs,
): Promise<SteerVaultCount> => {
  return fetch(getSteerVaultCountUrl(args)).then((data) => data.json())
}
