import { Network } from 'aptos'

export function liquidityArgs(
  coinAddress0: string,
  coinAddress1: string,
  amount0: number,
  amount1: number,
  networkType: string
) {
  return {
    type: 'entry_function_payload',
    type_arguments: [coinAddress0, coinAddress1],
    arguments: [amount0, amount1, 0, 0],
    function: `${
      networkType == Network.TESTNET
        ? process.env.NEXT_PUBLIC_MAINNET_CONTRACT
        : process.env.NEXT_PUBLIC_TESTNET_CONTRACT
    }::router::add_liquidity`,
  }
}
