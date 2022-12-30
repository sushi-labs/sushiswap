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

  const bentoBox = await ethers.getContractOrNull('BentoBoxV1')

  if (!bentoBox) {
    throw Error(`No bentoBox for chain #${chainId}!`)
  }

  await deploy('KashiPairMediumRiskV1', {
    from: deployer,
    args: [bentoBox.address],
    log: true,
    deterministicDeployment: false,
  })
}

export default deployFunction

deployFunction.dependencies = ['BentoBoxV1']

deployFunction.tags = ['KashiPairMediumRiskV1']
