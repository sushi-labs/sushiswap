import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import { BigNumber, ethers } from 'ethers'
import { LiquidityProvider } from './LiquidityProvider'
import { getCreate2Address } from 'ethers/lib/utils'
import { keccak256, pack } from '@ethersproject/solidity'
import { SushiPoolABI } from '../../ABI/SushiPool'
import { Limited } from '../Limited'
import { PoolCode } from '../pools/PoolCode'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import { ChainId } from '@sushiswap/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, Token } from '@sushiswap/currency'
import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@sushiswap/amm'
import { LiquidityProvider2, LiquidityProviders } from './LiquidityProvider2'
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall';

const getReservesABI = [{
  inputs: [],
  name: 'getReserves',
  outputs: [
    {
      internalType: 'uint112',
      name: '_reserve0',
      type: 'uint112',
    },
    {
      internalType: 'uint112',
      name: '_reserve1',
      type: 'uint112',
    },
    {
      internalType: 'uint32',
      name: '_blockTimestampLast',
      type: 'uint32',
    },
  ],
  stateMutability: 'view',
  type: 'function',
}]

export class SushiProvider3 extends LiquidityProvider2 {
  fetchedPools: Map<string, number>
  poolCodes: PoolCode[]
  lastPoolCodeNumber: number
  multicall: Multicall

  constructor(chainDataProvider: ethers.providers.BaseProvider, chainId: ChainId, l: Limited) {
    super(chainDataProvider, chainId, l)
    this.poolCodes = []
    this.lastPoolCodeNumber = 0
    this.fetchedPools = new Map()
    this.multicall = new Multicall({ ethersProvider: chainDataProvider, tryAggregate: true });
  }

  getType(): LiquidityProviders {
    return LiquidityProviders.Sushiswap
  }

  getPoolProviderName(): string {return 'Sushiswap'}

  async getPools(tokens: Token[]): Promise<void> {
    if (FACTORY_ADDRESS[this.chainId] === undefined) {
      // No sushiswap for this network
      return
    }

    const poolAddr: Map<string, [Token, Token]> = new Map()
    for (let i = 0; i < tokens.length; ++i) {
      const t1 = tokens[i]
      for (let j = i + 1; j < tokens.length; ++j) {
        const t2 = tokens[j]
        // TODO: if it is correct ??? + make sorting !!!
        const toks: [Token, Token] = t1.address.toLowerCase() < t2.address.toLowerCase() ? [t1, t2] : [t2, t1]

        const addr = this._getPoolAddress(toks[0], toks[1])
        if (this.fetchedPools.get(addr) === undefined) {
          poolAddr.set(addr, toks)
          this.fetchedPools.set(addr, 0)
        }
      }
    }
    
    const getReservesCalls: ContractCallContext[] = Array.from(poolAddr.keys()).map(p => ({
      reference: p,
      contractAddress: p,
      abi: getReservesABI,
      calls: [{ reference: '', methodName: 'getReserves', methodParameters: [] }]
    }))
    const results: ContractCallResults = await this.multicall.call(getReservesCalls);
    const res = results.results
    for (let r in res) {
      const addr = res[r].originalContractCallContext.reference
      const ret = res[r].callsReturnContext[0]
      if (ret.success === false) {
        this.fetchedPools.set(addr, -1)
      } else {
        this.fetchedPools.set(addr, results.blockNumber)
        const res0 = BigNumber.from(ret.returnValues[0].hex)
        const res1 = BigNumber.from(ret.returnValues[1].hex)
        const toks = poolAddr.get(addr) as [Token, Token]
        const rPool = new ConstantProductRPool(addr, toks[0] as RToken, toks[1] as RToken, 0.003, res0, res1)
        const pc = new ConstantProductPoolCode(rPool, this.getPoolProviderName())
        this.poolCodes.push(pc)   
      }
    }
  }

  _getPoolAddress(t1: Token, t2: Token): string {
    return getCreate2Address(
      FACTORY_ADDRESS[this.chainId],
      keccak256(['bytes'], [pack(['address', 'address'], [t1.address, t2.address])]),
      INIT_CODE_HASH[this.chainId]
    )
  }

  _getProspectiveTokens(t0: Token, t1:Token) {
    const set = new Set<Token>([
      t0,
      t1,
      ...BASES_TO_CHECK_TRADES_AGAINST[this.chainId], 
      ...(ADDITIONAL_BASES[this.chainId][t0.address] || []),
      ...(ADDITIONAL_BASES[this.chainId][t1.address] || []),
     ])
     return Array.from(set)
  }

  startFetchPoolsData() {
    this.poolCodes = []
    this.lastPoolCodeNumber = 0
    this.fetchedPools.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
  }
  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(this._getProspectiveTokens(t0, t1))
  }
  poolListWereUpdated(): boolean {
    return this.lastPoolCodeNumber !== this.poolCodes.length
  }
  getCurrentPoolList(): PoolCode[] {
    this.lastPoolCodeNumber = this.poolCodes.length
    return this.poolCodes
  }
  stopFetchPoolsData() {}
}
