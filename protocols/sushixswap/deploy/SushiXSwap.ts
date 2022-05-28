import { ChainId } from '@sushiswap/chain'
import { BENTOBOX_ADDRESS, INIT_CODE_HASH } from '@sushiswap/core-sdk'
import sushiSwapExports from '@sushiswap/sushiswap/exports.json'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
export const STARGATE_ROUTER_ADDRESS: Record<number, string> = {
  [ChainId.RINKEBY]: '0x82A0F5F531F9ce0df1DF5619f74a0d3fA31FF561',
  [ChainId.POLYGON_TESTNET]: '0x817436a076060D158204d955E5403b6Ed0A5fac0',
  [ChainId.OPTIMISM]: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
  [ChainId.ARBITRUM]: '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
}

export const USDC_ADDRESS: Record<number, string> = {
  [ChainId.RINKEBY]: '0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4',
  [ChainId.POLYGON_TESTNET]: '0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7',
  [ChainId.ARBITRUM]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  [ChainId.OPTIMISM]: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
}

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  getChainId,
  ethers,
  tenderly,
  run,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const chainId = (await getChainId()) as keyof typeof sushiSwapExports

  const { deployer } = await getNamedAccounts()

  const bentoBox = await ethers.getContractOrNull('BentoBoxV1')
  const factory = await ethers.getContractOrNull('UniswapV2Factory')

  if (!bentoBox && !(chainId in sushiSwapExports)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  if (!(chainId in STARGATE_ROUTER_ADDRESS)) {
    throw Error(`No STARGATE_ROUTER_ADDRESS for chain #${chainId}!`)
  }

  if (!(chainId in USDC_ADDRESS)) {
    throw Error(`No USDC_ADDRESS for chain #${chainId}!`)
  }

  if (!factory && !(chainId in sushiSwapExports)) {
    throw Error(`No FACTORY_ADDRESS for chain #${chainId}!`)
  }

  // if (!(chainId in INIT_CODE_HASH)) {
  //   throw Error(`No INIT_CODE_HASH for chain #${chainId}!`);
  // }

  const args = [
    BENTOBOX_ADDRESS[chainId],
    STARGATE_ROUTER_ADDRESS[chainId],
    sushiSwapExports?.[chainId]?.[0]?.contracts?.UniswapV2Factory ?? ethers.constants.AddressZero,
    INIT_CODE_HASH?.[chainId] ?? ethers.constants.HashZero,
  ]

  const { address } = await deploy('SushiXSwap', {
    from: deployer,
    args,
    deterministicDeployment: false,
  })

  const contract = await ethers.getContract('SushiXSwap')

  await contract.approveToStargateRouter(USDC_ADDRESS[chainId])

  await run('verify:verify', {
    address,
    constructorArguments: args,
    waitConfirmations: 10,
  })

  await tenderly.persistArtifacts([
    {
      name: 'SushiXSwap',
      address: contract.address,
    },
  ])

  await tenderly.verify([
    {
      name: 'SushiXSwap',
      address: contract.address,
    },
  ])

  console.log(`SushiXSwap deployed on chain #${chainId} at address ${address}`)
}

func.dependencies = ['BentoBoxV1']

func.tags = ['SushiXSwap']

func.skip = ({ getChainId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const chainId = await getChainId()
      resolve(chainId === '31337')
    } catch (error) {
      reject(error)
    }
  })

export default func
