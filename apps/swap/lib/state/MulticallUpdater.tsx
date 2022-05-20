import { ChainId } from '@sushiswap/chain'
import UniswapInterfaceMulticallArtifact from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { MULTICALL_ADDRESS } from 'config'
import { UniswapInterfaceMulticall } from 'typechain'
import { useBlockNumber, useContract, useProvider } from 'wagmi'

import { multicall } from './multicall'

interface Props {
  chainId: ChainId
}

// Wagmi wrapper for redux multicall
export function Updater({ chainId }: Props) {
  const provider = useProvider({ chainId })
  const contract = useContract<UniswapInterfaceMulticall>({
    addressOrName: MULTICALL_ADDRESS[chainId],
    contractInterface: UniswapInterfaceMulticallArtifact.abi,
    signerOrProvider: provider,
  })
  const { data: latestBlockNumber } = useBlockNumber({ chainId })
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}
