import { constantProductPoolAbi, constantProductPoolFactoryAbi } from '@sushiswap/abi'
import { ConstantProductPool } from '@sushiswap/amm'
import { Amount, Currency, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { Address, readContracts } from 'wagmi'

import { getContract } from 'wagmi/actions'
import { getConstantProductPoolFactoryContract } from '../../../contracts/actions'
import { pairsUnique } from './utils'

export enum ConcentratedLiquidityState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

interface PoolData {
  address: string
  token0: Token
  token1: Token
}

export const getConcentratedLiquidityPools = async (
  chainId: number,
  currencies: [Currency | undefined, Currency | undefined][]
) => {}
