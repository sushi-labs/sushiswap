import { Client, type PoolState, networks } from '@sushiswap/stellar/mock-pool'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import { handleResult } from './handle-result'

/**
 * The Mock Pool client
 * @see https://stellar.github.io/js-stellar-sdk/module-contract.Client.html
 */
const PoolClient = new Client({
  contractId: networks.testnet.contractId,
  networkPassphrase: NETWORK_PASSPHRASE,
  rpcUrl: RPC_URL,
})

/**
 * Get the pool state
 * @returns The current pool state
 */
export async function getPoolState(): Promise<PoolState> {
  const { result } = await PoolClient.get_state()
  return handleResult(result)
}

/**
 * Get a quote for the a token output amount for a given input token amount. If passing Token A in, then get an amount out that it swaps for for Token B.
 * Quote the amount of output tokens for a given input token
 * @param zeroForOne - Whether the swap is for the first token or vice versa
 * @param amountIn - The amount of the token to swap
 * @returns The amount of the output token
 */
export async function quoteExactInput({
  zeroForOne,
  amountIn,
}: {
  zeroForOne: boolean
  amountIn: bigint
}) {
  const { result } = await PoolClient.quote_exact_input({
    zero_for_one: zeroForOne,
    amount_in: amountIn,
  })
  return handleResult(result)
}

/**
 * Get a quote for the a token input amount for a given token output amount. If passing Token A in, then get an amount out that it swaps for for Token B.
 * Quote the amount of output tokens for a given input token
 * @param zeroForOne - Whether the swap is for the first token or vice versa
 * @param amountOut - The amount of the token to swap
 * @returns The amount of the output token
 */
export async function quoteExactOutput({
  zeroForOne,
  amountOut,
}: {
  zeroForOne: boolean
  amountOut: bigint
}) {
  const { result } = await PoolClient.quote_exact_output({
    zero_for_one: zeroForOne,
    amount_out: amountOut,
  })
  return handleResult(result)
}

/**
 * Execute a swap for a given token amount in
 * @note This is just a simulation, there are no real transfers taking place.
 * @param sender - The sender of the swap
 * @param recipient - The recipient of the swap
 * @param zeroForOne - Whether the swap is for the first token or vice versa
 * @param amountIn - The amount of the token to swap
 * @returns The result of the swap
 */
export async function executeSwap({
  sender,
  recipient,
  zeroForOne,
  amountIn,
}: {
  sender: string
  recipient: string
  zeroForOne: boolean
  amountIn: bigint
}) {
  const { result } = await PoolClient.swap({
    _sender: sender,
    _recipient: recipient,
    zero_for_one: zeroForOne,
    amount_specified: amountIn,
    sqrt_price_limit_x96: 0n,
  })
  return handleResult(result)
}
