import bentoBoxExports from '@sushiswap/bentobox/exports'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
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

  const chainId = (await getChainId()) as keyof Omit<typeof bentoBoxExports, '31337'>

  if (!bentoBoxExports?.[chainId]) {
    throw Error(`No BentoBox deployed on chain ${chainId}`)
  }

  if (!WNATIVE_ADDRESS?.[chainId]) {
    throw Error(`No WNATIVE_ADDRESS for chain ${chainId}`)
  }

  const args = [bentoBoxExports[chainId]?.[0]?.contracts?.BentoBoxV1?.address, WNATIVE_ADDRESS[chainId]]

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
    // await tenderly.verify([
    //   {
    //     name: 'FuroStream',
    //     address,
    //   },
    // ])
  } catch (error) {
    console.error(error)
  }

  console.log(`Furo Stream deployed to ${address}`)
}

func.tags = ['FuroStream']

export default func
