import { readContracts } from '@wagmi/core'
import type { EvmAddress, EvmChainId } from 'sushi/evm'
import { erc20Abi } from 'viem'
import type { Config } from 'wagmi'

export async function getToken(
  config: Config,
  {
    address,
    chainId,
  }: {
    address: EvmAddress
    chainId: EvmChainId
  },
) {
  const result = await readContracts(config, {
    contracts: [
      {
        address,
        chainId,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address,
        chainId,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address,
        chainId,
        abi: erc20Abi,
        functionName: 'name',
      },
    ],
    allowFailure: false,
  })

  return {
    decimals: result[0],
    symbol: result[1],
    name: result[2],
    address,
    chainId,
  }
}
