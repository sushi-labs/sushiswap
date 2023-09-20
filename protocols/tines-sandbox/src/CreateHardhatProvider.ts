import { ChainId } from '@sushiswap/chain'
import { config } from 'hardhat'
import { createProvider } from 'hardhat/internal/core/providers/construction'

export async function createHardhatProvider(chainId: ChainId, url: string, blockNumber: number) {
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
        },
      },
    },
    'hardhat'
  )
}

export async function createHardhatProviderEmptyBlockchain() {
  return await createProvider(
    {
      ...config,
      defaultNetwork: 'hardhat',
      networks: {
        ...config.networks,
        hardhat: {
          ...config.networks.hardhat,
          allowUnlimitedContractSize: true,
          chainId: 31337,
          forking: undefined,
        },
      },
    },
    'hardhat'
  )
}
