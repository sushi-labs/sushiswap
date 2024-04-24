import { MultiRoute } from '../tines/index.js'

// Example: https://www.anychart.com/products/anychart/gallery/Sankey_Diagram/Titanic_Survivors.php?theme=lightBlue
// Data formate: [{from: 'First Class', to: 'Child', value: 6}, ....]
export function getRoutingAnyChartSankeyData(route: MultiRoute) {
  // set tokens values. input token value is 100%, other tokens value is how many % of liquidity comes through them
  const tokenValue = new Map<string | undefined, number>()
  tokenValue.set(route.fromToken.tokenId, 100)
  route.legs.forEach((leg) => {
    const fromValue = tokenValue.get(leg.tokenFrom.tokenId) || 0
    console.assert(
      fromValue !== 0,
      `Unexpected input token !!!${leg.tokenFrom.tokenId}`,
    )
    const legValue = fromValue * leg.absolutePortion
    const toValue = tokenValue.get(leg.tokenTo.tokenId) || 0
    tokenValue.set(leg.tokenTo.tokenId, toValue + legValue)
  })

  return route.legs.map((leg) => {
    const fromValue = tokenValue.get(leg.tokenFrom.tokenId) || 0
    console.assert(
      fromValue !== 0,
      `Unexpected token value !!! ${leg.tokenFrom.tokenId}`,
    )
    const value = Math.round(fromValue * leg.absolutePortion)
    return {
      from: leg.tokenFrom.symbol,
      to: leg.tokenTo.symbol,
      value,
    }
  })
}
