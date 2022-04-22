// import { getAddress } from '@ethersproject/address'
// import { ChainId, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
// import { BigNumber, Contract } from 'ethers'

// export interface DepositActionProps {
//   bentobox: Contract
//   chainId: ChainId
//   tokenAddress: string
//   amount: BigNumber
//   account: string
// }

// export const depositBentoBoxAction = ({
//   bentobox,
//   chainId,
//   tokenAddress,
//   amount,
//   account,
// }: DepositActionProps): string | undefined => {
//   const checksumAddress = getAddress(tokenAddress)
// //   if (checksumAddress === WNATIVE_ADDRESS[chainId]) {
// //     return {
// //       data: bentobox.interface.encodeFunctionData('deposit', [AddressZero, account, account, amount, 0]),
// //       value: amount,
// //     }
// //   } else {
//     return bentobox.interface.encodeFunctionData('deposit', [checksumAddress, account, account, amount, 0]) 
// //   }
// }
