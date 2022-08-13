import { BENTOBOX_ADDRESS, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  tenderly,
  run,
  ethers,
}: HardhatRuntimeEnvironment): Promise<void> => {
  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  const chainId = Number(await getChainId())

  const { address: furoStreamAddress } = await deployments.get('FuroStream')

  const args = [BENTOBOX_ADDRESS[chainId], furoStreamAddress, WNATIVE_ADDRESS[chainId]]

  const { address } = await deploy('FuroStreamRouter', {
    from: deployer,
    args,
    waitConfirmations: 10,
  })

  try {
    await run('verify:verify', {
      address,
      constructorArguments: args,
    })

    await tenderly.persistArtifacts([
      {
        name: 'FuroStreamRouter',
        address,
      },
    ])
  } catch (error) {
    console.error(error)
  }

  console.log(`Furo Stream Router deployed to ${address}`)
}

func.tags = ['FuroStreamRouter']

export default func
