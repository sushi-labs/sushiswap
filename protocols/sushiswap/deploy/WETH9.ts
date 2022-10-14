import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function ({ deployments, ethers, getNamedAccounts }: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy('WETH9', {
    from: deployer,
    deterministicDeployment: false,
  })
}

export default func

func.tags = ['WETH9']

func.skip = ({ getChainId }) =>
  new Promise((resolve, reject) => {
    getChainId()
      .then((chainId) => resolve(chainId !== '31337'))
      .catch((error) => reject(error))
  })
