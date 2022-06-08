import bentoBoxExports from '@sushiswap/bentobox/exports.json'
import { INIT_CODE_HASH } from '@sushiswap/exchange'
import { STARGATE_BRIDGE_TOKENS, STARGATE_ROUTER_ADDRESS, STARGATE_USDC_ADDRESS } from '@sushiswap/stargate'
import sushiSwapExports from '@sushiswap/sushiswap/exports.json'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  getChainId,
  ethers,
  tenderly,
  run,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const chainId = (await getChainId()) as keyof (typeof sushiSwapExports | typeof bentoBoxExports)

  const { deployer } = await getNamedAccounts()

  const bentoBox = await ethers.getContractOrNull('BentoBoxV1')
  const factory = await ethers.getContractOrNull('UniswapV2Factory')

  if (!bentoBox && !(chainId in bentoBoxExports)) {
    throw Error(`No BENTOBOX_ADDRESS for chain #${chainId}!`)
  }

  if (!(chainId in STARGATE_ROUTER_ADDRESS)) {
    throw Error(`No STARGATE_ROUTER_ADDRESS for chain #${chainId}!`)
  }

  if (!(chainId in STARGATE_USDC_ADDRESS)) {
    throw Error(`No STARGATE_USDC_ADDRESS for chain #${chainId}!`)
  }

  if (!factory && !(chainId in sushiSwapExports)) {
    // throw Error(`No FACTORY_ADDRESS for chain #${chainId}!`)
    console.warn(`No FACTORY_ADDRESS for chain #${chainId}!`)
  }

  if ((factory || chainId in sushiSwapExports) && !(chainId in INIT_CODE_HASH)) {
    throw Error(`No INIT_CODE_HASH for chain #${chainId}!`)
  }

  const args = [
    bentoBoxExports?.[chainId as unknown as keyof Omit<typeof bentoBoxExports, '31337'>]?.[0]?.contracts?.BentoBoxV1
      ?.address,
    STARGATE_ROUTER_ADDRESS[chainId],
    sushiSwapExports?.[chainId as unknown as keyof Omit<typeof sushiSwapExports, '31337'>]?.[0]?.contracts
      ?.UniswapV2Factory.address ?? ethers.constants.AddressZero,
    INIT_CODE_HASH?.[chainId] ?? ethers.constants.HashZero,
  ]

  const { address } = await deploy('SushiXSwap', {
    from: deployer,
    args,
    deterministicDeployment: false,
  })

  const contract = await ethers.getContract('SushiXSwap')

  for (const token of STARGATE_BRIDGE_TOKENS[chainId]) {
    await contract.approveToStargateRouter(token.address)
  }

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
  new Promise((resolve, reject) => {
    getChainId()
      .then((chainId) => resolve(chainId === '31337'))
      .catch((error) => reject(error))
  })

export default func
