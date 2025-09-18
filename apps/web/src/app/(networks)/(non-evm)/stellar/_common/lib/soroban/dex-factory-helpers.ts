// import { Client, networks } from '@sushiswap/stellar/dex-factory'
import { baseTokens } from '../assets/tokens/testnet/baseTokens'
// import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import type { IPool } from '../hooks/use-pools'
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
export async function getPools(): Promise<IPool[]> {
  const xlm = baseTokens.find((token) => token.code === 'XLM')
  const usdc = baseTokens.find((token) => token.domain === 'centre.io')

  // TODO: use the dex factory + pool contract and any computations to get full pool data
  // const { result: pools } = await DexFactoryClient.get_pools({
  //   token_a: xlm.contract,
  //   token_b: usdc.contract,
  //   fee: 3000,
  // })

  const testAToken = 'CCFC66ZUPVHASWR5ZXHVFXV54ATWMAFMJO7HPQY2OYHFZU343TBQKEMT'
  const testBToken = 'CAYBXVDB3U6GZ3R3UGNVZXFN5JRJY6P4Y2LK2YBE3E6PPRWNRAQZJVTK'

  if (!xlm || !usdc) {
    throw new Error('XLM or USDC not found')
  }

  // Create mock tokens for TESTA and TESTB
  const testATokenObj = {
    code: 'TESTA',
    issuer: 'GBSCW2OFR5QSMUIXJMWJGB4FMU7GSVUTY3UP6G3KHC3H2UBQUNOTHILB',
    contract: testAToken,
    name: 'Test Token A',
    org: 'Test Org A',
    decimals: 7,
  }

  const testBTokenObj = {
    code: 'TESTB',
    issuer: 'GBSCW2OFR5QSMUIXJMWJGB4FMU7GSVUTY3UP6G3KHC3H2UBQUNOTHILB',
    contract: testBToken,
    name: 'Test Token B',
    org: 'Test Org B',
    decimals: 7,
  }

  return [
    {
      name: 'XLM/USDC',
      address: 'CB3XRV77TEIPTFCCB754WLLCQ7NT4ZBVFQC2FU5SHMKQ4E4F7IPXMU6Y',
      token0Address: xlm.contract,
      token1Address: usdc.contract,
      fee: 3000n, // 0.3%
      spacing: 100,
      token0: xlm,
      token1: usdc,
      liquidityUSD: 2500000, // $2.5M - major pair, high liquidity
      volumeUSD1d: 125000, // $125K daily volume
      feeUSD1d: 375, // 0.3% of volume
      txCount1d: 89, // High transaction count
      totalApr1d: 5.47, // 5.47% APR
    },
    {
      name: 'TESTA/TESTB',
      address: 'CBQZGGYTKFCTF2ORBC6747O4JJ7OHE5WK2YHEFFNFWLHLAEJ5ZQ5OP6L',
      token0Address: testAToken,
      token1Address: testBToken,
      fee: 3000n, // 0.3%
      spacing: 60,
      token0: testATokenObj,
      token1: testBTokenObj,
      liquidityUSD: 45000, // $45K - test tokens, lower liquidity
      volumeUSD1d: 2300, // $2.3K daily volume
      feeUSD1d: 6.9, // 0.3% of volume
      txCount1d: 12, // Lower transaction count
      totalApr1d: 5.61, // 5.61% APR
    },
    {
      name: 'TESTA/TESTB',
      address: 'CA54QJPETZSVNHPRPLXN5ZXFG6S5FAIVMOFBEBBC4AR4ELDULQQJH7ZM',
      token0Address: testAToken,
      token1Address: testBToken,
      fee: 10000n, // 1%
      spacing: 200,
      token0: testATokenObj,
      token1: testBTokenObj,
      liquidityUSD: 18000, // $18K - higher fee, lower liquidity
      volumeUSD1d: 850, // $850 daily volume
      feeUSD1d: 8.5, // 1% of volume
      txCount1d: 4, // Very low transaction count
      totalApr1d: 17.25, // 17.25% APR - higher fee = higher APR
    },
    {
      name: 'TESTA/XLM',
      address: 'CA2DYUQE3VVHAJK3ZPNU3EMR76REAHJMOIVMHAIVMIOGN2VA77DYRZMQ',
      token0Address: testAToken,
      token1Address: xlm.contract,
      fee: 3000n, // 0.3%
      spacing: 60,
      token0: testATokenObj,
      token1: xlm,
      liquidityUSD: 125000, // $125K - XLM pair, moderate liquidity
      volumeUSD1d: 8900, // $8.9K daily volume
      feeUSD1d: 26.7, // 0.3% of volume
      txCount1d: 23, // Moderate transaction count
      totalApr1d: 7.78, // 7.78% APR
    },
    {
      name: 'TESTB/XLM',
      address: 'CDNJ3LPVHQR4UBUJUUQYGIVDUORXGI3DAG642LKGMRWPZQQLJZNWJCNF',
      token0Address: testBToken,
      token1Address: xlm.contract,
      fee: 5000n, // 0.5%
      spacing: 100,
      token0: testBTokenObj,
      token1: xlm,
      liquidityUSD: 78000, // $78K - 0.5% fee, moderate liquidity
      volumeUSD1d: 4200, // $4.2K daily volume
      feeUSD1d: 21, // 0.5% of volume
      txCount1d: 15, // Moderate transaction count
      totalApr1d: 9.83, // 9.83% APR - higher fee = higher APR
    },
  ]
}
