import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Signature } from '@ethersproject/bytes'
import { AddressZero, Zero } from '@ethersproject/constants'
import { TransactionRequest } from '@ethersproject/providers'
import { Amount, Currency, Native, Share, Token } from '@sushiswap/currency'
import { STARGATE_BRIDGE_TOKENS, STARGATE_CHAIN_ID, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { SushiXSwap as SushiXSwapContract } from '@sushiswap/sushixswap/typechain'
import { getSushiXSwapContractConfig } from '@sushiswap/wagmi'
import { formatBytes32String } from 'ethers/lib/utils'

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

  // Stargate teleport
  STARGATE_TELEPORT = 10,
}

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

  srcDepositToBentoBox(
    currency: Currency,
    recipient = this.user,
    amount: BigNumberish = Zero,
    share: BigNumberish = Zero
  ): void {
    if (this.debug)
      console.debug('cook src depoit to bentobox', {
        currency,
        recipient,
        amount,
        share,
      })
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256'],
      [currency.isToken ? currency.address : AddressZero, recipient, BigNumber.from(amount), BigNumber.from(share)]
    )

    const value = currency.isNative ? amount : Zero

    this.add(Action.SRC_DEPOSIT_TO_BENTOBOX, data, value)
  }

  srcTransferFromBentoBox(
    token: Currency,
    to: string,
    amount: BigNumberish,
    share: BigNumberish = Zero,
    unwrap: boolean
  ): void {
    if (this.debug)
      console.debug('cook src transfer from bentobox', {
        token,
        to,
        amount,
        share,
        unwrap,
      })
    this.add(
      Action.SRC_TRANSFER_FROM_BENTOBOX,
      defaultAbiCoder.encode(
        ['address', 'address', 'uint256', 'uint256', 'bool'],
        [token.wrapped.address, to, BigNumber.from(amount), BigNumber.from(share), unwrap]
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
        [token.isToken ? token.address : AddressZero, to, BigNumber.from(amount), BigNumber.from(share)]
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
    share: BigNumberish = Zero,
    unwrap: boolean
  ): void {
    const data = defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'uint256', 'bool'],
      [token.isToken ? token.address : AddressZero, to, BigNumber.from(amount), BigNumber.from(share), unwrap]
    )
    const value = token.isNative ? amount : Zero
    this.add(Action.DST_WITHDRAW_FROM_BENTOBOX, data, value)
  }

  unwrapAndTransfer(token: Currency, to: string = this.user): void {
    this.add(Action.UNWRAP_AND_TRANSFER, defaultAbiCoder.encode(['address', 'address'], [token.wrapped.address, to]))
  }
}

export class SrcCooker extends Cooker {
  setMasterContractApproval(signature: Signature): void {
    if (this.debug) console.log('cook set master contract address', signature)
    this.add(
      Action.SET_MASTER_CONTRACT_APPROVAL,
      defaultAbiCoder.encode(
        ['address', 'bool', 'uint8', 'bytes32', 'bytes32'],
        [this.user, true, signature.v, signature.r, signature.s]
      )
    )
  }
}

export class DstCooker extends Cooker {}

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

// SushiXSwap
export class SushiBridge {
  readonly adapter: Adapter = new StargateAdapter()

  readonly srcCooker: SrcCooker

  readonly dstCooker: DstCooker

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
      masterContract: getSushiXSwapContractConfig(this.srcToken.chainId).addressOrName,
      user,
    })

    this.dstCooker = new DstCooker({
      chainId: this.dstChainId,
      debug,
      masterContract: getSushiXSwapContractConfig(this.dstToken.chainId).addressOrName,
      user,
    })
  }

  // Transfers Scenarios
  // T1: BentoBox - Stargate - BentoBox
  // T2: Wallet - Stargate - Wallet
  // T3: Wallet - Stargate - BentoBox
  // T4: BentoBox - Stargate - Wallet
  transfer(amountIn: Amount<Currency>, shareIn: Share<Currency>): void {
    // T1-T4
    if (!this.srcUseBentoBox) {
      this.srcCooker.srcDepositToBentoBox(this.srcToken, this.user, 0, shareIn.quotient.toString())
    }
    this.srcCooker.srcTransferFromBentoBox(
      this.srcToken,
      this.srcCooker.masterContract,
      0,
      shareIn.quotient.toString(),
      true
    )
    this.dstCooker[this.dstUseBentoBox ? 'dstDepositToBentoBox' : 'dstWithdraw'](this.dstToken)
  }

  teleport(
    srcBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.srcChainId][0],
    dstBridgeToken: Token = STARGATE_BRIDGE_TOKENS[this.dstChainId][0],
    gasSpent = 1000000,
    id: string,
    amountMin: Amount<Currency> = Amount.fromRawAmount(dstBridgeToken, 0),
    dustAmount: Amount<Currency> = Amount.fromRawAmount(Native.onChain(this.dstChainId), 0)
  ): void {
    // uint16 dstChainId; // stargate dst chain id
    // address token; // token getting bridged
    // uint256 srcPoolId; // stargate src pool id
    // uint256 dstPoolId; // stargate dst pool id
    // uint256 amount; // amount to bridge
    // uint256 amountMin; // amount to bridge minimum
    // uint256 dustAmount; // native token to be received on dst chain
    // address receiver; // sushiXswap on dst chain
    // address to; // receiver bridge token incase of transaction reverts on dst chain
    // uint256 gas; // extra gas to be sent for dst chain operations
    // bytes32 srcContext; // random bytes32 as source context

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
        'bytes32',
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
        amountMin.quotient.toString(),
        dustAmount.quotient.toString(),
        this.dstCooker.masterContract,
        this.user,
        gasSpent,
        formatBytes32String(id),
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
        id,
        this.dstCooker.actions,
        this.dstCooker.values.map((value) => BigNumber.from(value)),
        this.dstCooker.datas,
      ])
    }

    this.srcCooker.add(Action.STARGATE_TELEPORT, data)
  }

  async getFee(gasSpent = 1000000) {
    return this.crossChain
      ? await this.contract.getFee(
          STARGATE_CHAIN_ID[this.dstCooker.chainId],
          1,
          this.dstCooker.masterContract,
          gasSpent,
          0,
          defaultAbiCoder.encode(
            ['address', 'uint8[]', 'uint256[]', 'bytes[]'],
            [this.user, this.dstCooker.actions, this.dstCooker.values, this.dstCooker.datas]
          )
        )
      : [Zero, Zero]
  }

  async cook(gasSpent = 1000000): Promise<Partial<(TransactionRequest & { to: string }) | undefined>> {
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
      // console.log('Before fee')

      const [fee] = await this.getFee(gasSpent)

      // console.log(`Successful Fee`, fee)

      const value = this.srcCooker.values.reduce((a, b) => a.add(b), fee)
      return {
        from: this.user,
        to: this.contract.address,
        data: this.contract.interface.encodeFunctionData('cook', [
          this.srcCooker.actions,
          this.srcCooker.values,
          this.srcCooker.datas,
        ]),
        value,
      }
    } catch (error) {
      console.log('SushiXSwap Fee Error', error)
    }
  }
}
