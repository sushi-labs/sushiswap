import gql from 'graphql-tag'

export const cloneFieldsQuery = gql`
  fragment cloneFields on Clone {
    id
    address: id
    data
    block
    timestamp
  }
`

export const clonesQuery = gql`
  query clones(
    $skip: Int = 0
    $first: Int = 1000
    $where: Clone_filter
    $block: Block_height # $orderDirection: OrderDirection # $orderBy: Clone_orderBy
  ) {
    clones(
      skip: $skip
      first: $first
      where: $where
      block: $block # orderDirection: $orderDirection # orderBy: $orderBy
    ) {
      ...cloneFields
    }
  }
  ${cloneFieldsQuery}
`

export const bentoTokenFieldsQuery = gql`
  fragment bentoTokenFields on Token {
    id
    # bentoBox
    name
    symbol
    decimals
    rebase {
      elastic
      base
    }
    block
    timestamp
  }
`

export const bentoTokensQuery = gql`
  query bentoTokens($first: Int = 1000, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, where: $where) {
      ...bentoTokenFields
    }
  }
  ${bentoTokenFieldsQuery}
`

export const bentoUserTokensQuery = gql`
  query bentoUserTokens($user: String!, $skip: Int = 0, $first: Int = 1000, $block: Block_height) {
    userTokens(skip: $skip, first: $first, block: $block, where: { share_gt: 0, user: $user }) {
      token {
        ...bentoTokenFields
      }
      share
    }
  }
  ${bentoTokenFieldsQuery}
`

export const bentoBoxQuery = gql`
  query bentoBoxQuery(
    $id: String! = "0xf5bce5077908a1b7370b9ae04adc565ebd643966"
    $block: Block_height
    $where: BentoBox_filter
  ) {
    bentoBoxes(first: 1, block: $block, where: $where) {
      id
      protocolCount
      userCount
      tokenCount
      masterContractCount
      cloneCount
      flashloanCount
      transactionCount
    }
  }
`

export const bentoStrategiesQuery = gql`
  query bentoStrategies($first: Int = 1000, $firstHarvests: Int = 3, $block: Block_height, $where: Strategy_filter) {
    strategies(first: $first, block: $block, where: $where) {
      token {
        id
        decimals
        strategyTargetPercentage
        rebase {
          elastic
        }
      }
      balance
      totalProfit
      harvests(first: $firstHarvests, orderBy: timestamp, orderDirection: desc) {
        id
        profit
        tokenElastic
        timestamp
        block
      }
      timestamp
      block
    }
  }
  ${bentoTokenFieldsQuery}
`
