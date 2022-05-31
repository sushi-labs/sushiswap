import gql from 'graphql-tag'

const blockFieldsQuery = gql`
  fragment blockFields on Block {
    id
    number
    timestamp
  }
`

export const blockQuery = gql`
  query blockQuery(
    $where: Block_filter
    $orderBy: Block_orderBy! = "timestamp"
    $orderDirection: OrderDirection! = "desc"
  ) {
    blocks(first: 1, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`

export const blocksQuery = gql`
  query blocksQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: Block_filter
    $orderBy: Block_orderBy = "timestamp"
    $orderDirection: OrderDirection! = "desc"
  ) {
    blocks(first: $first, skip: $skip, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`

export const massBlocksQuery = (timestamps: number[] | string[]) =>
  gql`
  {
    ${timestamps.map(
      (timestamp) =>
        `
        block${timestamp}: blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: ${timestamp} }) {
            ...blockFields
        },
      `
    )},
  }
  ${blockFieldsQuery}
  `
