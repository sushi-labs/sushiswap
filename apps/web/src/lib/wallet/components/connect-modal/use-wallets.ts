import { useMemo } from 'react'
import { useEvmWallets } from '../../namespaces/evm/provider/use-evm-wallets'
import { useSvmWallets } from '../../namespaces/svm/provider/use-svm-wallets'

export const useWallets = () => {
  const evmWallets = useEvmWallets()
  const svmWallets = useSvmWallets()

  return useMemo(() => [...svmWallets, ...evmWallets], [svmWallets, evmWallets])
}
