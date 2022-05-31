import gql from 'graphql-tag'

const tridentPoolsSubQuery = `
  __typename
  id
  kpi {
    volumeUSD
    liquidity
    liquidityUSD
    feesUSD
    transactionCount
  }
  twapEnabled
  swapFee
  assets {
    token {
      id
      name
      symbol
      decimals
    }
  }
`

// Schema not finalized for: 'concentratedLiquidityPools', 'indexPools', 'hybridPools'
const allPools = ['constantProductPools']

export const getTridentPoolsQuery = gql`
  query getTridentsPoolsQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: ConstantProductPool_filter
  )
  {
    ${allPools.map(
      (pool) =>
        `${pool}(first: $first, skip: $skip, block: $block, where: $where) {
          ${tridentPoolsSubQuery}
         }
        `
    )}
  }
`

export const poolHourSnapshotsQuery = gql`
  query PoolHourSnapshots($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolHourSnapshot_filter) {
    poolHourSnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      liquidityUSD
      volumeUSD
      feesUSD
      transactionCount
    }
  }
`

export const poolDaySnapshotsQuery = gql`
  query poolDaySnapshots($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolDaySnapshot_filter) {
    poolDaySnapshots(first: $first, skip: $skip, block: $block, where: $where, orderBy: date, orderDirection: desc) {
      id
      date
      liquidityUSD
      volumeUSD
      feesUSD
      transactionCount
    }
  }
`

export const getTransactionsForPoolQuery = gql`
  query poolTransactionsQuery($first: Int = 1000, $skip: Int = 0, $poolAddress: String!) {
    mints: mints(first: $first, skip: $skip, where: { pool: $poolAddress }) {
      id
      token0 {
        symbol
        price {
          derivedUSD
        }
      }
      token1 {
        symbol
        price {
          derivedUSD
        }
      }
      amount0
      amount1
      transaction {
        id
        timestamp
      }
      sender
      recipient
      origin
      logIndex
    }
    burns: burns(first: $first, skip: $skip, where: { pool: $poolAddress }) {
      id
      token0 {
        symbol
        price {
          derivedUSD
        }
      }
      token1 {
        symbol
        price {
          derivedUSD
        }
      }
      transaction {
        id
        timestamp
      }
      amount0
      amount1
      sender
      recipient
      origin
      logIndex
    }
    swaps: swaps(first: $first, skip: $skip, where: { pool: $poolAddress }) {
      amountIn
      amountOut
      transaction {
        id
        timestamp
      }
      recipient
      tokenIn {
        symbol
        price {
          derivedUSD
        }
      }
      tokenOut {
        symbol
      }
    }
  }
`

/* Need support for amountUSD */
export const getSwapsForPoolQuery = gql`
  query poolSwapQuery($poolAddress: String!) {
    swaps(where: { pool: $poolAddress }) {
      amountIn
      amountOut
      transaction {
        timestamp
      }
      recipient
      tokenIn {
        symbol
        price {
          derivedUSD
        }
      }
      tokenOut {
        symbol
      }
    }
  }
`

export const getTridentPositionsQuery = gql`
  query getTridentPositionsQuery(
    $first: Int = 1000
    $skip: Int = 0
    $block: Block_height
    $where: LiquidityPosition_filter
  ) {
    liquidityPositions(
      first: $first
      skip: $skip
      block: $block
      where: $where
      orderBy: balance
      orderDirection: desc
    ) {
      id
      balance
      pool {
        ${tridentPoolsSubQuery}
      }
    }
  }
`

export const poolKpiQuery = gql`
  query poolKpiQuery($id: String!, $block: Block_height, $where: PoolKpi_filter) {
    poolKpi(id: $id, block: $block, where: $where) {
      id
      fees
      feesUSD
      volume
      volumeUSD
      liquidity
      liquidityUSD
      transactionCount
    }
  }
`

export const poolKpisQuery = gql`
  query poolKpisQuery($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: PoolKpi_filter) {
    poolKpis(first: $first, skip: $skip, block: $block, where: $where) {
      id
      fees
      feesUSD
      volume
      volumeUSD
      liquidity
      liquidityUSD
      transactionCount
    }
  }
`
