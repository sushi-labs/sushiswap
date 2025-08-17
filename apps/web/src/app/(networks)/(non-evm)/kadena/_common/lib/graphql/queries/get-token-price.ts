export const getTokenPrice = ({ tokenAddress }: { tokenAddress: string }) => {
  return JSON.stringify({
    query: `
      query GetTokenPrice($tokenAddress: String!){
        tokenPrice(tokenAddress: $tokenAddress) {
          id
          priceInKda
          priceInUsd
          protocolAddress
          token {
            address
            id
            chainId
            name
          }
        }
      }
    `,
    variables: {
      tokenAddress,
    },
  })
}
