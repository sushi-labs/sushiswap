import type { getSteerVaultCount as _getSteerVaultCount } from '@sushiswap/steer-vault-api/lib/api/index'
import { SteerVaultCountApiSchema } from '@sushiswap/steer-vault-api/lib/schemas/count'
import { fetch } from '@whatwg-node/fetch'

import { STEER_VAULT_API } from '../../constants.js'
import { parseArgs } from '../../functions.js'
import type { GetApiInputFromOutput } from '../../types.js'

export { SteerVaultCountApiSchema }
export type SteerVaultCount = Awaited<ReturnType<typeof _getSteerVaultCount>>
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
