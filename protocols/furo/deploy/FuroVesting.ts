import { BENTOBOX_ADDRESS, WNATIVE_ADDRESS } from '@sushiswap/core-sdk'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  tenderly,
  run,
}: HardhatRuntimeEnvironment): Promise<void> => {
  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  const chainId = Number(await getChainId())

  const args = [BENTOBOX_ADDRESS[chainId], WNATIVE_ADDRESS[chainId]]

  const { address } = await deploy('FuroVesting', {
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
        name: 'FuroVesting',
        address,
      },
    ])

    // await tenderly.verify([
    //   {
    //     name: 'FuroVesting',
    //     address,
    //   },
    // ])
  } catch (error) {
    console.error(error)
  }

  console.log(`Furo Vesting deployed to ${address}`)
}

func.tags = ['FuroVesting']

export default func
