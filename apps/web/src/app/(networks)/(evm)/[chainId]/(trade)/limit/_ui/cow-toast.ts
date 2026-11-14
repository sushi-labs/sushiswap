import { createSuccessToast } from '@sushiswap/notifications'
import { type CowLimitChainId, getCowOrderLink } from 'src/lib/swap/cow/chains'
import type { EvmAddress } from 'sushi/evm'

export function toastCowOrder({
  chainId,
  owner,
  uid,
  summary,
}: {
  chainId: CowLimitChainId
  owner: EvmAddress | undefined
  uid: string
  summary: string
}): void {
  const timestamp = Date.now()
  void createSuccessToast({
    account: owner,
    type: 'swap',
    chainId,
    summary,
    href: getCowOrderLink(chainId, uid),
    timestamp,
    groupTimestamp: timestamp,
  })
}
