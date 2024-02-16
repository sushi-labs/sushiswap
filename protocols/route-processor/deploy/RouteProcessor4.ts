import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  run,
  getChainId,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  const args = ['0x0000000000000000000000000000000000000000', []]

  const { address } = await deploy('RouteProcessor4', {
    from: deployer,
    args,
    waitConfirmations: 16,
  })

  console.log(`RouteProcessor4 deployed to ${address}`)

  await run('verify:verify', {
    address,
    constructorArguments: args,
  })

  console.log('RouteProcessor4 verified')
}

func.tags = ['RouteProcessor4']

export default func
