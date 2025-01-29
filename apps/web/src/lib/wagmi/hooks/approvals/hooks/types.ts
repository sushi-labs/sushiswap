import type { erc20Abi_approve } from 'sushi/abi'
import type { Address } from 'sushi/types'

export type ERC20ApproveABI = typeof erc20Abi_approve
export type ERC20ApproveArgs = [Address, bigint]
