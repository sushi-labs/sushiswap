import { notFound } from 'next/navigation'
import {
  type StellarContractAddress,
  isStellarContractAddress,
} from 'sushi/stellar'
import { PoolPage } from './_ui/pool-page'

interface PoolPageProps {
  params: Promise<{
    address: StellarContractAddress
  }>
}

export default async function StellarPoolPage({ params }: PoolPageProps) {
  const resolvedParams = await params
  const address = decodeURIComponent(resolvedParams.address)
  if (!isStellarContractAddress(address)) {
    notFound()
  }
  return <PoolPage address={address} />
}
