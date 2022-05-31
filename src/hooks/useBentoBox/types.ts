import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { ChainId, JSBI } from '@sushiswap/core-sdk'

export type Action<T, P = { data: string; value?: BigNumber }> = (x: T) => P

export interface DepositActionPayload {
  chainId: ChainId
  bentobox: Contract
  tokenAddress: string
  amount: BigNumber
  account: string
}

export interface WithdrawAction {
  bentobox: Contract
  chainId: ChainId
  tokenAddress: string
  amount: BigNumber
  account: string
  share?: JSBI
}

export interface HarvestAction {
  bentobox: Contract
  tokenAddress: string
  rebalance: boolean
}

export interface BatchAction {
  bentobox: Contract
  actions: string[]
  revertOnFail: boolean
}
