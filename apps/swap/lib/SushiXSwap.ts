import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero, Zero } from '@ethersproject/constants'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { STARGATE_BRIDGE_TOKENS, STARGATE_CHAIN_ID, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { SushiXSwap as SushiXSwapContract } from '@sushiswap/sushixswap/typechain'
import { SUSHI_X_SWAP_ADDRESS } from 'config'

import { Complex } from './getComplexParams'

export enum Action {
  // Master contract approval
  SET_MASTER_CONTRACT_APPROVAL = 0,

  // Src Actions
  SRC_DEPOSIT_TO_BENTOBOX = 1,
  SRC_DEPOSIT = 11,
  SRC_TRANSFER_FROM_BENTOBOX = 2,

  // Dst Actions
  DST_DEPOSIT_TO_BENTOBOX = 3,
  DST_WITHDRAW = 4,
  DST_WITHDRAW_FROM_BENTOBOX = 5,

  // Unwrap (to native)
  UNWRAP_AND_TRANSFER = 6,

  // Legacy AMM
  LEGACY_EXACT_INPUT = 7,

  // Trident AMM
  TRIDENT_EXACT_INPUT = 8,
  TRIDENT_COMPLEX = 9,

  // Stargate teleport
  STARGATE_TELEPORT = 10,
}

export interface Adapter {
  teleport(): void
}

export class StargateAdapter implements Adapter {
  teleport() {
    //
  }
}
// export class AnycallAdapter implements Adapter {}
// export class SocketAdapter implements Adapter {}

export interface Cooker {
  readonly actions: Action[]
  readonly values: BigNumber[]
  readonly datas: string[]
  add(action: Action, data: string, value: BigNumberish): void
}

export abstract class Cooker implements Cooker {
  readonly actions: Action[] = []
  readonly values: BigNumber[] = []
  readonly datas: string[] = []
  readonly chainId: number
  readonly debug: boolean
  readonly masterContract: string
  readonly user: string
  constructor({
    chainId,
    debug = false,
    masterContract,
    user,
  }: {
    chainId: number
    debug?: boolean
    masterContract: string
    user: string
  }) {
    this.chainId = chainId
    this.debug = debug
    this.masterContract = masterContract
    this.user = user
  }
  add(action: Action, data: string, value: BigNumberish = Zero): void {
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

  srcDepositToBentoBox(
    token: Currency,
    recipient = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [token.isNative ? AddressZero : token.address, recipient, BigNumber.from(amount), BigNumber.from(share)]
    )

    const value = token.isNative ? amount : Zero

    this.add(Action.SRC_DEPOSIT_TO_BENTOBOX, data, value)
  }

  srcTransferFromBentoBox(
    from: string,
    to: string,
    amount: BigNumberish,
    share: BigNumberish = Zero,
    unwrap = true
  ): void {
    this.add(
      Action.SRC_TRANSFER_FROM_BENTOBOX,
      defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'uint256', 'bool'],
        [from, to, BigNumber.from(amount), BigNumber.from(share), unwrap]
      )
    )
  }

  dstDepositToBentoBox(
    token: Currency,
    to: string = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    this.add(
      Action.DST_DEPOSIT_TO_BENTOBOX,
      defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'uint256'],
        [token.isNative ? AddressZero : token.address, to, BigNumber.from(amount), BigNumber.from(share)]
      ),
      token.isNative ? amount : Zero
    )
  }

  dstWithdraw(token: Currency, to: string = this.user, amount = Zero): void {
    this.add(
      Action.DST_WITHDRAW,
      defaultAbiCoder.encode(['address', 'address', 'uint256'], [token.wrapped.address, to, amount])
    )
  }

  dstWithdrawFromBentoBox(
    token: Currency,
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

  legacyExactInput(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    recipient: string = this.user
  ): void {
    this.add(
      Action.LEGACY_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['uint256', 'uint256', 'address[]', 'address'],
        [BigNumber.from(amountIn), BigNumber.from(amountOutMin), path, recipient]
      )
    )
  }

  tridentExactInput(
    tokenIn: Currency,
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: {
      pool: string
      data: string
    }[]
  ): void {
    console.log({ tokenIn, amountIn, amountOutMin, path })
    this.add(
      Action.TRIDENT_EXACT_INPUT,
      defaultAbiCoder.encode(
        ['tuple(address, uint256, uint256, tuple(address pool, bytes data)[])'],
        [[tokenIn.wrapped.address, BigNumber.from(amountIn), BigNumber.from(amountOutMin), path]]
      )
    )
  }

  tridentComplex(params: Complex): void {
    this.add(
      Action.TRIDENT_COMPLEX,
      defaultAbiCoder.encode(
        [
          'tuple(tuple(address tokenIn, address pool, bool native, uint256 amount, bytes data)[], tuple(address tokenIn, address pool, uint64 balancePercentage, bytes data)[], tuple(address token, address to, bool unwrapBento, uint256 minAmount)[])',
        ],
        [params]
      )
    )
  }

  unwrapAndTransfer(token: Currency, to: string = this.user): void {
    this.add(Action.UNWRAP_AND_TRANSFER, defaultAbiCoder.encode(['address', 'address'], [token.wrapped.address, to]))
  }
}

export class SrcCooker extends Cooker {}

export class DstCooker extends Cooker {}

// SushiXSwap
export class SushiXSwap {
  readonly adapter: Adapter = new StargateAdapter()

  readonly srcCooker: Cooker

  readonly dstCooker: Cooker

  readonly contract: SushiXSwapContract

  readonly crossChain: boolean

  readonly srcChainId: number
  readonly dstChainId: number

  readonly srcToken: Currency
  readonly dstToken: Currency

  readonly srcUseBentoBox: boolean
  readonly dstUseBentoBox: boolean

  readonly user: string
  readonly debug: boolean

  constructor({
    srcToken,
    dstToken,
    srcUseBentoBox = false,
    dstUseBentoBox = false,
    user,
    contract,
    debug = false,
  }: {
    srcToken: Currency
    dstToken: Currency
    srcUseBentoBox: boolean
    dstUseBentoBox: boolean
    user: string
    contract: SushiXSwapContract
    debug?: boolean
  }) {
    this.srcToken = srcToken
    this.dstToken = dstToken

    this.srcUseBentoBox = srcUseBentoBox
    this.dstUseBentoBox = dstUseBentoBox

    this.srcChainId = this.srcToken.chainId
    this.dstChainId = this.dstToken.chainId

    this.crossChain = this.srcChainId !== this.dstChainId

    this.contract = contract

    this.user = user
    this.debug = debug

    this.srcCooker = new SrcCooker({
      chainId: this.srcChainId,
      debug,
      masterContract: SUSHI_X_SWAP_ADDRESS[this.srcToken.chainId],
      user,
    })

    this.dstCooker = new DstCooker({
      chainId: this.dstChainId,
      debug,
      masterContract: SUSHI_X_SWAP_ADDRESS[this.dstToken.chainId],
      user,
    })
  }

  // Transfers Scenarios
  // T1: BentoBox - Stargate - BentoBox
  // T2: Wallet - Stargate - Wallet
  // T3: Wallet - Stargate - BentoBox
  // T4: BentoBox - Stargate - Wallet
  stargateTransfer(amountIn: Amount<Currency>, shareIn: Amount<Currency>): void {
    // T1-T4
    if (this.srcUseBentoBox && this.dstUseBentoBox) {
      // T1
      console.log(`cook stargate transfer from bentobox on chain ${this.srcChainId} to bentobox on ${this.dstChainId}`)
      this.srcCooker.srcTransferFromBentoBox(
        this.srcToken.wrapped.address,
        this.srcCooker.masterContract,
        amountIn.quotient.toString()
      )
      this.dstCooker.dstDepositToBentoBox(this.dstToken, this.user)
    } else if (!this.srcUseBentoBox && !this.dstUseBentoBox) {
      // T2
      // Regular src transfer to pool instead? (this will requite approval of SushiXSwap contract)
      console.log(`cook stargate transfer from wallet on chain ${this.srcChainId} to wallet on ${this.dstChainId}`)
      this.srcCooker.srcDepositToBentoBox(this.srcToken, this.user, amountIn.quotient.toString())
      this.srcCooker.srcTransferFromBentoBox(
        this.srcToken.wrapped.address,
        this.srcCooker.masterContract,
        0,
        shareIn.quotient.toString()
      )
      this.dstCooker.dstWithdraw(this.dstToken, this.user)
    } else if (!this.srcUseBentoBox && this.dstUseBentoBox) {
      // T3
      console.log(`cook stargate transfer from wallet on chain ${this.srcChainId} to bentobox on ${this.dstChainId}`)
      this.srcCooker.srcDepositToBentoBox(this.srcToken, this.user, amountIn.quotient.toString())
      this.srcCooker.srcTransferFromBentoBox(
        this.srcToken.wrapped.address,
        this.srcCooker.masterContract,
        0,
        shareIn.quotient.toString()
      )
      this.dstCooker.dstDepositToBentoBox(this.dstToken, this.user)
    } else if (this.srcUseBentoBox && !this.dstUseBentoBox) {
      // T4
      console.log(`cook stargate transfer from bentobox on chain ${this.srcChainId} to wallet on ${this.dstChainId}`)
      this.srcCooker.srcTransferFromBentoBox(
        this.srcToken.wrapped.address,
        this.srcCooker.masterContract,
        amountIn.quotient.toString()
      )
      this.dstCooker.dstWithdraw(this.dstToken, this.user)
    }
  }

  swapTransfer() {
    //
  }

  transferSwap() {
    //
  }

  swapTransferSwap() {
    //
  }

  teleport(
    srcBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.srcChainId][0],
    dstBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.dstChainId][0],
    gasSpent = 500000
  ): void {
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
        STARGATE_CHAIN_ID[this.dstCooker.chainId],
        srcBridgeToken.address,
        STARGATE_POOL_ID[this.srcCooker.chainId][srcBridgeToken.address],
        STARGATE_POOL_ID[this.dstCooker.chainId][dstBridgeToken.address],
        0,
        0,
        0,
        this.dstCooker.masterContract,
        this.user,
        gasSpent,
        this.dstCooker.actions,
        this.dstCooker.values.map((value) => BigNumber.from(value)),
        this.dstCooker.datas,
      ]
    )

    if (this.debug) {
      console.debug('cook teleport', [
        STARGATE_CHAIN_ID[this.dstCooker.chainId],
        srcBridgeToken.address,
        STARGATE_POOL_ID[this.srcCooker.chainId][srcBridgeToken.address],
        STARGATE_POOL_ID[this.dstCooker.chainId][dstBridgeToken.address],
        0,
        0,
        0,
        this.dstCooker.masterContract,
        this.user,
        gasSpent,
        this.dstCooker.actions,
        this.dstCooker.values.map((value) => BigNumber.from(value)),
        this.dstCooker.datas,
      ])
    }

    this.srcCooker.add(Action.STARGATE_TELEPORT, data)
  }

  async cook() {
    if (!this.contract) {
      return
    }

    if (!this.srcCooker.actions.length) {
      return
    }

    if (this.crossChain && !this.dstCooker.actions.length) {
      return
    }

    // Add more validation, e.g. if teleport action is given, ensure src & dst chain are different

    if (this.debug) {
      console.debug(
        [this.srcCooker.actions, this.srcCooker.values, this.srcCooker.datas],
        [this.dstCooker.actions, this.dstCooker.values, this.dstCooker.datas]
      )
    }

    try {
      console.log('Before fee')

      const [fee] = this.crossChain
        ? await this.contract.getFee(
            STARGATE_CHAIN_ID[this.dstCooker.chainId],
            1,
            this.dstCooker.masterContract,
            500000,
            0,
            defaultAbiCoder.encode(
              ['address', 'uint8[]', 'uint256[]', 'bytes[]'],
              [this.user, this.dstCooker.actions, this.dstCooker.values, this.dstCooker.datas]
            )
          )
        : [Zero, Zero]

      console.log(`Successful Fee`, fee)

      try {
        const tx = await this.contract.cook(this.srcCooker.actions, this.srcCooker.values, this.srcCooker.datas, {
          value: this.srcCooker.values.reduce((a, b) => a.add(b), fee),
        })
        console.log(`Successful Cook Transaction`, tx)
      } catch (error) {
        console.error('SushiXSwap Cook Error', error)
      }
    } catch (error) {
      console.error('SushiXSwap Fee Error', error)
    }
  }
}
