import { Signature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'

interface Batch {
  contract: Contract
  actions: (string | undefined)[]
}

interface Action {
  contract: Contract
  fn: string
  args: ReadonlyArray<unknown>
}

export type LiquidityInput = {
  token: string
  native: boolean
  amount: string
}

export type LiquidityOutput = {
  token: string
  amount: string
}

enum PermitType {
  AMOUNT = 1,
  ALLOWED = 2,
}

interface BaseSignatureData {
  v: number
  r: string
  s: string
  deadline: number
  nonce: number
  owner: string
  spender: string
  chainId: number
  tokenAddress: string
  permitType: PermitType
}

export interface StandardSignatureData extends BaseSignatureData {
  amount: string
}

/**
 * Encodes the function call to a string
 * @param contract
 * @param fn
 * @param args
 */
export const getAsEncodedAction = ({ contract, fn, args }: Action): string => {
  return contract.interface.encodeFunctionData(fn, args)
}

/**
 * Make sure provided contract has a batch function.
 * Calls action directly if provided array is of length 1, encode batch otherwise
 * @param contract should contain batch function
 * @param actions array of encoded function data
 */
export const batchAction = ({ contract, actions = [] }: Batch): string => {
  const validated = actions.filter(Boolean)

  // Call action directly to save gas
  if (validated.length === 1 && validated[0]) {
    return validated[0]
  }

  // Call batch function with valid actions
  if (validated.length > 1) {
    return contract.interface.encodeFunctionData('multicall', [validated])
  }

  throw new Error('Invalid actions')
}

interface UnwrapETHAction {
  router: Contract
  recipient: string
}

/**
 * Unwrap contract's wETH into ETH
 * @param router Router contract
 * @param recipient recipient of ETH
 * @param liquidityOutput array with minimum output amounts for underlying tokens
 */
export const unwrapWETHAction = ({ router, recipient }: UnwrapETHAction) => {
  return router.interface.encodeFunctionData('unwrapWETH', [recipient])
}

export interface ApproveMasterContractActionProps {
  router: Contract
  signature?: Signature
}

export const approveMasterContractAction = ({ router, signature }: ApproveMasterContractActionProps) => {
  if (!signature) return undefined

  const { v, r, s } = signature
  return router.interface.encodeFunctionData('approveMasterContract', [v, r, s])
}
