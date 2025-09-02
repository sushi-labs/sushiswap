import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import { getCachedBladePool, getPoolName } from 'src/lib/pool/blade'
import { type EvmChainId, isBladeChainId } from 'sushi/evm'
import { isAddress } from 'viem'

export async function generateMetadata(props: {
  params: Promise<{ chainId: string; address: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return {}
  }

  const pool = await getCachedBladePool(chainId, address)

  if (!pool) {
    return {}
  }

  const poolName = getPoolName(pool, { showStableTypes: false })

  return {
    title: `BUY & SELL ${poolName}`,
  }
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params

  const { children } = props

  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (!isBladeChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  const pool = await getCachedBladePool(chainId, address)

  if (!pool) {
    return notFound()
  }

  return <>{children}</>
}
