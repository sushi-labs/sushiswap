import { Container } from '@sushiswap/ui'
import { GeoBlockedMessage } from '~evm/perps/_ui/_common'
import { VaultPage } from './_ui/vault-page'

export default async function PerpVaultViewPage({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address } = await params

  return (
    <div className="overflow-x-hidden min-h-[calc(100vh-56px)] bg-perps-background">
      <GeoBlockedMessage />
      <Container maxWidth="7xl" className="px-2 pb-4 pt-6 md:px-4 md:pt-12">
        <VaultPage vaultAddress={address} />
      </Container>
    </div>
  )
}
