import { Client as TokenClient } from '@sushiswap/stellar/xlm'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import type { Token } from '../types/token.type'

/**
 * The Sorobon client
 * @see https://stellar.github.io/js-stellar-sdk/module-contract.Client.html
 */
const getTokenClient = (token: Token): TokenClient => {
  const tokenClient: TokenClient = new TokenClient({
    contractId: token.contract,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
  })
  return tokenClient
}

/**
 * Get the balance of a token for an address
 * @param address The address to get the balance of
 * @returns The balance of the address
 */
export const getTokenBalance = async (
  address: string,
  token: Token,
): Promise<bigint> => {
  const { result: balance } = await getTokenClient(token).balance({
    id: address,
  })
  return balance
}
