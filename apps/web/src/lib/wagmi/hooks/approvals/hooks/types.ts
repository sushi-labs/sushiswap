import type { EvmAddress, erc20Abi_approve } from 'sushi/evm'

export type ERC20ApproveABI = typeof erc20Abi_approve
export type ERC20ApproveArgs = [EvmAddress, bigint]

export const old_erc20Abi_approve = [
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: {},
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export type OLD_ERC20ApproveABI = typeof old_erc20Abi_approve
