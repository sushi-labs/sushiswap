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

  const args = [
    isBentoBoxChainId(chainId)
      ? BENTOBOX_ADDRESS[chainId]
      : '0x0000000000000000000000000000000000000000',
    [],
  ]

  const { address } = await deploy('RouteProcessor3_1', {
    from: deployer,
    args,
  })

  console.log(`RouteProcessor3_1 deployed to ${address}`)

  await run('verify:verify', {
    address,
    constructorArguments: args,
  })

  console.log('RouteProcessor3_1 verified')
}

func.tags = ['RouteProcessor3_1']

export default func
