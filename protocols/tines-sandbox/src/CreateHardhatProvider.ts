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
    'hardhat'
  )

  return { provider, chainId: chainId as ChainId }
}
