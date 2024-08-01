import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async ({
  ethers,
  deployments,
  run,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer, funder } = await ethers.getNamedSigners()

  if (!deployer || !funder) throw new Error('Signers not configured')

  console.log('deployer', deployer.address)
  console.log('funder', funder.address)

  const args = ['0x0000000000000000000000000000000000000000', []]

  const RP5 = await ethers.getContractFactory('RouteProcessor5')

  const [estGasLimit, gasPrice] = await Promise.all([
    funder.estimateGas(RP5.getDeployTransaction(...args)),
    funder.getGasPrice(),
  ])

  const estGasLimitWithBuffer = estGasLimit.mul(120).div(100)

  const estGasNeeded = estGasLimitWithBuffer.mul(gasPrice)

  console.log(`Est. gas for deployment: ${estGasNeeded}`)

  const tx = await funder.sendTransaction({
    to: deployer.address,
    value: estGasNeeded,
    gasPrice,
  })

  await tx.wait()

  console.log(`Funding transaction completed: ${tx.hash}`)

  const { address } = await deploy('RouteProcessor5', {
    from: deployer.address,
    args,
    estimatedGasLimit: estGasLimitWithBuffer,
    gasPrice,
  })

  console.log(`RouteProcessor5 deployed to ${address}`)

  await run('verify:verify', {
    address,
    constructorArguments: args,
  })

  console.log('RouteProcessor5 verified')
}

func.tags = ['RouteProcessor5']

export default func
