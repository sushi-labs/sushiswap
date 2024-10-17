export const getTradeAmountsForDay = (
  startDate: string,
  endDate: string,
  pairAddress: string,
) => {
  const query = JSON.stringify({
    query:
      'query GetTradeAmountsForDay($pairAddress: String!, $sinceDate: ISO8601DateTime!, $tillDate: ISO8601DateTime!) {\n  tron {\n    dexTrades(\n      options: {desc: "tradeAmount"}\n      date: {since: $sinceDate, till: $tillDate}\n      smartContractAddress: {is: $pairAddress}\n    ) {\n      tradeAmount(in: USD)\n      baseCurrency {\n        symbol\n      }\n      quoteCurrency {\n        symbol\n      }\n     }\n  }\n}\n',

    variables: `{\n  \"pairAddress\": \"${pairAddress}\",\n  \"sinceDate\": \"${startDate}\",\n  \"tillDate\": \"${endDate}\"\n}`,
  })

  return query
}
