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

  const { address: furoVestingAddress } = await deployments.get('FuroVesting')

  const args = [BENTOBOX_ADDRESS[chainId], furoVestingAddress, WNATIVE_ADDRESS[chainId]]

  const { address } = await deploy('FuroVestingRouter', {
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
        name: 'FuroVestingRouter',
        address,
      },
    ])
  } catch (error) {
    console.error(error)
  }

  console.log(`Furo Vesting Router deployed to ${address}`)
}

func.tags = ['FuroVestingRouter']

export default func
