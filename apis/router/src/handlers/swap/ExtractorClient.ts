import { PoolCode } from '@sushiswap/router'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '@sushiswap/router-config'
import { ChainId } from 'sushi/chain'
import { Native, Token, Type } from 'sushi/currency'

function tokenAddr(t: Type) {
  return t.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : t.address
}

function tokenId(t: Type) {
  return t.isNative ? 'native' : t.address.toLowerCase()
}

function tokenPairId(t0: Type, t1: Type) {
  const id0 = tokenId(t0)
  const id1 = tokenId(t1)
  return id0 < id1 ? id0 + id1 : id1 + id0
}

export class ExtractorClient {
  chainId: ChainId
  extractorServer: string
  tokenMap: Map<string, Token> = new Map()
  poolCodesMap: Map<string, PoolCode[]> = new Map()

  constructor(chainId: ChainId, extractorServer: string) {
    this.chainId = chainId
    this.extractorServer = extractorServer
  }

  // fetch pools for the pair if we didn't do it previously
  async fetchTokenPairPools(t0: Type, t1: Type) {
    const id = tokenPairId(t0, t1)
    if (this.poolCodesMap.get(id) !== undefined) return

    const resp = await fetch(
      `${this.extractorServer}/pools/${tokenAddr(t0)}/${tokenAddr(t1)}`,
    )
    if (resp.status !== 200) return
    const pools = (await resp.json()) as PoolCode[]
    this.poolCodesMap.set(id, pools)
    return pools
  }

  getKnownPoolCodesForTokens(t0: Type, t1: Type): Map<string, PoolCode> {
    this.fetchTokenPairPools(t0, t1)
    const tokens = this._getTokenListSorted(t0, t1)
    const pools: Map<string, PoolCode> = new Map()
    for (let i = 0; i < tokens.length; ++i) {
      for (let j = i + 1; j < tokens.length; ++j) {
        const pairPools = this.poolCodesMap.get(
          // @ts-ignore
          tokenPairId(tokens[i], tokens[j]),
        )
        if (pairPools !== undefined)
          pairPools.forEach((p) => pools.set(p.pool.uniqueID(), p))
      }
    }
    return pools
  }

  async fetchPoolCodesForTokens(
    _t0: Type,
    _t1: Type,
    _timeout: number,
  ): Promise<Map<string, PoolCode>> {
    return new Map()
  }

  getToken(addr: string): Type | Promise<Type | undefined> {
    const addrL = addr.toLowerCase()
    if (addrL === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      return Native.onChain(this.chainId)
    const token = this.tokenMap.get(addrL)
    if (token !== undefined) return token
    return this._requestToken(addr)
  }

  async _requestToken(addr: string): Promise<Token | undefined> {
    const resp = await fetch(`${this.extractorServer}/token/${addr}`)
    if (resp.status === 422) return // token don't exist
    if (resp.status !== 200)
      throw new Error(`Extractor server error ${resp.status}`)
    const data = (await resp.json()) as Token
    return new Token({ ...data })
  }

  _getTokenListSorted(t0: Type, t1: Type): Type[] {
    const common = BASES_TO_CHECK_TRADES_AGAINST[this.chainId] ?? []
    const additionalA =
      ADDITIONAL_BASES[this.chainId]?.[t0.wrapped.address] ?? []
    const additionalB =
      ADDITIONAL_BASES[this.chainId]?.[t1.wrapped.address] ?? []

    const tokensSorted = [
      Native.onChain(this.chainId),
      t0.wrapped,
      t1.wrapped,
      ...common,
      ...additionalA,
      ...additionalB,
    ].sort((t0, t1) => (tokenId(t0) < tokenId(t1) ? -1 : 1))
    const tokensUnique: Type[] = []
    tokensSorted.forEach((t) => {
      if (tokensUnique.length === 0) tokensUnique.push(t)
      // @ts-ignore
      else if (tokenId(tokensUnique[tokensUnique.length - 1]) !== tokenId(t))
        tokensUnique.push(t)
    })

    return tokensUnique
  }
}
