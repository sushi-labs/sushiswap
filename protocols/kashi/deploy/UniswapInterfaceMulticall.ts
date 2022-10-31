import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const deployFunction: DeployFunction = async function ({ deployments, getNamedAccounts }: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('UniswapInterfaceMulticall', {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  })
}

export default deployFunction

deployFunction.dependencies = []

deployFunction.tags = ['UniswapInterfaceMulticall']
