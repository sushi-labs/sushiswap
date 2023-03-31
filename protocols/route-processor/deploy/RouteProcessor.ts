import { bentoBoxV1Address, isBentoBoxV1ChainId } from '@sushiswap/bentobox'
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

  if (!isBentoBoxV1ChainId(chainId)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  const args = [bentoBoxV1Address[chainId]]

  const { address } = await deploy('RouteProcessor', {
    from: deployer,
    args,
  })

  // await run('verify:verify', {
  //   address,
  //   constructorArguments: args,
  //   waitConfirmations: 20,
  // })

  console.log(`RouteProcessor deployed to ${address}`)
}

export default func
