'use client'

import { useMemo } from 'react'
import { useEvmWallets } from 'src/lib/wallet/namespaces/evm/provider/use-evm-wallets'
import { useSvmWallets } from 'src/lib/wallet/namespaces/svm/provider/use-svm-wallets'

export const useWallets = () => {
  const evmWallets = useEvmWallets()
  const svmWallets = useSvmWallets()

  return useMemo(() => [...svmWallets, ...evmWallets], [svmWallets, evmWallets])
}
