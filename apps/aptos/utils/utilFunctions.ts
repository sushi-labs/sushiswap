import { Token } from './tokenType'

export async function useAllCommonPairs(
  amount_in: number = 0,
  coinA: Token,
  coinB: Token,
  controller: AbortController
) {
  const basePairs: string[] = [
    '0x1::aptos_coin::AptosCoin',
    '0xb06483aa110a1d7cfdc0f5ba48545ee967564819014326b2767de4705048aab9::btc_coin::Bitcoin',
    '0xd2f34ece0b838b770eac6d23a1e139d28008c806af944f779728629867d17538::ether_coin::Ether',
    coinA.address,
    coinB.address,
  ]
  let returnRoutes
  // var allPairs: string[][] = [].concat(
  //   ...basePairs.map((pair: string, index: number) =>
  //     basePairs.slice(index + 1).map((innerPair) => [pair, innerPair])
  //   )
  // )
  var allPairs: string[][] = []

  for (let i = 0; i < basePairs.length; i++) {
    for (let j = i + 1; j < basePairs.length; j++) {
      allPairs.push([basePairs[i], basePairs[j]])
    }
  }

  await fetch(
    'https://fullnode.testnet.aptoslabs.com/v1/accounts/0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2/resources',
    { signal: controller.signal }
  )
    .then((res) => res.json())
    .then((data) => {
      let t: any = {}
      let reserve_tokens: any = {}
      let reserve_token_info: any = {}

      let reserves = data.filter((d: any) => {
        if (d.type.includes('swap::TokenPairReserve')) {
          reserve_tokens[d.type] = d

          return true
        }

        if (
          d.type.includes(
            '0x1::coin::CoinInfo<0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::LPToken<'
          )
        ) {
          reserve_token_info[d.type] = d
        }
      })

      allPairs.map((token) => {
        if (
          reserve_tokens[
            `0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${token[0]}, ${token[1]}>`
          ]
        ) {
          let info = {
            lpTokenInfo:
              reserve_token_info[
                `0x1::coin::CoinInfo<0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::LPToken<${token[0]}, ${token[1]}>>`
              ],
          }
          let data =
            reserve_tokens[
              `0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${token[0]}, ${token[1]}>`
            ]

          t[`${token[0]}|||${token[1]}`] = {
            pairs: `${token[0]}|||${token[1]}`,
            res_x: data.data.reserve_x,
            res_y: data.data.reserve_y,
            ...info,
            ...data,
          }
        }

        if (
          reserve_tokens[
            `0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${token[1]}, ${token[0]}>`
          ]
        ) {
          let info = {
            lpTokenInfo:
              reserve_token_info[
                `0x1::coin::CoinInfo<0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::LPToken<${token[1]}, ${token[0]}>>`
              ],
          }
          let data =
            reserve_tokens[
              `0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${token[1]}, ${token[0]}>`
            ]

          t[`${token[1]}|||${token[0]}`] = {
            pairs: `${token[0]}|||${token[1]}`,
            res_x: data.data.reserve_x,
            res_y: data.data.reserve_y,
            ...info,
            ...data,
          }
        }
      })

      let graph = Object.values(t).reduce((data: any, coin: any) => {
        const coins_data = coin.pairs.split('|||')

        if (data[coins_data[0]]) {
          data[coins_data[0]].push(coins_data[1])
        } else {
          data[coins_data[0]] = [coins_data[1]]
        }

        if (data[coins_data[1]]) {
          data[coins_data[1]].push(coins_data[0])
        } else {
          data[coins_data[1]] = [coins_data[0]]
        }

        return data
      }, {})

      returnRoutes = RouteDemo(amount_in, t, graph, coinA, coinB)
    })
  return returnRoutes
}

const exactOutput = (amt_in: number, res_x: number, res_y: number) => {
  let amt_with_fee = amt_in * 9975
  let amt_out = (amt_with_fee * res_y) / (res_x * 10000 + amt_with_fee)
  return amt_out
}

function findPossibleRoutes(tokenA: string, tokenB: string, graph: any, visited: any, currentRoute: any, routes: any) {
  // Mark the current token as visited
  visited[tokenA] = true

  // Add the current token to the current route
  currentRoute.push(tokenA)

  // If the current token is the desired tokenB, add the current route to the routes array
  if (tokenA === tokenB) {
    routes.push([...currentRoute])
  } else {
    // Iterate through the adjacent tokens of the current token
    for (let adjacentToken of graph[tokenA]) {
      // If the adjacent token is not visited, recursively find possible routes
      if (!visited[adjacentToken]) {
        findPossibleRoutes(adjacentToken, tokenB, graph, visited, currentRoute, routes)
      }
    }
  }

  // Remove the current token from the current route and mark it as unvisited
  currentRoute.pop()
  visited[tokenA] = false
}

function RouteDemo(firstInput: any, ARR: any, tokenGraph: any, coinA: any, coinB: any) {
  const visitedTokens = {}
  const currentTokenRoute: any[] = []
  const allRoutes: any[] = []

  findPossibleRoutes(coinA.address, coinB.address, tokenGraph, visitedTokens, currentTokenRoute, allRoutes)

  // let firstInput = 100000000
  let lastOutput
  const bestFinder = []

  for (let route of allRoutes) {
    if (route.length < 6) {
      if (ARR[route[0] + '|||' + route[1]] || ARR[route[1] + '|||' + route[0]]) {
        let res_x = ARR[route[0] + '|||' + route[1]]?.res_x || ARR[route[1] + '|||' + route[0]]?.res_y
        let res_y = ARR[route[0] + '|||' + route[1]]?.res_y || ARR[route[1] + '|||' + route[0]]?.res_x
        lastOutput = exactOutput(firstInput, res_x, res_y)

        if (ARR[route[1] + '|||' + route[2]] || ARR[route[2] + '|||' + route[1]]) {
          let res_x = ARR[route[1] + '|||' + route[2]]?.res_x || ARR[route[2] + '|||' + route[1]]?.res_y
          let res_y = ARR[route[1] + '|||' + route[2]]?.res_y || ARR[route[2] + '|||' + route[1]]?.res_x
          lastOutput = exactOutput(lastOutput, res_x, res_y)

          if (ARR[route[2] + '|||' + route[3]] || ARR[route[3] + '|||' + route[2]]) {
            let res_x = ARR[route[2] + '|||' + route[3]]?.res_x || ARR[route[3] + '|||' + route[2]]?.res_y
            let res_y = ARR[route[2] + '|||' + route[3]]?.res_y || ARR[route[3] + '|||' + route[2]]?.res_x
            lastOutput = exactOutput(lastOutput, res_x, res_y)

            if (ARR[route[3] + '|||' + route[4]] || ARR[route[4] + '|||' + route[3]]) {
              let res_x = ARR[route[3] + '|||' + route[4]]?.res_x || ARR[route[4] + '|||' + route[3]]?.res_y
              let res_y = ARR[route[3] + '|||' + route[4]]?.res_y || ARR[route[4] + '|||' + route[3]]?.res_x
              lastOutput = exactOutput(lastOutput, res_x, res_y)
            }
          }
        }
      }
      bestFinder.push({ route: route, amountOut: lastOutput })
    }
  }

  const bestRoutePrice = bestFinder.reduce((r: any, b: any) => (r.amountOut > b.amountOut ? r : b))
  console.log(bestFinder)
  return bestRoutePrice
}

export async function getYTokenPrice(amount_in: number = 0, coinX: string, coinY: string, controller: AbortController) {
  // console.log(amount_in, coinX, coinY)
  let outputData
  await fetch(
    `https://fullnode.testnet.aptoslabs.com/v1/accounts/e8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2/resource/0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${coinX},${coinY}>`,
    { signal: controller.signal }
  )
    .then((res) => res.json())
    .then(async (data) => {
      if (data.error_code == 'resource_not_found') {
        await fetch(
          `https://fullnode.testnet.aptoslabs.com/v1/accounts/e8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2/resource/0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${coinY},${coinX}>`,
          { signal: controller.signal }
        )
          .then((res) => res.json())
          .then((data) => {
            // if (amount_in > 0) {
            if (data.data.reserve_x > 0 && data.data.reserve_x > 0) {
              let amount_in_with_fee = amount_in * 9975
              let numerator = amount_in_with_fee * data.data.reserve_x
              let denominator = data.data.reserve_y * 10000 + amount_in_with_fee
              outputData = numerator / denominator
            } else {
              outputData = 'ERROR_INSUFFICIENT_LIQUIDITY'
              console.log('ERROR_INSUFFICIENT_LIQUIDITY')
              // return data.error_code
            }
          })
          .catch((err) => {
            outputData = err
            console.log(err)
          })
      } else {
        // if (amount_in > 0) {
        if (data.data.reserve_x > 0 && data.data.reserve_x > 0) {
          let amount_in_with_fee = amount_in * 9975
          let numerator = amount_in_with_fee * data.data.reserve_y
          let denominator = data.data.reserve_x * 10000 + amount_in_with_fee
          outputData = numerator / denominator
        } else {
          outputData = 'ERROR_INSUFFICIENT_LIQUIDITY'
          console.log('ERROR_INSUFFICIENT_LIQUIDITY')
          // return data.error_code
        }
      }
    })
    .catch((err) => {
      outputData = err
      console.log(err)
    })
  return outputData
}

export const formatNumber = (number: number, decimals: number) => {
  if (number) {
    number = number / 10 ** decimals
    if (String(number).includes('.') && String(number).split('.')[1].length > 8) {
      number = parseFloat(number.toFixed(9))
    }
    if (String(number).includes('.') && parseFloat(String(number).split('.')[0]) > 0) {
      number = parseFloat(number.toFixed(2))
    }
  } else {
    number = 0
  }
  return number
}
