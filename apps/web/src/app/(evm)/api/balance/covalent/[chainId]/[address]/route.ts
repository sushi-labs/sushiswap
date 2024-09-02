// import {
//   CovalentChainId,
//   covalentClient,
//   isCovalentChainId,
// } from 'src/lib/covalent'
// import { type ChainId } from 'sushi/chain'
// import { z } from 'zod'

// const querySchema = z.object({
//   chainId: z.coerce
//     .number()
//     .int()
//     .gte(0)
//     .lte(2 ** 256)
//     .refine((v) => isCovalentChainId(v as ChainId))
//     .transform((v) => v as CovalentChainId),
//   address: z.coerce.string(),
//   tokens: z.array(z.coerce.string()).optional(),
// })

// export const revalidate = 10

// export async function GET(
//   _req: Request,
//   {
//     params,
//   }: { params: { chainId: string; address: string; tokens?: string[] } },
// ) {
//   const { chainId, address } = querySchema.parse(params)

//   try {
//     const { data } =
//       await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
//         chainId,
//         address,
//       )

//     return Response.json(
//       data.items.reduce(
//         (previousValue, currentValue) => {
//           if (currentValue.balance) {
//             previousValue[currentValue.contract_address] =
//               currentValue.balance.toString()
//           }
//           return previousValue
//         },
//         {} as Record<string, string>,
//       ),
//       {
//         headers: {
//           'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
//         },
//       },
//     )
//   } catch (e) {
//     console.error("Couldn't fetch balances from covalent", e)
//   }
// }

export {}
