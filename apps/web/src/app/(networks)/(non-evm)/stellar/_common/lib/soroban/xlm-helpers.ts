import { Client } from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import { CONTRACT_ADDRESSES } from './contract-addresses'

/**
 * The XLM client
 * @see https://stellar.github.io/js-stellar-sdk/module-contract.Client.html
 */
const XLMClient = new Client({
  contractId: CONTRACT_ADDRESSES.TOKENS.XLM,
  networkPassphrase: NETWORK_PASSPHRASE,
  rpcUrl: RPC_URL,
})

/**
 * Get the XLM balance of an address
 * @param address The address to get the balance of
 * @returns The balance of the address
 */
export const getXlmBalance = async (address: string): Promise<bigint> => {
  const { result: balance } = await XLMClient.balance({
    id: address,
  })
  return balance
}
