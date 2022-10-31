import { ChainId } from '@sushiswap/chain'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const ParametersPerChain = {
  [ChainId.AURORA]: {
    bentoBox: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
}

const deployFunction: DeployFunction = async function ({
  deployments,
  getChainId,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const chainId = parseInt(await getChainId())
  // @ts-ignore
  const parameters = ParametersPerChain[chainId]
  const { deployer } = await getNamedAccounts()

  await deploy('KashiPairMediumRiskV1ForNear', {
    from: deployer,
    args: [parameters.bentoBox],
    log: true,
    deterministicDeployment: false,
  })
}

export default deployFunction

deployFunction.dependencies = ['BentoBoxV1']

deployFunction.tags = ['KashiPairMediumRiskV1ForNear']
