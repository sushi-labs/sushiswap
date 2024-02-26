import { Token } from '../../currency/index.js'
import { RToken } from '../RPool.js'
import { getBentoChainId } from './getBentoChainId.js'

export function convertTokenToBento(token: Token): RToken {
  const t: RToken = { ...token } as RToken
  t.chainId = getBentoChainId(token.chainId)
  t.name = getBentoChainId(token.name)
  t.symbol = getBentoChainId(token.symbol)
  delete t.tokenId
  return t
}
