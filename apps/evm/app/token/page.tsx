export const metadata = {
  title: 'SushiToken 🏦 | Sushi',
}

import rockset from '@rockset/client'

const rocksetClient = rockset(process.env.ROCKSET_API_KEY, process.env.ROCKSET_HOST)

function getTokens() {
  return rocksetClient.queries
    .query({
      sql: {
        query: `SELECT
        t.entityId AS id,
        t.address AS address,
        t.symbol AS symbol,
        t.name AS name,
        t.decimals AS decimals,
        SUM(pool_data.TotalVolume) AS volume,
        SUM(pool_data.TotalVolumeUSD) AS volumeUsd,
        SUM(pool_data.TotalReserve) AS liquidity,
        SUM(pool_data.TotalReserveUSD) AS liquidityUsd
    FROM (
        SELECT
            p.token0Id AS TokenID,
            CAST(p.volumeToken0 AS u256) AS TotalVolume,
            p.volumeToken0Usd AS TotalVolumeUSD,
            CAST(p.reserve0 AS u256) AS TotalReserve,
            p.reserve0Usd AS TotalReserveUSD
        FROM
            (SELECT * FROM entities WHERE namespace = 'sushiswap-dev' AND entityType = 'Pool' AND isWhitelisted = true) AS p
        UNION ALL
        SELECT
            p.token1Id AS TokenID,
            CAST(p.volumeToken1 AS u256) AS TotalVolume,
            p.volumeToken1Usd AS TotalVolumeUSD,
            CAST(p.reserve1 AS u256) AS TotalReserve,
            p.reserve1Usd AS TotalReserveUSD
        FROM
            (SELECT * FROM entities WHERE namespace = 'sushiswap-dev' AND entityType = 'Pool' AND isWhitelisted = true) AS p
    ) AS pool_data
    JOIN
        (SELECT * FROM entities WHERE entityType = 'Token' AND isWhitelisted = true) AS t
    ON pool_data.TokenID = t.entityId
    GROUP BY
        t.entityId, t.address, t.symbol, t.name, t.decimals
    HAVING 
        SUM(pool_data.TotalVolume) IS NOT NULL AND 
        SUM(pool_data.TotalVolumeUSD) IS NOT NULL AND 
        SUM(pool_data.TotalReserve) IS NOT NULL AND
        SUM(pool_data.TotalReserveUSD) IS NOT NULL
    ORDER BY
        volumeUsd DESC;`,
        // query: 'SELECT * FROM commons.Users u WHERE u.age > :minimum_age',
        /* (optional) list of parameters that may be used in the query */
        // parameters: [
        //   {
        //     name: 'minimum_age' /* name of parameter */,
        //     type: 'int' /* one of: int, float, bool, string date, datetime, time, timestamp */,
        //     value: '20' /* value of parameter */,
        //   },
        // ],
        // default_row_limit: 150 /* (optional) row limit to be used if no limit is specified in the query */,
      },
    })
    .then((value) => {
      console.log('value', value.results)
      return value.results
    })
}

export default async function TokenPage() {
  const tokens = await getTokens()
  console.log('tokens', tokens)
  return (
    <>
      <h1>SushiToken 🏦</h1>
      <pre>{JSON.stringify(tokens, undefined, 2)}</pre>
    </>
  )
}
