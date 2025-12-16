import { useEvmWallets } from '../namespaces/evm/use-evm-wallets'

export const useWallets = () => {
  const evmWallets = useEvmWallets()

  return evmWallets
}
