import { NetworkName, useWallet } from '@aptos-labs/wallet-adapter-react'
import { chains, isSupportedNetwork } from 'config/chains'
import { useMemo } from 'react'

const defaultNetwork = NetworkName.Mainnet

export function useNetwork() {
  const { network } = useWallet()

  return useMemo(() => {
    // Don't ask me
    if (!network?.name) return chains[defaultNetwork]
    const networkName = network?.name.toLowerCase() as NetworkName
    if (!isSupportedNetwork(networkName)) return chains[defaultNetwork]

    return chains[networkName]
  }, [network])
}
