import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function ({ getNamedAccounts, deployments, getChainId }: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = parseInt(await getChainId()) as ChainId

  if (!(chainId in BENTOBOX_ADDRESS)) throw new Error('BENTOBOX_ADDRESS not found')
  if (!(chainId in WNATIVE_ADDRESS)) throw new Error('WNATIVE_ADDRESS not found')

  const { address } = await deploy('RouteProcessor', {
    from: deployer,
    args: [BENTOBOX_ADDRESS[chainId], WNATIVE_ADDRESS[chainId]],
  })

  console.log(`RouteProcessor deployed to ${address}`)
}

export default func
