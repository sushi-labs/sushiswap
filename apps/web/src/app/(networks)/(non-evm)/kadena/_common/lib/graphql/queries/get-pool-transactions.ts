export const getPoolTransactionsQuery = `
query PoolTransactions($pairId: String!, $type: PoolTransactionType, $first: Int!, $after: String) {
  poolTransactions(pairId: $pairId, type: $type, first: $first, after: $after) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        amount0In
        amount0Out
        amount1In
        amount1Out
        amountUsd
        id
        maker
        requestkey
        timestamp
        transactionId
        transactionType
      }
    }
  }
}
`;
