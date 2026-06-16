'use client'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet'
import { useSwitchChain as useWagmiSwitchChain } from 'wagmi'

export const useSwitchChain = (
  params?: Parameters<typeof useWagmiSwitchChain>[number],
) => {
  const { setActiveWallet } = useSetActiveWallet()
  const privyEmbeddedWallet = usePrivyEmbeddedWallet('evm')

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
