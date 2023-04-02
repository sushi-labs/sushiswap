import { bentoBoxV1Exports, bentoBoxV1Address } from '@sushiswap/bentobox/exports/exports'
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

  console.log({deployer, chainId})
  if (!(chainId in bentoBoxV1Exports)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  const args = [bentoBoxV1Address[chainId as keyof typeof bentoBoxV1Address]]

  const { address } = await deploy('RouteProcessor2', {
    from: deployer,
    args,
  })

  await run('verify:verify', {
    address,
    constructorArguments: args,
    waitConfirmations: 20,
  })

  console.log(`RouteProcessor2 deployed to ${address}`)
}

export default func
