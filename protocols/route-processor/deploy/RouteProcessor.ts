import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}: HardhatRuntimeEnvironment) => {
  const { BENTOBOX_ADDRESS, isBentoBoxChainId } = await import('sushi/config')

  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  if (!isBentoBoxChainId(chainId)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  const args = [BENTOBOX_ADDRESS[chainId]]

  const { address } = await deploy('RouteProcessor', {
    from: deployer,
    args,
    waitConfirmations: 20,
  })

  // await run('verify:verify', {
  //   address,
  //   constructorArguments: args,
  //   waitConfirmations: 20,
  // })

  console.log(`RouteProcessor deployed to ${address}`)
}

func.tags = ['RouteProcessor']

export default func
