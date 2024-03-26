import type { ChainId } from 'sushi/chain'
import { getChainIdAddressFromId } from 'sushi/format'
import type { Address } from 'viem'
import { type getSteerVaultFromDB } from '../../../api/steer-vault/vault'
import { EVM_APP_BASE_URL } from '../../../constants'
import { type GetApiInputFromOutput } from '../../../types'
import { type SteerVaultApiSchema } from './schema'

export { type SteerVaultApiSchema }
export type SteerVault = Awaited<ReturnType<typeof getSteerVaultFromDB>>
// Slightly opinionated, adding string to support the chainId:address format
export type GetSteerVaultArgs =
  | GetApiInputFromOutput<
      (typeof SteerVaultApiSchema)['_input'],
      (typeof SteerVaultApiSchema)['_output']
    >
  | string

export const getSteerVaultUrl = (args: GetSteerVaultArgs) => {
  let chainId: ReturnType<typeof getChainIdAddressFromId>['chainId']
  let address: ReturnType<typeof getChainIdAddressFromId>['address']

  if (typeof args === 'string') {
    ;({ chainId, address } = getChainIdAddressFromId(args))
  } else {
    ;[chainId, address] = [args.chainId as ChainId, args.address as Address]
  }

  return `${EVM_APP_BASE_URL}/pool/api/steer-vault/${chainId}/${address}`
}

export const getSteerVault = async (
  args: GetSteerVaultArgs,
): Promise<SteerVault> => {
  return fetch(getSteerVaultUrl(args)).then((data) => data.json())
}
