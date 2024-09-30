import { getV3BasePoolsByToken } from '@sushiswap/graph-client/data-api'
import { isSushiSwapV3ChainId } from 'sushi/config'
import { getChainIdAddressFromId } from 'sushi/format'

export const getV3PoolsByTokenPair = async (
  tokenId0: string,
  tokenId1: string,
) => {
  const { chainId: chainId0, address: address0 } =
    getChainIdAddressFromId(tokenId0)
  const { chainId: chainId1, address: address1 } =
    getChainIdAddressFromId(tokenId1)

  if (chainId0 !== chainId1) throw Error('Tokens must be on the same chain')

  if (!isSushiSwapV3ChainId(chainId0)) {
    throw Error('Invalid chain id')
  }

  const pools = await getV3BasePoolsByToken({
    chainId: chainId0,
    token0: address0,
    token1: address1,
  })

  return pools
}
