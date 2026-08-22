import type { ChainId } from 'sushi'
import { isStellarChainId } from 'sushi/stellar'
import { isSvmChainId } from 'sushi/svm'

export function getUserPortfolioWallet<TEvm, TSvm, TStellar>(
  wallets: {
    evm: TEvm | undefined
    svm: TSvm | undefined
    stellar: TStellar | undefined
  },
  selectedNetwork: ChainId | undefined,
): TEvm | TSvm | TStellar | undefined {
  const evmOrder = wallets.evm ?? wallets.svm ?? wallets.stellar

  if (!selectedNetwork) {
    return evmOrder
  }

  if (isSvmChainId(selectedNetwork)) {
    return wallets.svm ?? wallets.evm ?? wallets.stellar
  }

  if (isStellarChainId(selectedNetwork)) {
    return wallets.stellar ?? wallets.evm ?? wallets.svm
  }

  return evmOrder
}
