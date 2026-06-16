'use client'
import { useWallets } from '@privy-io/react-auth'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { useMemo } from 'react'
import { getEmbeddedPrivyWallet } from 'src/lib/wallet/privy'
import { useSwitchChain as useWagmiSwitchChain } from 'wagmi'

export const useSwitchChain = (
  params?: Parameters<typeof useWagmiSwitchChain>[number],
) => {
  const { wallets } = useWallets()
  const { setActiveWallet } = useSetActiveWallet()
  const privyEmbeddedWallet = useMemo(() => {
    return getEmbeddedPrivyWallet(wallets)
  }, [wallets])

  const switchChain = useWagmiSwitchChain(params)

  const switchChainAsync = async (
    params: ReturnType<typeof useWagmiSwitchChain>['mutateAsync'] extends (
      arg: infer P,
    ) => any
      ? P
      : never,
  ) => {
    const { chainId } = params
    await switchChain.mutateAsync(params)
    await privyEmbeddedWallet?.switchChain?.(chainId)
    if (privyEmbeddedWallet) {
      setActiveWallet(privyEmbeddedWallet)
    }
  }
  const switchChainSync = (
    params: ReturnType<typeof useWagmiSwitchChain>['mutateAsync'] extends (
      arg: infer P,
    ) => any
      ? P
      : never,
  ) => {
    const { chainId } = params
    switchChain.mutate(params)
    privyEmbeddedWallet?.switchChain?.(chainId)?.then(() => {
      if (privyEmbeddedWallet) {
        setActiveWallet(privyEmbeddedWallet)
      }
    })
  }

  return {
    ...switchChain,
    mutateAsync: switchChainAsync,
    mutate: switchChainSync,
  }
}
