import bentoBoxExports from '@sushiswap/bentobox/exports'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  run,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  if (!(chainId in bentoBoxExports)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  const args = [
    bentoBoxExports?.[chainId.toString() as keyof Omit<typeof bentoBoxExports, '31337'>]?.[0]?.contracts?.BentoBoxV1
      ?.address,
  ]

  const { address } = await deploy('RouteProcessor', {
    from: deployer,
    args,
  })

  await run('verify:verify', {
    address,
    constructorArguments: args,
    waitConfirmations: 20,
  })

  console.log(`RouteProcessor deployed to ${address}`)
}

export default func
