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

  if (!isBentoBoxV1ChainId(chainId)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  const args = [bentoBoxV1Address[chainId]]

  // const args = ['0x0000000000000000000000000000000000000000']

  const { address } = await deploy('RouteProcessor2', {
    from: deployer,
    args,
    waitConfirmations: 20,
  })

  await run('verify:verify', {
    address,
    constructorArguments: args,
  })

  console.log(`RouteProcessor2 deployed to ${address}`)
}

func.tags = ['RouteProcessor2']

export default func
