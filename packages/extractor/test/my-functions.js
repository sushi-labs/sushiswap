const {
  Native,
  USDC,
  USDT,
  SUSHI,
  WBTC,
  DAI,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('@sushiswap/currency')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ChainId } = require('@sushiswap/chain')

function setQuery(context, events, done) {
  const chainIds = [ChainId.ETHEREUM, ChainId.ARBITRUM, ChainId.OPTIMISM, ChainId.POLYGON]
  const chainId = chainIds[Math.floor(Math.random() * chainIds.length)]
  const tokensIn = [Native.onChain(chainId)]
  const tokenIn = tokensIn[Math.floor(Math.random() * tokensIn.length)]
  const tokensOut = [WBTC[chainId], DAI[chainId], USDC[chainId], USDT[chainId], SUSHI[chainId]]
  const tokenOut = tokensOut[Math.floor(Math.random() * tokensOut.length)]

  context.vars['query'] = {
    ...context.vars['query'],
    chainId,
    tokenIn: tokenIn.isNative ? '' : tokenIn.address,
    tokenOut: tokenOut.address,
    amount: Math.floor(Math.random() * Math.pow(10, tokenIn.decimals)).toString(),
  }
  return done()
}

module.exports = {
  setQuery,
}
