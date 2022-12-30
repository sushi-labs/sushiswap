import { gql } from 'graphql-request'

export const factoryQuery = gql`
  query factoryQuery($block: Block_height) {
    factories(first: 1, block: $block) {
      id
      pairCount
      userCount
      volumeUSD
      liquidityUSD
    }
  }
`

export const bundleFields = gql`
  fragment bundleFields on Bundle {
    id
    ethPrice
  }
`

export const bundleQuery = gql`
  query bundleQuery($id: Int! = 1, $block: Block_height) {
    bundle(id: $id, block: $block) {
      ...bundleFields
    }
  }
  ${bundleFields}
`

export const tokenPricesQuery = gql`
  query tokenPricesQuery($first: Int = 1000, $skip: Int = 0, $block: Block_height, $where: Token_filter) {
    tokens(first: $first, skip: $skip, block: $block, where: $where) {
      id
      derivedETH
    }
  }
`
