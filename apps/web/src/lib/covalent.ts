import {
  ChainID as OriginalCovalentChainId,
  GoldRushClient,
} from '@covalenthq/client-sdk'
import type { ChainId } from 'sushi/chain'

const COVALENT_API_KEY = process.env['COVALENT_API_KEY']

if (!COVALENT_API_KEY) {
  throw new Error('COVALENT_API_KEY is required')
}

export const covalentClient = new GoldRushClient(COVALENT_API_KEY)

type ParseInt<T> = T extends `${infer N extends number}` ? N : never
export type CovalentChainId = ParseInt<`${OriginalCovalentChainId}`> & ChainId

export function isCovalentChainId(
  chainId: ChainId,
): chainId is CovalentChainId {
  return Object.values(OriginalCovalentChainId).includes(
    chainId as CovalentChainId,
  )
}
