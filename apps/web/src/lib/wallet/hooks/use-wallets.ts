import { useMemo } from 'react'
import { useEvmWalletContext } from '../namespaces/evm/provider/evm-wallet-provider'
import { useSvmWalletContext } from '../namespaces/svm/provider/svm-wallet-provider'

export const useWallets = () => {
  const { wallets: evmWallets } = useEvmWalletContext()
  const { wallets: svmWallets } = useSvmWalletContext()

  return useMemo(() => [...svmWallets, ...evmWallets], [svmWallets, evmWallets])
}
