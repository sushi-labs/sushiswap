import { getSteerVault, getSteerVaultUrl } from '@sushiswap/client'
import { unsanitize } from '@sushiswap/format'

export default async function SteerVaultPage({ params }: { params: { vaultId: string } }) {
  const vaultId = unsanitize(params.vaultId)

  console.log(getSteerVaultUrl(vaultId))
  const vault = await getSteerVault(vaultId)
  console.log(vault)
  return <></>
}
