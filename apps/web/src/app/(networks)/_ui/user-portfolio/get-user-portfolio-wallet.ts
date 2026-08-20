import { ChainId } from 'sushi'

export function getUserPortfolioWallet<TEvm, TSvm, TStellar>(
  wallets: {
    evm: TEvm | undefined
    svm: TSvm | undefined
    stellar: TStellar | undefined
  },
  selectedNetwork: ChainId | undefined,
): TEvm | TSvm | TStellar | undefined {
  if (selectedNetwork === ChainId.SOLANA) {
    return wallets.svm ?? wallets.evm ?? wallets.stellar
  }

  if (selectedNetwork === ChainId.STELLAR) {
    return wallets.stellar ?? wallets.evm ?? wallets.svm
  }

  return wallets.evm ?? wallets.svm ?? wallets.stellar
}
