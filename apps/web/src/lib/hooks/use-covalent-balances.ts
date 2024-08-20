// The covalent api route is currently commented out

// import { useQuery } from '@tanstack/react-query'
// import type { Address } from 'viem'
// import type { CovalentChainId } from '../covalent'

// interface UseCovalentBalances {
//   chainId: CovalentChainId | undefined
//   address: Address | undefined
// }

// export function useCovalentBalances({ address, chainId }: UseCovalentBalances) {
//   const query = useQuery({
//     queryKey: ['covalent-balances', chainId, address],
//     queryFn: async () => {
//       const response = await fetch(
//         `/api/balance/covalent/${chainId}/${address}`,
//       )

//       if (!response.ok) {
//         throw new Error('Failed to fetch covalent balances')
//       }

//       const data: Record<string, string | bigint> = await response.json()

//       Object.keys(data).forEach((key) => {
//         data[key] = BigInt(data[key])
//         if (data[key] === BigInt(0)) {
//           delete data[key]
//         }
//       })

//       return data as Record<string, bigint>
//     },
//     enabled: !!chainId && !!address,
//   })

//   return query
// }

export {}
