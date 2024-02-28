// 'use client'

// import {
//   useSendTransaction as useSendTransaction_,
//   useSimulateContract,
// } from 'wagmi'

// export type useSimulateContractParameters = Parameters<
//   typeof useSimulateContract
// >['0']
// export type UseSendTransactionConfig = Parameters<
//   typeof useSendTransaction_
// >['0']

// interface UseSendTransaction {
//   prepare?: useSimulateContractParameters
//   send?: UseSendTransactionConfig
//   gasMargin?: boolean
// }

// export function useSendTransaction({
//   prepare,
//   send,
//   gasMargin = false,
// }: UseSendTransaction) {
//   const { data: simulation } = useSimulateContract(prepare)

//   const simulatedGas = simulation?.request.gas

//   const gas =
//     gasMargin && simulatedGas ? (simulatedGas * 120n) / 100n : simulatedGas

//   return useSendTransaction_({
//     gas,
//     mutation: {
//       onSettled: (data, e, variables, context) => {
//         // if (e?.code !== ErrorCode.ACTION_REJECTED) {
//         //   createErrorToast(e?.message, true)
//         // }

//         if (send?.mutation?.onSettled) {
//           send.mutation.onSettled(data, e, variables, context)
//         }
//       },
//     },
//   })
// }
