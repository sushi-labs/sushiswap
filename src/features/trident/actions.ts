import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { ChainId } from '@sushiswap/core-sdk'
import { LiquidityOutput } from 'app/features/trident/types'
import { StandardSignatureData } from 'app/hooks/useERC20Permit'

interface Batch {
  contract: Contract
  actions: (string | undefined)[]
}

interface Action<T = any> {
  contract: Contract
  fn: string
  args?: T
}

/**
 * Encodes the function call to a string
 * @param contract
 * @param fn
 * @param args
 */
export const getAsEncodedAction = <T = any>({ contract, fn, args }: Action): string => {
  return contract.interface.encodeFunctionData(fn, args)
}

/**
 * Make sure provided contract has a batch function.
 * Calls action directly if provided array is of length 1, encode batch otherwise
 * @param contract should contain batch function
 * @param actions array of encoded function data
 */
export const batchAction = <T = any>({ contract, actions = [] }: Batch): string | undefined => {
  const validated = actions.filter(Boolean)

  if (validated.length === 0) throw new Error('No valid actions')

  // Call action directly to save gas
  if (validated.length === 1) {
    return validated[0]
  }

  // Call batch function with valid actions
  if (validated.length > 1) {
    return contract.interface.encodeFunctionData('multicall', [validated])
  }
}

interface BurnLiquidityAction {
  router: Contract
  address: string
  amount: string
  recipient: string
  receiveToWallet: boolean
  liquidityOutput: LiquidityOutput[]
}

/**
 * Burn liquidity tokens to get back `bento` tokens.
 * @param router Router contract
 * @param address address of liquidity token
 * @param amount amount of SLP to burn
 * @param recipient receiver of underlying SLP tokens
 * @param receiveToWallet true if underlying SLP tokens should be send to wallet instead of bentobox
 * @param liquidityOutput array with minimum output amounts for underlying tokens
 */
export const burnLiquidityAction = ({
  router,
  address,
  amount,
  recipient,
  receiveToWallet,
  liquidityOutput,
}: BurnLiquidityAction) => {
  return router.interface.encodeFunctionData('burnLiquidity', [
    address,
    amount,
    defaultAbiCoder.encode(['address', 'bool'], [recipient, receiveToWallet]),
    liquidityOutput,
  ])
}

interface BurnLiquiditySingleAction {
  router: Contract
  token: string
  address: string
  amount: string
  recipient: string
  receiveToWallet: boolean
  minWithdrawal: string
}

export const burnLiquiditySingleAction = ({
  router,
  token,
  address,
  amount,
  recipient,
  receiveToWallet,
  minWithdrawal,
}: BurnLiquiditySingleAction) => {
  return router.interface.encodeFunctionData('burnLiquiditySingle', [
    address,
    amount,
    defaultAbiCoder.encode(['address', 'address', 'bool'], [token, recipient, receiveToWallet]),
    minWithdrawal,
  ])
}

interface UnwrapETHAction {
  chainId: number
  router: Contract
  recipient: string
  amountMinimum: string
}

/**
 * Unwrap contract's wETH into ETH
 * @param router Router contract
 * @param recipient recipient of ETH
 * @param liquidityOutput array with minimum output amounts for underlying tokens
 */
export const unwrapWETHAction = ({ chainId, router, recipient, amountMinimum }: UnwrapETHAction) => {
  if (chainId === ChainId.MATIC) {
    return router.interface.encodeFunctionData('unwrapWETH', [amountMinimum, recipient])
  }

  return router.interface.encodeFunctionData('unwrapWETH', [recipient])
}

interface SweepNativeToken {
  router: Contract
  token: string
  amount: string
  recipient: string
}

/**
 * Recover mistakenly sent ERC-20 tokens
 * @param router Router contract
 * @param token address of token
 * @param amount amount to recover
 * @param recipient address to sent funds to
 */
export const sweepNativeTokenAction = ({ router, token, amount, recipient }: SweepNativeToken) => {
  return router.interface.encodeFunctionData('sweepNativeToken', [token, amount, recipient])
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

export interface ApproveSLPActionProps {
  router: Contract
  signatureData?: StandardSignatureData
}

/**
 *
 * @param router router contract
 * @param signatureData SLP approval signature data
 */
export const approveSLPAction = ({ router, signatureData }: ApproveSLPActionProps) => {
  if (!signatureData) return undefined
  const { tokenAddress, amount, deadline, v, r, s } = signatureData
  return router.interface.encodeFunctionData('selfPermit', [tokenAddress, amount, deadline, v, r, s])
}
