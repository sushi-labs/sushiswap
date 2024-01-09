import { PoolCode } from '@sushiswap/router'
// import {
//   ADDITIONAL_BASES,
//   BASES_TO_CHECK_TRADES_AGAINST,
// } from '@sushiswap/router-config'
import { ChainId } from 'sushi/chain'
import { Native, Token, Type } from 'sushi/currency'

export class ExtractorClient {
  chainId: ChainId
  extractorServer: string
  tokenMap: Map<string, Token> = new Map()
  poolCodes: PoolCode[] = []

  constructor(chainId: ChainId, extractorServer: string) {
    this.chainId = chainId
    this.extractorServer = extractorServer
  }

  // fetch pools for the pair if we didn't do it previously
  async fetchTokenPairPools(_addr0: string, _addr1: string) {
    // TODO
  }

  getKnownPoolCodesForTokens(_t0: Type, _t1: Type): Map<string, PoolCode> {
    // TODO
    return new Map()
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
}
