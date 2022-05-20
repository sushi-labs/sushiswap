import UniswapInterfaceMulticallArtifact from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { MULTICALL_ADDRESS } from 'config'
import { UniswapInterfaceMulticall } from 'typechain'
import { useContract, useProvider } from 'wagmi'

export function useMulticallContract({ chainId }: { chainId: number }) {
  const signerOrProvider = useProvider({ chainId })
  return useContract<UniswapInterfaceMulticall>({
    addressOrName: MULTICALL_ADDRESS[chainId],
    contractInterface: UniswapInterfaceMulticallArtifact.abi,
    signerOrProvider,
  })
}
