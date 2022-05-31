import { ExternalProvider } from '@ethersproject/providers'
import { SUPPORTED_NETWORKS } from 'app/modals/NetworkModal'

interface SwitchNetworkArguments {
  provider: ExternalProvider
  chainId: number
}

export const switchToNetwork = async ({ provider, chainId }: SwitchNetworkArguments) => {
  if (!provider.request) {
    return
  }
  console.log(`Switching to chain ${chainId}`)
  const params = SUPPORTED_NETWORKS[chainId]
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: params.chainId }],
    })
    gtag('event', 'Switch', {
      event_category: 'Chain',
      event_label: params.chainName,
    })
  } catch (error) {
    console.log('Error switching network', error)
    // @ts-ignore TYPE NEEDS FIXING
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      console.log('add ethereum chain...')
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      })
      // metamask (only known implementer) automatically switches after a network is added
      // the second call is done here because that behavior is not a part of the spec and cannot be relied upon in the future
      // metamask's behavior when switching to the current network is just to return null (a no-op)
      try {
        console.log('added network and switch ethereum chain...')
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: params.chainId }],
        })
      } catch (error) {
        console.log('Added network but could not switch chains', error)
      }
    } else {
      console.log('Switch chain error', error)
      throw error
    }
  }
}
