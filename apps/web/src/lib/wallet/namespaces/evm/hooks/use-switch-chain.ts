'use client'
// biome-ignore lint/nursery/noRestrictedImports: this wrapper is the sanctioned direct Wagmi switch-chain integration
import { useSwitchChain as useWagmiSwitchChain } from 'wagmi'

export const useSwitchChain = (
  params?: Parameters<typeof useWagmiSwitchChain>[number],
) => {
  return useWagmiSwitchChain(params)
}
