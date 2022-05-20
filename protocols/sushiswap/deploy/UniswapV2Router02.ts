import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'

const { WNATIVE_ADDRESS } = require('@sushiswap/core-sdk')

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  getChainId,
  ethers,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = parseInt(await getChainId())

  const wnative = await ethers.getContractOrNull('WETH9')

  if (!wnative && !(chainId in WNATIVE_ADDRESS)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  const factory = await ethers.getContract('UniswapV2Factory')

  await deploy('UniswapV2Router02', {
    from: deployer,
    args: [factory.address, wnative ? wnative.address : WNATIVE_ADDRESS[chainId]],
    log: true,
    deterministicDeployment: false,
  })
}

func.tags = ['UniswapV2Router02', 'AMM']

func.dependencies = ['UniswapV2Factory', 'WETH9']

export default func
