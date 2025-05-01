'use client'

import { Container } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { useHeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector';
import { TWAP_SUPPORTED_CHAIN_IDS } from 'src/config';

const TWAPPanel = dynamic(
  () => import('src/ui/swap/twap/twap').then((it) => it.TWAPPanel),
  { ssr: false },
)

export default function SwapDCAPage() {
  useHeaderNetworkSelector(TWAP_SUPPORTED_CHAIN_IDS);

  return (
    <Container maxWidth="lg" className="px-4 relative">
      <TWAPPanel />
    </Container>
  )
}
