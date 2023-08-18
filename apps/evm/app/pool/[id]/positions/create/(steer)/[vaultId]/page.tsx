import { getSteerVault } from '@sushiswap/client'
import { unsanitize } from '@sushiswap/format'
import { SteerStrategyComponents } from 'ui/pool/Steer/Strategies'

export default async function SteerVaultPage({ params }: { params: { vaultId: string } }) {
  const vaultId = unsanitize(params.vaultId)

  const vault = await getSteerVault(vaultId)

  const Component = SteerStrategyComponents[vault.strategy]

  return <Component vault={vault} />
}
