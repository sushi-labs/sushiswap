import { TWAP_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/twap/supported-chain-ids'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'

export function generateStaticParams() {
  return getStaticChainParams(TWAP_SUPPORTED_CHAIN_IDS)
}

export default function OrbsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
