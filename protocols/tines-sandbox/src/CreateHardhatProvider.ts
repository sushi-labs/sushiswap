import hre from 'hardhat'
import { createProvider } from 'hardhat/internal/core/providers/construction.js'
import { ChainId } from 'sushi/chain'

const { config } = hre

export async function createHardhatProvider(
  chainId: ChainId,
  url: string,
  blockNumber: number,
) {
  return await createProvider(
    {
      ...config,
      defaultNetwork: 'hardhat',
      networks: {
        ...config.networks,
        hardhat: {
          ...config.networks.hardhat,
          chainId,
          forking: {
            enabled: true,
            url,
            blockNumber,
          },
          accounts: {
            mnemonic:
              'test test test test test test test test test test test oooops',
            path: "m/44'/60'/0'/0",
            initialIndex: 0,
            count: 20,
            passphrase: '',
            accountsBalance: `0x${(10n ** 50n).toString(16)}`,
          },
        },
      },
    },
    'hardhat',
  )
}

export async function createHardhatProviderEmptyBlockchain(chainId = 31337) {
  const provider = await createProvider(
    {
      ...config,
      defaultNetwork: 'hardhat',
      networks: {
        ...config.networks,
        hardhat: {
          ...config.networks.hardhat,
          allowUnlimitedContractSize: true,
          chainId,
          forking: undefined,
        },
      },
    },
    'hardhat',
  )

  return { provider, chainId: chainId as ChainId }
}
