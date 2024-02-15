import { Token } from 'sushi/currency'
import { RToken } from '../RPool'
import { getBentoChainId } from './getBentoChainId'

export function convertTokenToBento(token: Token): RToken {
  const t: RToken = { ...token } as RToken
  t.chainId = getBentoChainId(token.chainId)
  t.name = getBentoChainId(token.name)
  t.symbol = getBentoChainId(token.symbol)
  delete t.tokenId
  return t
}
