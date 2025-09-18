// import { Client, networks } from '@sushiswap/stellar/dex-factory'
import { baseTokens } from '../assets/tokens/testnet/baseTokens'
// import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
// import { handleResult } from './handle-result'

/**
 * The Dex Pool client
 * @see https://stellar.github.io/js-stellar-sdk/module-contract.Client.html
 */
// const DexFactoryClient = new Client({
//   contractId: networks.testnet.contractId,
//   networkPassphrase: NETWORK_PASSPHRASE,
//   rpcUrl: RPC_URL,
// })

/**
 * Get the pools that have been deployed
 * @returns The list of pools
 * // TODO: update to return a type instead of hardcoded string[]
 */
export async function getPools() {
  const xlm = baseTokens.find((token) => token.code === 'XLM')
  const usdc = baseTokens.find((token) => token.domain === 'centre.io')

  if (!xlm || !usdc) {
    throw new Error('XLM or USDC not found')
  }

  // TODO: use the dex factory + pool contract and any computations to get full pool data
  return [
    {
      name: 'XLM/USDC',
      address: 'CB3XRV77TEIPTFCCB754WLLCQ7NT4ZBVFQC2FU5SHMKQ4E4F7IPXMU6Y',
      token0: xlm,
      token1: usdc,
      token0Address: xlm.contract,
      token1Address: usdc.contract,
      liquidityUSD: 1000000,
      volumeUSD1d: 1000000,
      feeUSD1d: 1000000,
      txCount1d: 1000000,
      totalApr1d: 1000000,
    },
  ]
}
