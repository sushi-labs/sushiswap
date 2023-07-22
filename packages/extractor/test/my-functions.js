// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WETH9, Native, WETH9_ADDRESS } = require('@sushiswap/currency')

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

module.exports = {
  setQuery,
}
