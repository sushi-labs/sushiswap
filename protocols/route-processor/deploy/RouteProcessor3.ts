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

  const args = [BENTOBOX_ADDRESS[chainId], []]

  // const args = ['0x0000000000000000000000000000000000000000', []]

  const { address } = await deploy('RouteProcessor3', {
    from: deployer,
    args,
    // waitConfirmations: 5,
  })

  // await run('verify:verify', {
  //   address,
  //   constructorArguments: args,
  // })

  console.log(`RouteProcessor3 deployed to ${address}`)
}

func.tags = ['RouteProcessor3']

export default func
