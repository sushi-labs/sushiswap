'use client'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { useAccount, usePrivyEmbeddedWallet } from 'src/lib/wallet'
import { useSwitchChain as useWagmiSwitchChain } from 'wagmi'

export const useSwitchChain = (
  params?: Parameters<typeof useWagmiSwitchChain>[number],
) => {
  const { setActiveWallet } = useSetActiveWallet()
  const privyEmbeddedWallet = usePrivyEmbeddedWallet('evm')
  const address = useAccount('evm')
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
    if (
      privyEmbeddedWallet &&
      privyEmbeddedWallet.address.toLowerCase() === address?.toLowerCase()
    ) {
      await privyEmbeddedWallet?.switchChain?.(chainId)
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
    if (
      privyEmbeddedWallet &&
      privyEmbeddedWallet.address.toLowerCase() === address?.toLowerCase()
    ) {
      privyEmbeddedWallet?.switchChain?.(chainId)?.then(() => {
        setActiveWallet(privyEmbeddedWallet)
      })
    }
  }

  return {
    ...switchChain,
    mutateAsync: switchChainAsync,
    mutate: switchChainSync,
  }
}
