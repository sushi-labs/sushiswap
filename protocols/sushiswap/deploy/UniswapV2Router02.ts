import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/dist/types'

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

  if (!wnative && !(chainId in WNATIVE_ADDRESS) && !process.env.WNATIVE_ADDRESS) {
    throw Error(`No WNATIVE_ADDRESS for chain #${chainId}!`)
  }

  const factory = await ethers.getContract('UniswapV2Factory')

  await deploy('UniswapV2Router02', {
    from: deployer,
    args: [
      factory.address,
      wnative ? wnative.address : chainId in WNATIVE_ADDRESS ? WNATIVE_ADDRESS[chainId] : process.env.WNATIVE_ADDRESS,
    ],
    log: true,
    deterministicDeployment: false,
  })
}

func.tags = ['UniswapV2Router02', 'AMM']

func.dependencies = ['UniswapV2Factory', 'WETH9']

export default func
