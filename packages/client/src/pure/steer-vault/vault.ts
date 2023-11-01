import type {} from '@sushiswap/database'
import type { getSteerVault as _getSteerVault } from '@sushiswap/steer-vault-api/lib/api'
import { SteerVaultApiSchema } from '@sushiswap/steer-vault-api/lib/schemas/vault'
import { fetch } from '@whatwg-node/fetch'
import type { ChainId } from 'sushi/chain'

import { STEER_VAULT_API } from '../../constants'
import type { GetApiInputFromOutput } from '../../types'

export { SteerVaultApiSchema }
export type SteerVault = Awaited<ReturnType<typeof _getSteerVault>>
// Slightly opinionated, adding string to support the chainId:address format
export type GetSteerVaultArgs =
  | GetApiInputFromOutput<
      typeof SteerVaultApiSchema['_input'],
      typeof SteerVaultApiSchema['_output']
    >
  | string

export const getSteerVaultUrl = (args: GetSteerVaultArgs) => {
  let chainId
  let address
  if (typeof args === 'string') {
    ;[chainId, address] = args.split(':') as [ChainId, string]
  } else {
    ;[chainId, address] = [args.chainId, args.address]
  }

  return `${STEER_VAULT_API}/api/v0/${chainId}/${address}`
}

export const getSteerVault = async (
  args: GetSteerVaultArgs,
): Promise<SteerVault> => {
  return fetch(getSteerVaultUrl(args)).then((data) => data.json())
}
