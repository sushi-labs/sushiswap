import gql from 'graphql-tag'

export const factoryQuery = gql`
  query factoryQuery($block: Block_height) {
    factories(first: 1, block: $block) {
      id
      volumeUSD
      liquidityUSD
    }
  }
`

export const userIdsQuery = gql`
  query userIdsQuery($first: Int! = 1000, $skip: Int! = 0) {
    users(first: $first, skip: $skip) {
      id
    }
  }
`
export const uniswapUserQuery = gql`
  query uniswapUserQuery($id: String!) {
    uniswapUser: user(id: $id) {
      id
      liquidityPositions {
        id
        liquidityTokenBalance
        # historicalSnapshots {
        #   id
        #   reserve0
        #   reserve1
        #   block
        #   timestamp
        #   liquidityTokenBalance
        #   liquidityTokenTotalSupply
        # }
      }
    }
  }
`

export const bundleFields = gql`
  fragment bundleFields on Bundle {
    id
    ethPrice
  }
`

export const ethPriceQuery = gql`
  query ethPriceQuery($id: Int! = 1, $block: Block_height) {
    bundles(id: $id, block: $block) {
      ...bundleFields
    }
  }
  ${bundleFields}
`

export const tokenPriceQuery = gql`
  query tokenPriceQuery($id: String!) {
    token(id: $id) {
      id
      derivedETH
    }
  }
`

export const dayDataFieldsQuery = gql`
  fragment dayDataFields on DayData {
    id
    date
    volumeETH
    volumeUSD
    untrackedVolume
    liquidityETH
    liquidityUSD
    txCount
  }
`

// Dashboard...
export const dayDatasQuery = gql`
  query dayDatasQuery($first: Int! = 1000, $date: Int! = 0, $where: DayData_filter) {
    dayDatas(first: $first, orderBy: date, orderDirection: desc, where: $where) {
      ...dayDataFields
    }
  }
  ${dayDataFieldsQuery}
`

// Pairs...
export const pairFieldsQuery = gql`
  fragment pairFields on Pair {
    id
    reserveUSD
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    trackedReserveETH
    token0 {
      ...PairToken
    }
    token1 {
      ...PairToken
    }
    reserve0
    reserve1
    token0Price
    token1Price
    totalSupply
    txCount
    timestamp
  }
  fragment PairToken on Token {
    id
    name
    symbol
    decimals
    totalSupply
    derivedETH
  }
`

export const pairQuery = gql`
  query pairQuery($id: String!, $block: Block_height) {
    pair(id: $id, block: $block) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairIdsQuery = gql`
  query pairIdsQuery($skip: Int) {
    pairs(first: 1000, skip: $skip) {
      id
    }
  }
`

export const pairCountQuery = gql`
  query pairCountQuery {
    uniswapFactories {
      pairCount
    }
  }
`

export const pairDayDatasQuery = gql`
  query pairDayDatasQuery($first: Int = 1000, $skip: Int, $block: Block_height, $where: PairDayData_filter) {
    pairDayDatas(first: $first, skip: $skip, orderBy: date, orderDirection: desc, where: $where, block: $block) {
      date
      pair {
        id
      }
      token0 {
        derivedETH
      }
      token1 {
        derivedETH
      }
      reserveUSD
      volumeToken0
      volumeToken1
      volumeUSD
      txCount
    }
  }
`

export const liquidityPositionsQuery = gql`
  query liquidityPositionSubsetQuery($first: Int! = 1000, $skip: Int, $where: LiquidityPosition_filter) {
    liquidityPositions(first: $first, skip: $skip, where: $where) {
      id
      liquidityTokenBalance
      user {
        id
      }
      pair {
        id
      }
    }
  }
`

export const pairsQuery = gql`
  query pair(
    $skip: Int = 0
    $first: Int = 1000
    $where: Pair_filter
    $block: Block_height
    $orderBy: Pair_orderBy = "trackedReserveETH"
    $orderDirection: OrderDirection = "desc"
  ) {
    pairs(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      block: $block
      where: $where
    ) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const pairsTimeTravelQuery = gql`
  query pairsTimeTravelQuery($first: Int! = 1000, $pairAddresses: [Bytes]!, $block: Block_height!) {
    pairs(
      first: $first
      block: $block
      orderBy: trackedReserveETH
      orderDirection: desc
      where: { id_in: $pairAddresses }
    ) {
      id
      reserveUSD
      trackedReserveETH
      volumeUSD
      untrackedVolumeUSD
      txCount
    }
  }
`

// Tokens...
export const tokenFieldsQuery = gql`
  fragment tokenFields on Token {
    id
    symbol
    name
    decimals
    totalSupply
    volume
    volumeUSD
    untrackedVolumeUSD
    txCount
    liquidity
    derivedETH
  }
`

export const tokenQuery = gql`
  query tokenQuery($id: String!, $block: Block_height) {
    token(id: $id, block: $block) {
      ...tokenFields
    }
  }
  ${tokenFieldsQuery}
`

export const tokenIdsQuery = gql`
  query tokenIdsQuery($skip: Int) {
    tokens(first: 1000, skip: $skip) {
      id
    }
  }
`

export const tokenDayDatasQuery = gql`
  query tokenDayDatasQuery($first: Int! = 1000, $skip: Int, $block: Block_height, $where: TokenDayData_filter) {
    tokenDayDatas(first: $first, skip: $skip, orderBy: date, orderDirection: desc, where: $where, block: $block) {
      id
      date
      token {
        id
      }
      volumeUSD
      liquidityUSD
      priceUSD
      txCount
    }
  }
`

export const tokenPairsQuery = gql`
  query tokenPairsQuery($id: String!, $skip: Int, $block: Block_height) {
    pairs0: pairs(
      first: 1000
      skip: $skip
      orderBy: reserveUSD
      orderDirection: desc
      where: { token0: $id }
      block: $block
    ) {
      ...pairFields
    }
    pairs1: pairs(
      first: 1000
      skip: $skip
      orderBy: reserveUSD
      orderDirection: desc
      where: { token1: $id }
      block: $block
    ) {
      ...pairFields
    }
  }
  ${pairFieldsQuery}
`

export const tokensQuery = gql`
  query tokensQuery($first: Int! = 1000, $skip: Int, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, orderBy: volumeUSD, orderDirection: desc, block: $block, where: $where) {
      ...tokenFields
      dayData(first: 7, orderBy: date, orderDirection: desc) {
        id
        priceUSD
        date
      }
    }
  }
  ${tokenFieldsQuery}
`

export const tokenSubsetQuery = gql`
  query tokenSubsetQuery(
    $first: Int! = 1000
    $skip: Int
    $tokenAddresses: [Bytes]!
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
    $block: Block_height
  ) {
    tokens(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { id_in: $tokenAddresses }
      block: $block
    ) {
      ...tokenFields
    }
  }
  ${tokenFieldsQuery}
`

// Transactions...
export const transactionsQuery = gql`
  query transactionsQuery($first: Int! = 1000, $skip: Int, $block: Block_height, $where: Swap_filter) {
    swaps(orderBy: timestamp, orderDirection: desc, where: $where) {
      id
      timestamp
      transaction {
        id
      }
      pair {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
    mints(orderBy: timestamp, orderDirection: desc, where: $where) {
      id
      timestamp
      transaction {
        id
      }
      pair {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      amount0
      amount1
      amountUSD
      to
    }
    burns(orderBy: timestamp, orderDirection: desc, where: $where) {
      id
      timestamp
      transaction {
        id
      }
      pair {
        id
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      sender
      amount0
      amount1
      amountUSD
      to
    }
  }
`
