export function liquidityArgs(coinAddress0: string, coinAddress1: string, amount0: string, amount1: string) {
  console.log('paylod++++++++=====', amount0, amount1)
  return {
    type: 'entry_function_payload',
    type_arguments: [coinAddress0, coinAddress1],
    arguments: [amount0, amount1, 0, 0],
    function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::router::add_liquidity`,
  }
}
