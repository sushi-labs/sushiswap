import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { BENTOBOX_ADDRESS, isBentoBoxChainId } from 'sushi/config'

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  run,
  getChainId,
}: HardhatRuntimeEnvironment) {
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
