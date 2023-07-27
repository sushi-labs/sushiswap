import { useQuery } from '@tanstack/react-query'

const MAINNET_CONTRACT = process.env['MAINNET_CONTRACT'] || process.env['NEXT_PUBLIC_MAINNET_CONTRACT']
const TESTNET_CONTRACT = process.env['TESTNET_CONTRACT'] || process.env['NEXT_PUBLIC_TESTNET_CONTRACT']

export type Pool = {
  id: string
  type: string
  data: {
    balance_x: {
      value: string
    }
    balance_y: {
      value: string
    }
    burn_cap: {
      dummy_field: boolean
    }
    creator: string
    fee_amount: {
      value: string
    }
    freeze_cap: {
      dummy_field: boolean
    }
    k_last: string
    mint_cap: {
      dummy_field: boolean
    }
    token_x_details: {
      decimals: number
      name: string
      symbol: string
      token_address: string
    }
    token_y_details: {
      decimals: number
      name: string
      symbol: string
      token_address: string
    }
  }
}

export async function fetchPoolsQueryFn(chainId: number = 1) {
  const CONTRACT_ADDRESS = chainId === 1 ? MAINNET_CONTRACT : TESTNET_CONTRACT
  const network = chainId === 1 ? 'mainnet' : 'testnet'
  const response = await fetch(`https://fullnode.${network}.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/resources`)
  if (response.status == 200) {
    const data = await response.json()
    const coinPair: Pool[] = data.filter((pair: Pool) => {
      pair.id =
        chainId + ':' + pair?.data?.token_x_details?.token_address + ', ' + pair?.data?.token_y_details?.token_address
      return pair.type.includes(`${CONTRACT_ADDRESS}::swap::TokenPairMetadata`)
    })
    return coinPair
  }
  return []
}

export function usePools(chainId: number = 1, enable: boolean = true) {
  return useQuery({
    queryKey: ['pools', { chainId }],
    queryFn: async () => fetchPoolsQueryFn(chainId),
    keepPreviousData: true,
    enabled: Boolean(enable),
  })
}
// export type Pool = {
//   id: string
//   coin_type: string
//   coin_type_hash: string
//   creator_address: string
//   decimals: number
//   name: string
//   symbol: string
//   transaction_created_timestamp: string
//   transaction_version_created: number
// }

// async function fetchPoolQueryFnGraphQL(
//   operationsDoc: string,
//   operationName: string,
//   variables: Record<string, any>,
//   chainId: number
// ) {
//   const URL =
//     chainId === 1
//       ? 'https://indexer.mainnet.aptoslabs.com/v1/graphql'
//       : 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql'
//   const result = await fetch(URL, {
//     method: 'POST',
//     body: JSON.stringify({
//       query: operationsDoc,
//       variables,
//       operationName,
//     }),
//   })
//   if (result.status === 200) {
//     const response = await result.json()
//     const data = response?.data?.coin_infos
//     data.map((pair: Pool) => {
//       pair.id = chainId + ':' + pair.coin_type_hash
//     })
//     return data as Pool[]
//   }
//   return [] as Pool[]
// }

// export function usePools(chainId: number) {
//   const CONTRACT_ADDRESS = chainId === 1 ? MAINNET_CONTRACT : TESTNET_CONTRACT
//   const operation = `
//   query PoolQuery {
//     coin_infos(
//       where: {creator_address: {_eq: "${CONTRACT_ADDRESS}"}, symbol: {_eq: "Sushi-LP"}}
//     ) {
//       coin_type
//       coin_type_hash
// 			creator_address
//       decimals
//       name
//       symbol
//       transaction_created_timestamp
//       transaction_version_created
//     }
//   }
// `
//   return useQuery({
//     queryKey: ['pools', { chainId }],
//     queryFn: async () => fetchPoolQueryFnGraphQL(operation, 'PoolQuery', {}, chainId),
//     keepPreviousData: true,
//   })
// }
