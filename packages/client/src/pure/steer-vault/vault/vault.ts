import { getChainIdAddressFromId } from 'sushi/format'
import { type getSteerVaultFromDB } from '../../../api/steer-vault/vault'
import { STEER_VAULT_API } from '../../../constants'
import { type GetApiInputFromOutput } from '../../../types'
import { type SteerVaultApiSchema } from './schema'

export { type SteerVaultApiSchema }
export type SteerVault = Awaited<ReturnType<typeof getSteerVaultFromDB>>
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
    ;({ chainId, address } = getChainIdAddressFromId(args))
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
