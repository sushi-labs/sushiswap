export const getPoolById = ({
	poolId,
	timeFrame = "DAY",
	first = 10,
}: {
	poolId: string;
	timeFrame?: string;
	first?: number;
}) => {
	return JSON.stringify({
		query: `
      query GetPoolDetails($poolId: ID!, $timeFrame: TimeFrame = DAY, $first: Int = 10) {
        pool(id: $poolId) {
          id
          address
          token0 { id name chainId address }
          token1 { id name chainId address }
          reserve0
          reserve1
          totalSupply
          tvlUsd
          tvlChange24h
          volume24hUsd
          volumeChange24h
          volume7dUsd
          fees24hUsd
          feesChange24h
          transactionCount24h
          transactionCountChange24h
          apr24h
          charts(timeFrame: $timeFrame) {
            volume { timestamp value }
            tvl { timestamp value }
            fees { timestamp value }
          }
          transactions(first: $first) {
            edges {
              node {
                id
                maker
                amount0In
                amount1In
                amount0Out
                amount1Out
                amountUsd
                timestamp
                transactionType
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
            totalCount
          }
        }
      }
    `,
		variables: {
			poolId,
			timeFrame,
			first,
		},
	});
};
