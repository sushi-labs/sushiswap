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

  // const wnative = await ethers.getContractOrNull('WETH9')
  // const bentoBox = await ethers.getContractOrNull('BentoBoxV1')

  // if (!wnative && !(chainId in WNATIVE_ADDRESS)) {
  //   throw Error(`No WETH9 deployment for chain #${chainId}!`)
  // }

  // if (!bentoBox && !(chainId in BENTOBOX_ADDRESS)) {
  //   throw Error(`No BentoBox deployment for chain #${chainId}!`)
  // }

  const args = [BENTOBOX_ADDRESS[chainId], WNATIVE_ADDRESS[chainId]]

  const { address } = await deploy('FuroStream', {
    from: deployer,
    args,
    waitConfirmations: 5,
  })

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

  console.log(`Furo Stream deployed to ${address}`)
}

// func.dependencies = ['BentoBoxV1']

func.tags = ['FuroStream']

export default func
