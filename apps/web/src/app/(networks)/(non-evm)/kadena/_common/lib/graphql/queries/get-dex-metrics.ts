export const getDexMetricsQuery = ({ protocolAddress }: { protocolAddress: string }) => {
	return JSON.stringify({
		query: `
      query GetDexMetrics($protocolAddress: String!) {
        dexMetrics(protocolAddress: $protocolAddress) {
          totalPools
          currentTvlUsd
          totalVolumeUsd
          tvlHistory {
            timestamp
            value
          }
          volumeHistory {
            timestamp
            value
          }
        }
      }
    `,
		variables: {
			protocolAddress,
		},
	});
};
