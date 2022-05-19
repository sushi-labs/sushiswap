import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const deployFunction: DeployFunction = async function ({
  deployments,
  ethers,
  getChainId,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const chainId = parseInt(await getChainId())
  const { deployer } = await getNamedAccounts()

  const weth9 = await ethers.getContractOrNull('WETH9Mock')

  if (!weth9 && !(chainId in WNATIVE_ADDRESS)) {
    throw Error(`No WNATIVE_ADDRESS for chain #${chainId}!`)
  }

  await deploy('BentoBoxV1', {
    from: deployer,
    args: [weth9 ? weth9.address : WNATIVE_ADDRESS[chainId]],
    log: true,
    deterministicDeployment: false,
  })
}

export default deployFunction

deployFunction.dependencies = ['WETH9']

deployFunction.tags = ['BentoBoxV1']
