import { keccak256, pack } from '@ethersproject/solidity'
import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, Token } from '@sushiswap/currency'
import { ConstantProductRPool, RToken } from '@sushiswap/tines'
import {
  ContractCallContext,
  ContractCallResults,
} from 'ethereum-multicall';
import { BigNumber, ethers } from 'ethers'
import { getCreate2Address } from 'ethers/lib/utils'

import { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { ConstantProductPoolCode } from '../pools/ConstantProductPool'
import { PoolCode } from '../pools/PoolCode'
import { LiquidityProviderMC, LiquidityProviders } from './LiquidityProviderMC'

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

const callsGetReserves = [{ reference: '', methodName: 'getReserves', methodParameters: [] }]

export class SushiProviderMC extends LiquidityProviderMC {
  fetchedPools: Map<string, number> = new Map()
  poolCodes: PoolCode[] = []
  blockListener: any

  constructor(
    chainDataProvider: ethers.providers.BaseProvider, 
    multiCallProvider: MultiCallProvider,
    chainId: ChainId, 
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
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

    // tokens deduplication
    const tokenMap = new Map<string, Token>
    tokens.forEach(t => tokenMap.set(t.address.toLocaleLowerCase().substring(2).padStart(40, '0'), t))
    const tokensDedup = Array.from(tokenMap.values())
    // tokens sorting
    const tok0:[string, Token][] = 
      tokensDedup.map(t => [t.address.toLocaleLowerCase().substring(2).padStart(40, '0'), t])
    tokens = tok0.sort((a, b) => b[0] > a[0] ? -1 : 1).map(([_, t]) => t)

    const poolAddr: Map<string, [Token, Token]> = new Map()
    for (let i = 0; i < tokens.length; ++i) {
      const t0 = tokens[i]
      for (let j = i + 1; j < tokens.length; ++j) {
        const t1 = tokens[j]

        const addr = this._getPoolAddress(t0, t1)
        if (this.fetchedPools.get(addr) === undefined) {
          poolAddr.set(addr, [t0, t1])
          this.fetchedPools.set(addr, 0)
        }
      }
    }
    
    const getReservesCalls: ContractCallContext[] = Array.from(poolAddr.keys()).map(p => ({
      reference: p,
      contractAddress: p,
      abi: getReservesABI,
      calls: callsGetReserves
    }))
    const results: ContractCallResults = await this.multiCallProvider.call(getReservesCalls); 
    const res = results.results
    for (const r in res) {
      if (!poolAddr.has(r)) continue
      const addr = res[r].originalContractCallContext.contractAddress
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
        ++this.stateId
        //console.log(this.stateId, toks[0].symbol, toks[1].symbol, res0.toString(), res1.toString())        
      }
    }
  }

  // TODO: remove too often updates if the network generates too many blocks
  async updatePoolsData() {
    if (this.poolCodes.length == 0) return 

    const poolCodes = new Map<string, PoolCode>()
    this.poolCodes.forEach(p => poolCodes.set(p.pool.address, p))
    const poolAddr = this.poolCodes.map(p => p.pool.address)
    const getReservesCalls: ContractCallContext[] = this.poolCodes.map(p => ({
      reference: p.pool.address,
      contractAddress: p.pool.address,
      abi: getReservesABI,
      calls: callsGetReserves
    }))
    const results: ContractCallResults = await this.multiCallProvider.call(getReservesCalls);
    const res = results.results
    for (const r in res) {
      const addr = res[r].originalContractCallContext.contractAddress
      const ret = res[r].callsReturnContext[0]
      if (ret.success) {
        const poolCode = poolCodes.get(addr)
        if (poolCode) {
          const res0 = BigNumber.from(ret.returnValues[0].hex)
          const res1 = BigNumber.from(ret.returnValues[1].hex)
          if (!res0.eq(poolCode.pool.reserve0) || !res1.eq(poolCode.pool.reserve1)) {
            poolCode.pool.updateReserves(res0, res1)
            ++this.stateId
          }
        } 
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
    this.stopFetchPoolsData()
    this.poolCodes = []
    this.fetchedPools.clear()
    this.getPools(BASES_TO_CHECK_TRADES_AGAINST[this.chainId]) // starting the process
    this.blockListener = (_blockNumber: number) => {
      this.updatePoolsData()
    }
    this.chainDataProvider.on('block', this.blockListener)
  }
  fetchPoolsForToken(t0: Token, t1: Token): void {
    this.getPools(this._getProspectiveTokens(t0, t1))
  }
  getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }
  stopFetchPoolsData() {
    if (this.blockListener)
      this.chainDataProvider.off('block', this.blockListener)
    this.blockListener = undefined
  }
}
