import { AMM_SUPPORTED_CHAIN_IDS } from 'src/config'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'

export function generateStaticParams() {
  return getStaticChainParams(AMM_SUPPORTED_CHAIN_IDS)
}

export default function TokenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
