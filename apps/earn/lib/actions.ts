import { defaultAbiCoder } from '@ethersproject/abi'
import { Signature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { Fee } from '@sushiswap/amm'
import { Type } from '@sushiswap/currency'

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
export const batchAction = ({ contract, actions = [] }: Batch): string | undefined => {
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

interface Sweep {
  router: Contract
  token: string
  recipient: string
  fromBento: boolean
}

/**
 * Recover mistakenly sent ERC-20 tokens
 * @param router Router contract
 * @param token address of token
 * @param recipient address to sent funds to
 */
export const sweep = ({ router, token, recipient, fromBento = false }: Sweep) => {
  return router.interface.encodeFunctionData('sweep', [token, recipient, fromBento])
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

export interface DeployNewPoolActionProps {
  assets: [Type, Type]
  factory: string
  router: Contract
  feeTier: Fee
  twap: boolean
}

export const deployNewPoolAction = ({ assets, factory, router, feeTier, twap }: DeployNewPoolActionProps): string => {
  const [tokenA, tokenB] = assets[0].wrapped.sortsBefore(assets[1].wrapped)
    ? [assets[0], assets[1]]
    : [assets[1], assets[0]]
  const deployData = defaultAbiCoder.encode(
    ['address', 'address', 'uint8', 'bool'],
    [tokenA.wrapped.address, tokenB.wrapped.address, feeTier, twap]
  )

  return router.interface.encodeFunctionData('deployPool', [factory, deployData])
}
