import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

import type { WETH9Mock } from '../typechain'

const deployFunction: DeployFunction = async function ({
  deployments,
  ethers,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy('WETH9Mock', {
    from: deployer,
    deterministicDeployment: false,
  })

  const weth9 = await ethers.getContract<WETH9Mock>('WETH9Mock')
  await weth9.deposit({ value: 100 })
}

export default deployFunction

deployFunction.tags = ['WETH9']

deployFunction.skip = ({ getChainId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const chainId = await getChainId()
      resolve(chainId !== '31337')
    } catch (error) {
      reject(error)
    }
  })
