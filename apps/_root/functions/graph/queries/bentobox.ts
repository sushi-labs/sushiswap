import { gql } from 'graphql-request'

export const bentoBoxQuery = gql`
  query bentoBoxQuery($block: Block_height, $where: BentoBox_filter) {
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

export const bentoTokensQuery = gql`
  query bentoTokens($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, where: $where) {
      id
      decimals
      rebase {
        elastic
      }
    }
  }
`
