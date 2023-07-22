// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WETH9, Native, WETH9_ADDRESS } = require('@sushiswap/currency')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ChainId } = require('@sushiswap/chain')

function setQuery(context, events, done) {
  // console.log({ context, events, done })
  // Set the "query" variable for the virtual user.
  context.vars['query'] = {
    ...context.vars['query'],
    chainId: '1',
    tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    tokenOut: WETH9_ADDRESS[1],
    amount: Math.floor(Math.random() * 1e18).toString(),
  }
  return done()
}

function setQueryForEthereum(context, events, done) {
  // console.log({ context, events, done })
  // Set the "query" variable for the virtual user.
  context.vars['query'] = {
    ...context.vars['query'],
    chainId: ChainId.ETHEREUM,
    tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    tokenOut: WETH9_ADDRESS[ChainId.ETHEREUM],
    amount: Math.floor(Math.random() * 1e18).toString(),
  }
  return done()
}

function setQueryForArbitrum(context, events, done) {
  // console.log({ context, events, done })
  // Set the "query" variable for the virtual user.
  context.vars['query'] = {
    ...context.vars['query'],
    chainId: ChainId.ARBITRUM,
    tokenIn: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    tokenOut: WETH9_ADDRESS[ChainId.ARBITRUM],
    amount: Math.floor(Math.random() * 1e18).toString(),
  }
  return done()
}

module.exports = {
  setQuery,
  setQueryForEthereum,
  setQueryForArbitrum,
}
