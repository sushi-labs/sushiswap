import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero, Zero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import SUSHI_X_SWAP_ABI from 'abis/sushixswap.json'
import { STARGATE_CHAIN_ID, STARGATE_USDC_ADDRESS, SUSHI_X_SWAP_ADDRESS } from 'config'
import { Contract, Signer } from 'ethers'
import { parseEther } from 'ethers/lib/utils'

export enum Action {
  // Master contract approval
  SET_MASTER_CONTRACT_APPROVAL = 0,

  // Src Actions
  SRC_DEPOSIT_TO_BENTOBOX = 1,
  SRC_TRANSFER_FROM_BENTOBOX = 2,

  // Dst Actions
  DST_DEPOSIT_TO_BENTOBOX = 3,
  DST_WITHDRAW_TOKEN = 4,
  DST_WITHDRAW_FROM_BENTOBOX = 5,

  // Unwrap
  UNWRAP_AND_TRANSFER = 6,

  // Legacy AMM
  LEGACY_EXACT_INPUT = 7,

  // Trident AMM
  TRIDENT_EXACT_INPUT = 8,
  TRIDENT_COMPLEX = 9,

  // Stargate teleport
  STARGATE_TELEPORT = 10,
}

// SushiXSwap
export class SushiXSwap {
  private masterContract: string
  private user: string
  private signer: Signer | null

  private actions: Action[] = []
  private values: BigNumber[] = []
  private datas: string[] = []

  constructor(chainId: number = ChainId.RINKEBY, user: string, signer: Signer | null) {
    this.user = user
    this.signer = signer
    this.masterContract = SUSHI_X_SWAP_ADDRESS[chainId]
  }

  add(action: Action, data: string, value: BigNumberish = 0): void {
    this.actions.push(action)
    this.datas.push(data)
    this.values.push(BigNumber.from(value))
  }

  setMasterContractApproval(signature: Signature): void {
    this.add(
      Action.SET_MASTER_CONTRACT_APPROVAL,
      defaultAbiCoder.encode(
        ['address', 'bool', 'uint8', 'bytes32', 'bytes32'],
        [this.user, true, signature.v, signature.r, signature.s]
      )
    )
  }

  srcDepositToBentoBox(token: Type, amount: BigNumberish = Zero, share: BigNumberish = Zero): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [token.isNative ? AddressZero : token.address, this.user, BigNumber.from(amount), 0]
    )

    const value = token.isNative ? amount : Zero

    this.add(Action.SRC_DEPOSIT_TO_BENTOBOX, data, value)
  }

  encodeDepositToBentoBox(
    token: Type,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): string {
    return defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [token.isNative ? AddressZero : token.address, to, BigNumber.from(amount), BigNumber.from(share)]
    )
  }

  dstDepositToBentoBox(
    token: Type,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    const value = token.isNative ? amount : Zero
    this.add(Action.DST_DEPOSIT_TO_BENTOBOX, this.encodeDepositToBentoBox(token, to, amount, share), value)
  }

  dstWithdrawFromwBentoBox(
    token: Type,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [token.isNative ? AddressZero : token.address, to, BigNumber.from(amount), BigNumber.from(share)]
    )
    const value = token.isNative ? amount : Zero
    this.add(Action.DST_WITHDRAW_FROM_BENTOBOX, data, value)
  }

  srcTransferFromBentoBox(
    from: string,
    to: string,
    amount: BigNumberish,
    share: BigNumberish = Zero,
    unwrap: boolean = true
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256', 'bool'],
      [from, to, BigNumber.from(amount), BigNumber.from(share), unwrap]
    )
    this.add(Action.SRC_TRANSFER_FROM_BENTOBOX, data)
  }

  encodeWithdraw(from: string, to: string = this.user): string {
    return defaultAbiCoder.encode(['address', 'address', 'uint256'], [from, to, 0])
  }

  encodeLegacyExactInput(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    recipient: string = this.user
  ): string {
    return defaultAbiCoder.encode(
      ['uint256', 'uint256', 'address[]', 'address'],
      [BigNumber.from(amountIn), BigNumber.from(amountOutMin), path, recipient]
    )
  }

  legacyExactInput(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], recipient: string): void {
    this.add(Action.LEGACY_EXACT_INPUT, this.encodeLegacyExactInput(amountIn, amountOutMin, path, recipient))
  }

  encodeTridentExactInput(
    tokenIn: Type,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: {
      pool: string
      data: string
    }[]
  ): string {
    return defaultAbiCoder.encode(
      ['tuple(address, uint256, uint256, tuple(address pool, bytes data)[])'],
      [[tokenIn.wrapped.address, BigNumber.from(amountIn), BigNumber.from(amountOutMin), path]]
    )
  }

  tridentExactInput(
    tokenIn: Type,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: {
      pool: string
      data: string
    }[]
  ): void {
    this.add(Action.TRIDENT_EXACT_INPUT, this.encodeTridentExactInput(tokenIn, amountIn, amountOutMin, path))
  }

  teleport(srcChainId: ChainId, dstChainId: ChainId, actions: Action[], values: BigNumberish[], datas: string[]): void {
    const data = defaultAbiCoder.encode(
      [
        'uint16',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'address',
        'address',
        'uint256',
        'uint8[]',
        'uint256[]',
        'bytes[]',
      ],
      [
        STARGATE_CHAIN_ID[dstChainId],
        STARGATE_USDC_ADDRESS[srcChainId],
        1,
        1,
        0,
        0,
        0,
        SUSHI_X_SWAP_ADDRESS[dstChainId],
        this.user,
        500000,
        actions,
        values.map((value) => BigNumber.from(value)),
        datas,
      ]
    )

    this.add(Action.STARGATE_TELEPORT, data, parseEther('0.01'))
  }

  encodeUnwrapAndTransfer(token: Type, to: string = this.user): string {
    return defaultAbiCoder.encode(['address', 'address'], [token.wrapped.address, to])
  }

  async cook() {
    if (!this.signer) {
      return
    }

    const contract = new Contract(this.masterContract, SUSHI_X_SWAP_ABI, this.signer)

    console.log([this.actions, this.values, this.datas])

    try {
      const tx = await contract.cook(this.actions, this.values, this.datas, {
        value: this.values.reduce((a, b) => a.add(b), Zero),
      })
      console.log(`Successful Cook Transaction`, tx)
    } catch (error) {
      console.error('SushiXSwap Cook Error', error)
    }
  }
}
