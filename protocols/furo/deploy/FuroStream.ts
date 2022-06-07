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

  const args = [BENTOBOX_ADDRESS[chainId], WNATIVE_ADDRESS[chainId]]

  const { address } = await deploy('FuroStream', {
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
        name: 'FuroStream',
        address,
      },
    ])

    await tenderly.verify([
      {
        name: 'FuroStream',
        address,
      },
    ])
  } catch (error) {
    console.error(error)
  }

  console.log(`Furo Stream deployed to ${address}`)
}

func.tags = ['FuroStream']

export default func
