import { Client, networks } from '@sushiswap/stellar/xlm'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'

/**
 * The XLM client
 * @see https://stellar.github.io/js-stellar-sdk/module-contract.Client.html
 */
const XLMClient = new Client({
  contractId: networks.testnet.contractId,
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
