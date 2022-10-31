import { ChainId } from '@sushiswap/chain'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const ParametersPerChain = {
  [ChainId.AURORA]: {
    factory: '0xc66F594268041dB60507F00703b152492fb176E7',
    bentoBox: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    pairCodeHash: '0x754e1d90e536e4c1df81b7f030f47b4ca80c87120e145c294f098c83a6cb5ace',
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

  await deploy('SushiSwapMultiExactSwapper', {
    from: deployer,
    args: [parameters.factory, parameters.bentoBox, parameters.pairCodeHash],
    log: true,
    deterministicDeployment: false,
  })
}

export default deployFunction

deployFunction.dependencies = ['BentoBoxV1']

deployFunction.tags = ['SushiSwapMultiExactSwapper']
