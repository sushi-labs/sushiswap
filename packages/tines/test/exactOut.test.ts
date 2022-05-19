import {
  closeValues, 
  ConstantProductRPool, 
  findMultiRouteExactIn, 
  findMultiRouteExactOut, 
  getBigNumber, 
  RouteStatus, 
  RPool, 
  RToken 
} from "../src"

const gasPrice = 1 * 200 * 1e-9

function getPool(
  tokens: RToken[],
  t0: number,
  t1: number,
  price: number[],
  reserve: number,
  fee = 0.003,
  imbalance = 0
) {
  return new ConstantProductRPool(
    `pool-${t0}-${t1}-${reserve}-${fee}`,
    { ...tokens[t0] },
    { ...tokens[t1] },
    fee,
    getBigNumber(reserve),
    getBigNumber(Math.round(reserve / (price[t1] / price[t0]) - imbalance))
  )
}

// ====================== Env 1 ==================
const price = [1, 1, 1, 1, 1]
const tokens = price.map((_, i) => ({
  name: '' + (i + 1),
  address: 'token_addres ' + (i + 1),
}))

//const testPool0_1 = getPool(tokens, 0, 1, price, 1_500_0)
// const testPool0_2 = getPool(tokens, 0, 2, price, 1_000_0)
// const testPool1_2 = getPool(tokens, 1, 2, price, 1_000_000_000)
// const testPool1_3 = getPool(tokens, 1, 3, price, 1_000_0)
// const testPool2_3 = getPool(tokens, 2, 3, price, 1_500_0)

// const testPools = [testPool0_1, testPool0_2, testPool1_3, testPool2_3, testPool1_2]

function checkExactOut(
  tokensFrom: RToken, 
  tokensTo: RToken,
  amountIn: number,
  poolList: RPool[],
  tokenBase: RToken,
  gasPrice: number
) {
  const resOut = findMultiRouteExactIn(tokensFrom, tokensTo, amountIn, poolList, tokenBase, gasPrice)

  expect(resOut).toBeDefined()
  expect(resOut?.status).toEqual(RouteStatus.Success)

  const resIn = findMultiRouteExactOut(tokensFrom, tokensTo, resOut.amountOut, poolList, tokenBase, gasPrice)

  expect(resIn).toBeDefined()
  expect(resIn?.status).toEqual(RouteStatus.Success)
  expect(resIn?.legs.length).toEqual(1)
  expect(closeValues(resIn.amountIn as number, resOut.amountIn as number, 1e-12)).toBeTruthy()
  expect(closeValues(resIn.amountOut as number, resOut.amountOut as number, 1e-12)).toBeTruthy()
  expect(closeValues(resIn.priceImpact as number, resOut.priceImpact as number, 1e-12)).toBeTruthy()
  expect(closeValues(resIn.primaryPrice as number, resOut.primaryPrice as number, 1e-12)).toBeTruthy()
  expect(closeValues(resIn.swapPrice as number, resOut.swapPrice as number, 1e-12)).toBeTruthy()
}

describe('ExactOut', () => {

  it('1 CP pool direction=true', () => {
    const pool = getPool(tokens, 0, 1, price, 1_500_0)
    checkExactOut(tokens[0], tokens[1], 10000, [pool], tokens[1], gasPrice)
  })

  it('1 CP pool direction=false', () => {
    const pool = getPool(tokens, 1, 0, price, 1_500_0)
    checkExactOut(tokens[0], tokens[1], 10000, [pool], tokens[1], gasPrice)
  })
})